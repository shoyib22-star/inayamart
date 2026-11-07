/* ============================================================
   Cart state, persisted in localStorage.
   A line is { key, slug, option, unitPrice, quantity }.
   Every change fires a `cart:change` event on document.
   ============================================================ */

const CART_KEY = 'waggle-cart-v1'

const lineKey = (slug, option) => `${slug}::${option || ''}`

let cartLines = readCart()

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((line) => line && typeof line.slug === 'string' && bySlug(line.slug) && Number(line.quantity) > 0)
      .map((line) => ({
        key: lineKey(line.slug, line.option),
        slug: line.slug,
        option: line.option || undefined,
        unitPrice: Number.isFinite(line.unitPrice) ? line.unitPrice : bySlug(line.slug).price,
        quantity: Math.min(99, Math.max(1, Math.floor(Number(line.quantity)))),
      }))
  } catch {
    return []
  }
}

function writeCart() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cartLines))
  } catch {
    /* private mode: the cart still works for this page view */
  }
  document.dispatchEvent(new CustomEvent('cart:change'))
}

const cart = {
  get lines() {
    return cartLines
  },
  get count() {
    return cartLines.reduce((sum, line) => sum + line.quantity, 0)
  },
  get subtotal() {
    return cartLines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0)
  },
  get items() {
    return cartLines
      .map((line) => ({ ...line, product: bySlug(line.slug) }))
      .filter((item) => item.product)
  },
  has(slug) {
    return cartLines.some((line) => line.slug === slug)
  },
  add(product, option, quantity = 1, unitPrice) {
    const price = Number.isFinite(unitPrice) ? unitPrice : product.price
    const key = lineKey(product.slug, option)
    const existing = cartLines.find((line) => line.key === key)
    if (existing) {
      existing.quantity = Math.min(99, existing.quantity + quantity)
      existing.unitPrice = price
    } else {
      cartLines = [...cartLines, { key, slug: product.slug, option, unitPrice: price, quantity }]
    }
    writeCart()
  },
  setQuantity(key, quantity) {
    if (quantity <= 0) return cart.remove(key)
    cartLines = cartLines.map((line) => (line.key === key ? { ...line, quantity: Math.min(99, quantity) } : line))
    writeCart()
  },
  remove(key) {
    cartLines = cartLines.filter((line) => line.key !== key)
    writeCart()
  },
  clear() {
    cartLines = []
    writeCart()
  },
}
