/* ============================================================
   Waggle checkout API — Cloudflare Worker (ES module).

     GET  /api/status    -> { payments: boolean }
     POST /api/checkout  -> { id, url }  Stripe Checkout session
     GET  /api/session   -> paid order summary for the thank-you page
     *                   -> static assets via env.ASSETS

   Totals are computed here from server/prices.js, never from the
   browser. Needs STRIPE_SECRET_KEY as a secret; without it the
   API answers 503 and the site stays in demo mode.
   ============================================================ */

import { CATALOGUE, CURRENCY, FREE_SHIPPING_AT, SHIPPING_FLAT } from './prices.js'

const STRIPE_API = 'https://api.stripe.com/v1'
const MAX_LINES = 40
const MAX_QUANTITY = 99

class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  })

/* ------------------------------------------------------------
   Repricing
   ------------------------------------------------------------ */

/** Turn a browser cart into the lines Stripe will charge. Throws HttpError on anything odd. */
export function priceCart(items) {
  if (!Array.isArray(items) || items.length === 0) throw new HttpError(400, 'Your bag is empty.')
  if (items.length > MAX_LINES) throw new HttpError(400, 'That is too many different items for one order.')

  const lines = items.map((raw) => {
    const slug = raw && typeof raw.slug === 'string' ? raw.slug : ''
    const product = CATALOGUE[slug]
    if (!product) throw new HttpError(400, 'One of those products is no longer for sale. Please refresh your bag.')

    const quantity = Math.floor(Number(raw.quantity))
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      throw new HttpError(400, 'Quantities need to be between 1 and 99.')
    }

    let unitAmount = product.price
    let option = ''
    if (product.options) {
      const label = typeof raw.option === 'string' ? raw.option : ''
      if (!Object.prototype.hasOwnProperty.call(product.options, label)) {
        throw new HttpError(400, `Please pick an option for ${product.name}.`)
      }
      unitAmount += product.options[label]
      option = label
    }

    return { slug, name: product.name, option, quantity, unitAmount }
  })

  const subtotal = lines.reduce((sum, line) => sum + line.unitAmount * line.quantity, 0)
  const shipping = subtotal >= FREE_SHIPPING_AT ? 0 : SHIPPING_FLAT

  return { lines, subtotal, shipping, total: subtotal + shipping }
}

function normalizeCustomer(raw) {
  const text = (value, max = 120) => String(value == null ? '' : value).trim().slice(0, max)
  const customer = {
    email: text(raw && raw.email, 200),
    name: text(raw && raw.name, 120),
    address: text(raw && raw.address, 200),
    city: text(raw && raw.city, 100),
    postcode: text(raw && raw.postcode, 24),
    country: text(raw && raw.country, 60),
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(customer.email)) {
    throw new HttpError(400, 'That email address does not look right.')
  }
  if (!customer.name || !customer.address || !customer.city || !customer.postcode) {
    throw new HttpError(400, 'Please fill in the delivery details.')
  }
  return customer
}

/* ------------------------------------------------------------
   Stripe
   ------------------------------------------------------------ */

async function createCheckout(request, env, url) {
  const origin = request.headers.get('origin')
  if (origin && origin !== url.origin) return json({ error: 'Cross-origin request blocked.' }, 403)
  if (!env.STRIPE_SECRET_KEY) {
    return json({ error: 'Card payments are not switched on yet. Add the STRIPE_SECRET_KEY secret to enable them.' }, 503)
  }

  let payload = null
  try {
    payload = await request.json()
  } catch {
    payload = null
  }
  if (!payload) throw new HttpError(400, 'Missing order details.')

  const { lines, subtotal, shipping, total } = priceCart(payload.items)
  const customer = normalizeCustomer(payload.customer)
  const reference = `WG-${crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()}`

  const itemsSummary = lines
    .map((line) => `${line.quantity} × ${line.name}${line.option ? ` (${line.option})` : ''}`)
    .join(', ')
    .slice(0, 490)

  const body = new URLSearchParams()
  body.set('mode', 'payment')
  body.set('success_url', `${url.origin}/#/order?paid={CHECKOUT_SESSION_ID}`)
  body.set('cancel_url', `${url.origin}/#/checkout`)
  body.set('customer_email', customer.email)
  body.set('billing_address_collection', 'auto')

  // Cards (and the Apple Pay / Google Pay wallets that sit on top of them)
  // always work. The "bank or mobile banking" choice instead lets Stripe show
  // whichever bank methods are live on the account for the customer's country.
  const chooseBank = payload.method === 'auto'
  if (chooseBank) {
    body.set('automatic_payment_methods[enabled]', 'true')
  } else {
    body.set('payment_method_types[0]', 'card')
  }
  body.set('metadata[pay_choice]', chooseBank ? 'bank-or-card' : 'card')

  body.set('metadata[reference]', reference)
  body.set('metadata[customer_name]', customer.name)
  body.set('metadata[customer_email]', customer.email)
  body.set('metadata[ship_address]', customer.address)
  body.set('metadata[ship_city]', customer.city)
  body.set('metadata[ship_postcode]', customer.postcode)
  body.set('metadata[ship_country]', customer.country)
  body.set('metadata[items]', itemsSummary)

  body.set('payment_intent_data[description]', `Waggle order ${reference}`)
  body.set('payment_intent_data[metadata][reference]', reference)

  lines.forEach((line, index) => {
    const name = line.option ? `${line.name} — ${line.option}` : line.name
    body.set(`line_items[${index}][quantity]`, String(line.quantity))
    body.set(`line_items[${index}][price_data][currency]`, CURRENCY)
    body.set(`line_items[${index}][price_data][unit_amount]`, String(line.unitAmount))
    body.set(`line_items[${index}][price_data][product_data][name]`, name)
  })

  if (shipping > 0) {
    const index = lines.length
    body.set(`line_items[${index}][quantity]`, '1')
    body.set(`line_items[${index}][price_data][currency]`, CURRENCY)
    body.set(`line_items[${index}][price_data][unit_amount]`, String(shipping))
    body.set(`line_items[${index}][price_data][product_data][name]`, 'Shipping')
    body.set(`line_items[${index}][price_data][product_data][description]`, 'Shipping')
  }

  const response = await fetch(`${STRIPE_API}/checkout/sessions`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      'content-type': 'application/x-www-form-urlencoded',
    },
    body,
  })
  const session = await response.json()

  if (!response.ok) {
    const message = (session && session.error && session.error.message) || 'Stripe rejected that order.'
    throw new HttpError(502, message)
  }

  return json({
    id: session.id,
    url: session.url,
    reference,
    total: total / 100,
    subtotal: subtotal / 100,
    shipping: shipping / 100,
  })
}

async function readSession(url, env) {
  if (!env.STRIPE_SECRET_KEY) return json({ error: 'Card payments are not switched on yet.' }, 503)

  const id = url.searchParams.get('id') || ''
  if (!/^cs_[A-Za-z0-9_]+$/.test(id)) return json({ error: 'Unknown order.' }, 400)

  const response = await fetch(`${STRIPE_API}/checkout/sessions/${id}?expand%5B%5D=line_items`, {
    headers: { authorization: `Bearer ${env.STRIPE_SECRET_KEY}` },
  })
  const session = await response.json()

  if (!response.ok) {
    throw new HttpError(response.status === 404 ? 404 : 502, 'We could not find that payment.')
  }
  if (session.payment_status !== 'paid') {
    return json({ error: 'That payment has not gone through yet. If you were charged, check your Stripe receipt.' }, 402)
  }

  const all = (session.line_items && session.line_items.data) || []
  const label = (line) => line.description || (line.price && line.price.nickname) || 'Item'
  const shippingLine = all.find((line) => label(line).toLowerCase() === 'shipping')
  const items = all
    .filter((line) => line !== shippingLine)
    .map((line) => ({ name: label(line), quantity: line.quantity, amount: line.amount }))

  return json({
    id: session.id,
    reference: (session.metadata && session.metadata.reference) || session.id,
    email: (session.customer_details && session.customer_details.email) || (session.metadata && session.metadata.customer_email) || '',
    name: (session.metadata && session.metadata.customer_name) || (session.customer_details && session.customer_details.name) || '',
    amountTotal: session.amount_total || 0,
    currency: session.currency || CURRENCY,
    items,
    shipping: shippingLine ? shippingLine.amount : 0,
  })
}

/* ------------------------------------------------------------
   Router
   ------------------------------------------------------------ */

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    try {
      if (url.pathname === '/api/status') {
        return json({ payments: Boolean(env.STRIPE_SECRET_KEY) })
      }
      if (url.pathname === '/api/checkout') {
        if (request.method !== 'POST') return json({ error: 'Use POST for this endpoint.' }, 405)
        return await createCheckout(request, env, url)
      }
      if (url.pathname === '/api/session') {
        if (request.method !== 'GET') return json({ error: 'Use GET for this endpoint.' }, 405)
        return await readSession(url, env)
      }
      if (url.pathname.startsWith('/api/')) {
        return json({ error: 'Unknown endpoint.' }, 404)
      }
      return env.ASSETS.fetch(request)
    } catch (error) {
      if (error instanceof HttpError) return json({ error: error.message }, error.status)
      return json({ error: 'Something went wrong on our side. Please try again.' }, 500)
    }
  },
}
