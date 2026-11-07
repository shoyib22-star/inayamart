/* ============================================================
   Waggle — router, views and interactions.
   Plain browser JavaScript: no build step, no dependencies.
   ============================================================ */

const $ = (selector, root = document) => root.querySelector(selector)
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector))

const icons = {
  search:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4.2-4.2"/></svg>',
  bag:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5.5 8h13l-1.1 12.1a1.6 1.6 0 0 1-1.6 1.4H8.2a1.6 1.6 0 0 1-1.6-1.4z"/><path d="M9 8V6.4a3 3 0 0 1 6 0V8"/></svg>',
  close:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  menu:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  plus:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  minus:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M5 12h14"/></svg>',
  check:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4.5 4.5L19 7"/></svg>',
  star:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.6l2.9 6.1 6.7.9-4.9 4.7 1.2 6.6-5.9-3.2-5.9 3.2 1.2-6.6L2.4 9.6l6.7-.9z"/></svg>',
  truck:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h10v9H3z"/><path d="M13 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/></svg>',
  shield:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5.5c0 4.4-2.9 8.1-7 9.5-4.1-1.4-7-5.1-7-9.5V6z"/><path d="M9 12l2 2 4-4"/></svg>',
  heart:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.4-7-9.2A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.8C19 15.6 12 20 12 20z"/></svg>',
  lock:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10" width="14" height="10" rx="2.5"/><path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10"/></svg>',
  leaf:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20c0-9 6-15 16-16 1 10-5 16-14 16z"/><path d="M4 20c4-6 8-9 13-11"/></svg>',
  instagram:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r="1.2" fill="currentColor" stroke="none"/></svg>',
  tiktok:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.5 3h2.2c.3 1.9 1.5 3.3 3.3 3.6v2.3c-1.3 0-2.5-.4-3.5-1.1v6.4a6 6 0 1 1-6-6c.3 0 .6 0 .9.1v2.4a3.6 3.6 0 1 0 2.6 3.5z"/></svg>',
  mail:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7l8 6 8-6"/></svg>',
}

/* ------------------------------------------------------------
   Small helpers
   ------------------------------------------------------------ */

const esc = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
  )

const state = {
  q: '',
  productSlug: '',
  optionIndex: 0,
  quantity: 1,
}

const view = $('#view')
const drawer = $('#drawer')
const toastEl = $('#toast')
let toastTimer = 0

function toast(message) {
  toastEl.innerHTML = `${icons.check}<span>${esc(message)}</span>`
  toastEl.classList.add('is-on')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 2600)
}

function parseHash() {
  const raw = location.hash.replace(/^#/, '')
  const [pathPart, queryPart] = raw.split('?')
  let path = pathPart || '/'
  if (!path.startsWith('/')) path = `/${path}`
  if (path.length > 1) path = path.replace(/\/+$/, '')
  return { path, params: new URLSearchParams(queryPart || '') }
}

function shopUrl(params) {
  const query = params.toString()
  return `#/shop${query ? `?${query}` : ''}`
}

function petLabel(product) {
  if (product.pets.length > 1) return 'Dogs & cats'
  return product.pets[0] === 'dog' ? 'For dogs' : 'For cats'
}

/* ------------------------------------------------------------
   Product cards
   ------------------------------------------------------------ */

function badgeMarkup(product) {
  if (product.compareAt && product.badge !== 'Low stock') {
    return '<span class="card__badge card__badge--sale">Sale</span>'
  }
  if (product.badge === 'New') return '<span class="card__badge card__badge--new">New</span>'
  if (product.badge === 'Low stock') return '<span class="card__badge card__badge--low">Low stock</span>'
  if (product.badge === 'Bestseller') return '<span class="card__badge">Bestseller</span>'
  return ''
}

function cardMarkup(product) {
  return `
    <article class="card">
      <div class="card__art" style="background:${product.tint}">
        <a class="card__art-link" href="#/product/${product.slug}" tabindex="-1" aria-hidden="true">${productArt(product.art)}</a>
        ${badgeMarkup(product)}
        <button type="button" class="card__quick" data-add="${product.slug}" aria-label="Add ${esc(product.name)} to bag">${icons.plus}</button>
      </div>
      <div class="card__info">
        <p class="card__pets">${petLabel(product)}</p>
        <a class="card__name" href="#/product/${product.slug}">${esc(product.name)}</a>
        <p class="card__sub">${esc(product.short)}</p>
        <div class="card__foot">
          <span class="price">${money(product.price)}</span>
          ${product.compareAt ? `<span class="price--was">${money(product.compareAt)}</span>` : ''}
        </div>
      </div>
    </article>`
}

function gridMarkup(list) {
  return list.map(cardMarkup).join('')
}

/* ------------------------------------------------------------
   Home
   ------------------------------------------------------------ */

function homeView() {
  const newIn = newArrivals.length >= 4 ? newArrivals.slice(0, 4) : products.slice(0, 4)
  const bestsellers = products.filter((p) => p.badge === 'Bestseller').slice(0, 4)
  const fallbackBest = bestsellers.length ? bestsellers : featured

  return `
    <section class="hero">
      <div class="shell hero__grid">
        <div class="hero__copy">
          <span class="pill"><span class="pill__dot"></span> Free shipping over ${money(FREE_SHIPPING_AT)}</span>
          <h1 class="hero__title">Good stuff for<br><span class="hl">very good</span> pets.</h1>
          <p class="lede">Food, toys, medicine and all the little daily things — chosen by people who talk to their dogs. Everyone here does.</p>
          <div class="hero__cta">
            <a class="btn btn--lg" href="#/shop">Shop everything ${arrowRight()}</a>
            <a class="btn btn--plain btn--lg" href="#/shop?pet=dog">Shop for dogs</a>
          </div>
          <ul class="hero__proof">
            <li>${icons.star} 4.9 from 2,400 pet parents</li>
            <li>${icons.truck} Dispatched same day before 2pm</li>
            <li>${icons.heart} 30-day happy-tail guarantee</li>
          </ul>
        </div>
        <div class="hero__art">
          <div class="hero__blob"></div>
          <figure class="hero__pets">
            <div class="pet-portrait pet-portrait--dog">${dogFace()}</div>
            <div class="pet-portrait pet-portrait--cat">${catFace()}</div>
          </figure>
          <div class="badge-card badge-card--a">${pawMark()} Vet approved</div>
          <div class="badge-card badge-card--b">${icons.truck} Free over ${money(FREE_SHIPPING_AT)}</div>
          <span class="sparkle sparkle--a">${starBurst()}</span>
          <span class="sparkle sparkle--b">${starBurst()}</span>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="shell">
        <div class="section-head">
          <div>
            <p class="eyebrow">Find it fast</p>
            <h2 class="section-head__title">Shop by category</h2>
          </div>
          <a class="link-more" href="#/shop">All products ${arrowRight()}</a>
        </div>
        <div class="cat-grid">
          ${categories
            .map(
              (category) => `
            <a class="cat-card" href="#/shop?category=${category.key}">
              <span class="cat-card__art" style="background:${category.tint}">${categoryArt(category.art)}</span>
              <span class="cat-card__label">${category.label}</span>
              <span class="cat-card__blurb">${category.blurb}</span>
            </a>`,
            )
            .join('')}
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="shell">
        <div class="pet-grid">
          <a class="pet-card pet-card--dog" href="#/shop?pet=dog">
            <div class="pet-card__body">
              <h3>Dogs</h3>
              <p>Big appetites, bigger opinions</p>
              <span class="link-more" style="margin-top:14px">Shop dog ${arrowRight()}</span>
            </div>
            <div class="pet-card__art">${dogFace()}</div>
          </a>
          <a class="pet-card pet-card--cat" href="#/shop?pet=cat">
            <div class="pet-card__body">
              <h3>Cats</h3>
              <p>Fussy, fluffy, entirely in charge</p>
              <span class="link-more" style="margin-top:14px">Shop cat ${arrowRight()}</span>
            </div>
            <div class="pet-card__art">${catFace()}</div>
          </a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="shell">
        <div class="section-head">
          <div>
            <p class="eyebrow">Just landed</p>
            <h2 class="section-head__title">New in the shop</h2>
          </div>
          <a class="link-more" href="#/shop?sort=new">See what's new ${arrowRight()}</a>
        </div>
        <div class="product-grid">${gridMarkup(newIn)}</div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="shell">
        <div class="promo">
          <div>
            <span class="pill pill--sun">The Waggle promise</span>
            <h2 style="margin-top:16px">If they won't eat it, wear it or chase it, we'll swap it.</h2>
            <p>Free shipping over ${money(FREE_SHIPPING_AT)}, 30 days to change your mind, and a real human answering the emails. Usually covered in fur.</p>
            <div class="promo__cta">
              <a class="btn btn--ink" href="#/shop">Start shopping ${arrowRight()}</a>
              <a class="btn btn--plain" href="#/about">How we choose</a>
            </div>
          </div>
          <div class="promo__art">${productArt('duck')}</div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="shell">
        <div class="section-head">
          <div>
            <p class="eyebrow">Pet approved</p>
            <h2 class="section-head__title">Bestsellers</h2>
          </div>
          <a class="link-more" href="#/shop">Shop all ${arrowRight()}</a>
        </div>
        <div class="product-grid">${gridMarkup(fallbackBest)}</div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="shell">
        <div class="section-head">
          <div>
            <p class="eyebrow">Kind words</p>
            <h2 class="section-head__title">Tails are wagging</h2>
          </div>
        </div>
        <div class="reviews">
          <article class="review">
            <div class="review__stars">${icons.star.repeat(5)}</div>
            <p class="review__text">“The donut bed arrived on Tuesday and Biscuit has not left it since. I have been replaced as his favourite thing.”</p>
            <p class="review__who"><span class="review__avatar">M</span><span><b style="color:var(--ink)">Maya &amp; Biscuit</b>Donut bed, size medium</span></p>
          </article>
          <article class="review">
            <div class="review__stars">${icons.star.repeat(5)}</div>
            <p class="review__text">“Finally a pâté that Miso finishes. She usually walks away halfway through just to make a point.”</p>
            <p class="review__who"><span class="review__avatar" style="background:var(--lilac-soft)">J</span><span><b style="color:var(--ink)">Jonas &amp; Miso</b>Salmon pâté, six pack</span></p>
          </article>
          <article class="review">
            <div class="review__stars">${icons.star.repeat(5)}</div>
            <p class="review__text">“The flea drops actually work and the packaging tells you what to do. My vet approved, which never happens.”</p>
            <p class="review__who"><span class="review__avatar" style="background:var(--sun-soft)">P</span><span><b style="color:var(--ink)">Priya &amp; Otis</b>Flea &amp; tick drops</span></p>
          </article>
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="shell">
        <div class="newsletter">
          <div>
            <h2>Treats in your inbox</h2>
            <p>New toys, restocks and the occasional dog photo. One email a month, no nonsense.</p>
          </div>
          <div>
            <form class="newsletter__form" id="newsletterForm" novalidate>
              <label class="sr-only" for="newsletterEmail">Email address</label>
              <input class="input" id="newsletterEmail" name="email" type="email" placeholder="you@example.com" required />
              <button class="btn btn--ink" type="submit">Sign me up</button>
            </form>
            <p class="newsletter__note" id="newsletterNote">10% off your first order when you join.</p>
          </div>
        </div>
      </div>
    </section>`
}

/* ------------------------------------------------------------
   Shop
   ------------------------------------------------------------ */

const priceRanges = [
  { key: '', label: 'Any price' },
  { key: '0-20', label: 'Under $20' },
  { key: '20-40', label: '$20 to $40' },
  { key: '40-', label: 'Over $40' },
]

const sortOptions = [
  { key: 'featured', label: 'Featured' },
  { key: 'new', label: 'Newest' },
  { key: 'price-asc', label: 'Price: low to high' },
  { key: 'price-desc', label: 'Price: high to low' },
]

function filterProducts({ category, pet, price, q, sort }) {
  let list = products.slice()

  if (category) list = list.filter((product) => product.category === category)
  if (pet) list = list.filter((product) => product.pets.includes(pet))
  if (price) {
    const [min, max] = price.split('-').map((part) => (part === '' ? null : Number(part)))
    list = list.filter((product) => (min === null || product.price >= min) && (max === null || product.price < max))
  }
  if (q) {
    const needle = q.toLowerCase()
    list = list.filter((product) =>
      `${product.name} ${product.short} ${product.category} ${product.description} ${product.pets.join(' ')}`
        .toLowerCase()
        .includes(needle),
    )
  }

  if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
  else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
  else if (sort === 'new') list.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)))
  else list.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))

  return list
}

function filterButtonsMarkup({ facet, activeKey, entries }) {
  return entries
    .map((entry) => {
      const active = activeKey === entry.key
      return `<button type="button" class="${active ? 'filter-btn is-active' : 'filter-btn'}" data-facet="${facet}" data-value="${entry.key}" aria-pressed="${active}">
        ${entry.label}<span class="filter-btn__count">${entry.count}</span>
      </button>`
    })
    .join('')
}

function filtersMarkup({ category, pet, price }) {
  const categoryEntries = [
    { key: '', label: 'Everything', count: products.length },
    ...categories.map((c) => ({
      key: c.key,
      label: c.label,
      count: products.filter((p) => p.category === c.key).length,
    })),
  ]
  const petEntries = [
    { key: '', label: 'All pets', count: products.length },
    ...petFilters.map((p) => ({
      key: p.key,
      label: p.label,
      count: products.filter((product) => product.pets.includes(p.key)).length,
    })),
  ]
  const priceEntries = priceRanges.map((range) => ({
    key: range.key,
    label: range.label,
    count: filterProducts({ category, pet, price: range.key, q: state.q, sort: 'featured' }).length,
  }))

  return `
    <div class="filters__group">
      <p class="filters__label">Category</p>
      ${filterButtonsMarkup({ facet: 'category', activeKey: category, entries: categoryEntries })}
    </div>
    <div class="filters__group">
      <p class="filters__label">Shop for</p>
      ${filterButtonsMarkup({ facet: 'pet', activeKey: pet, entries: petEntries })}
    </div>
    <div class="filters__group">
      <p class="filters__label">Price</p>
      ${filterButtonsMarkup({ facet: 'price', activeKey: price, entries: priceEntries })}
    </div>`
}

function shopView(params) {
  const category = params.get('category') || ''
  const pet = params.get('pet') || ''
  const price = params.get('price') || ''
  const sort = params.get('sort') || 'featured'
  const q = state.q
  const list = filterProducts({ category, pet, price, q, sort })

  const activeCategory = categoryByKey(category)
  const title = activeCategory ? activeCategory.label : pet === 'dog' ? 'For dogs' : pet === 'cat' ? 'For cats' : 'All products'
  const activeCount = [category, pet, price, q].filter(Boolean).length

  return `
    <section class="shop-head">
      <div class="shell">
        <div class="shop-head__row">
          <div>
            <p class="eyebrow">The shop</p>
            <h1>${esc(title)}</h1>
            <p class="lede">Everything in one place, sorted so the good stuff is easy to find. Add whatever you like — the bag remembers.</p>
          </div>
          <p class="shop-count" id="shopCount">${list.length} ${list.length === 1 ? 'product' : 'products'}</p>
        </div>
      </div>
    </section>

    <div class="shell">
      <div class="shop-bar">
        <div class="search">
          ${icons.search}
          <label class="sr-only" for="shopSearch">Search products</label>
          <input class="input" id="shopSearch" type="search" value="${esc(q)}" placeholder="Search food, toys, flea drops…" autocomplete="off" />
        </div>
        <div class="select-wrap">
          <label class="sr-only" for="shopSort">Sort products</label>
          <select class="select" id="shopSort">
            ${sortOptions
              .map((option) => `<option value="${option.key}"${sort === option.key ? ' selected' : ''}>${option.label}</option>`)
              .join('')}
          </select>
        </div>
        ${activeCount > 0 ? `<button type="button" class="chip" data-clear-filters>Clear filters (${activeCount}) ${icons.close}</button>` : ''}
      </div>

      <div class="shop-layout">
        <aside class="filters" aria-label="Filters">
          ${filtersMarkup({ category, pet, price })}
        </aside>

        <div>
          <details class="filters-mobile">
            <summary>${icons.menu} Filters${activeCount ? ` (${activeCount})` : ''}</summary>
            <div class="filters">${filtersMarkup({ category, pet, price })}</div>
          </details>

          <div id="shopGrid" class="product-grid product-grid--3">${gridMarkup(list)}</div>
          <div id="shopEmpty" ${list.length ? 'hidden' : ''}>
            <div class="shop-empty">
              <h3>No luck with that one</h3>
              <p>Try a different word, or clear the filters and browse the whole shop.</p>
              <a class="btn btn--plain" href="#/shop">Browse everything</a>
            </div>
          </div>
        </div>
      </div>
    </div>`
}

function renderShopResults(params) {
  const grid = $('#shopGrid')
  if (!grid) return
  const list = filterProducts({
    category: params.get('category') || '',
    pet: params.get('pet') || '',
    price: params.get('price') || '',
    q: state.q,
    sort: params.get('sort') || 'featured',
  })
  grid.innerHTML = gridMarkup(list)
  const count = $('#shopCount')
  if (count) count.textContent = `${list.length} ${list.length === 1 ? 'product' : 'products'}`
  const empty = $('#shopEmpty')
  if (empty) empty.hidden = list.length > 0
}

/* ------------------------------------------------------------
   Product
   ------------------------------------------------------------ */

function productView(slug) {
  const product = bySlug(slug)
  if (!product) return null

  if (state.productSlug !== slug) {
    state.productSlug = slug
    state.optionIndex = 0
    state.quantity = 1
  }

  const option = product.options ? product.options.values[state.optionIndex] || product.options.values[0] : null
  const unitPrice = product.price + (option && option.add ? option.add : 0)
  const quantity = state.quantity
  const related = [
    ...products.filter((p) => p.slug !== product.slug && p.category === product.category),
    ...products.filter((p) => p.slug !== product.slug && p.category !== product.category),
  ].slice(0, 4)

  const optionMarkup = product.options
    ? `
      <div class="options">
        <p class="options__label">${product.options.name} <span>${esc(option.label)}</span></p>
        <div class="options__list">
          ${product.options.values
            .map(
              (value, index) => `
            <button type="button" class="option-btn${index === state.optionIndex ? ' is-active' : ''}" data-option="${index}" aria-pressed="${index === state.optionIndex}">
              ${esc(value.label)}${value.add ? `<small>+${money(value.add)}</small>` : ''}
            </button>`,
            )
            .join('')}
        </div>
      </div>`
    : ''

  return `
    <div class="shell">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="#/">Home</a><span>/</span>
        <a href="#/shop?category=${product.category}">${categoryByKey(product.category).label}</a><span>/</span>
        <span style="color:var(--ink)">${esc(product.name)}</span>
      </nav>

      <div class="product">
        <div class="product__art" style="background:${product.tint}">${productArt(product.art)}</div>

        <div class="product__info">
          <div class="product__badges">
            ${product.badge ? `<span class="pill pill--sun">${product.badge}</span>` : ''}
            ${product.compareAt ? `<span class="pill" style="background:var(--pink-soft)">Save ${money(product.compareAt - product.price)}</span>` : ''}
            <span class="pill pill--lilac">${petLabel(product)}</span>
          </div>
          <h1 class="product__title">${esc(product.name)}</h1>
          <div class="product__price">
            <span class="price">${money(unitPrice)}</span>
            ${product.compareAt ? `<span class="price--was">${money(product.compareAt)}</span>` : ''}
            <span style="font-size:13.5px;font-weight:800;color:var(--ink-soft)">${esc(product.short)}</span>
          </div>
          <p class="product__lede">${esc(product.description)}</p>

          ${optionMarkup}

          <div class="buy-row">
            <div class="qty">
              <button type="button" data-qty="dec" aria-label="Decrease quantity">−</button>
              <span aria-live="polite">${quantity}</span>
              <button type="button" data-qty="inc" aria-label="Increase quantity">+</button>
            </div>
            <button type="button" class="btn btn--lg" data-detail-add="${product.slug}">
              Add to bag — ${money(unitPrice * quantity)}
            </button>
          </div>

          <ul class="buy-note">
            <li>${icons.truck} Free shipping over ${money(FREE_SHIPPING_AT)}</li>
            <li>${icons.heart} 30-day returns</li>
            <li>${icons.shield} Vet-checked range</li>
          </ul>

          <div class="accordion">
            <details open>
              <summary>Why it's good</summary>
              <ul class="accordion__body">
                ${product.bullets.map((line) => `<li>${esc(line)}</li>`).join('')}
              </ul>
            </details>
            <details>
              <summary>${esc(product.spec.label)}</summary>
              <ul class="accordion__body"><li>${esc(product.spec.body)}</li></ul>
            </details>
            <details>
              <summary>Shipping &amp; returns</summary>
              <ul class="accordion__body">
                <li>Packed in recycled boxes and dispatched within one working day. Free over ${money(FREE_SHIPPING_AT)}, otherwise ${money(SHIPPING_FLAT)}.</li>
                <li>Not a hit? Send it back within 30 days, opened or not, and we will refund you.</li>
                <li>Health products are non-returnable once opened. Ask your vet if you are unsure.</li>
              </ul>
            </details>
          </div>
        </div>
      </div>

      <section class="related">
        <div class="section-head">
          <div>
            <p class="eyebrow">Goes well with</p>
            <h2 class="section-head__title">You might also like</h2>
          </div>
          <a class="link-more" href="#/shop?category=${product.category}">More ${categoryByKey(product.category).label.toLowerCase()} ${arrowRight()}</a>
        </div>
        <div class="product-grid">${gridMarkup(related)}</div>
      </section>
    </div>`
}

/* ------------------------------------------------------------
   Checkout
   ------------------------------------------------------------ */

const countries = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Netherlands', 'Spain', 'Ireland']

function summaryLinesMarkup() {
  return cart.items
    .map(
      (item) => `
      <div class="summary__line">
        <span class="line__art" style="background:${item.product.tint}">${productArt(item.product.art)}</span>
        <span>
          <span class="summary__line-name">${esc(item.product.name)}</span>
          <span class="summary__line-meta">${item.option ? `${esc(item.option)} · ` : ''}× ${item.quantity}</span>
        </span>
        <span class="summary__line-price">${money(item.unitPrice * item.quantity)}</span>
      </div>`,
    )
    .join('')
}

function shippingFor(subtotal) {
  return subtotal >= FREE_SHIPPING_AT || subtotal === 0 ? 0 : SHIPPING_FLAT
}

function checkoutView() {
  if (cart.count === 0) {
    return `
      <div class="shell">
        <div class="order">
          <div class="order__check" style="background:var(--sun)">${icons.bag}</div>
          <h1>Your bag is empty</h1>
          <p>Nothing in here yet. Go and find something your pet will be unreasonable about.</p>
          <div class="order__actions">
            <a class="btn btn--lg" href="#/shop">Browse the shop ${arrowRight()}</a>
          </div>
        </div>
      </div>`
  }

  const shipping = shippingFor(cart.subtotal)
  const total = cart.subtotal + shipping

  return `
    <div class="shell">
      <div class="checkout">
        <div>
          <h1>Checkout</h1>
          <p class="checkout__sub">Almost there. Where are we sending the goodies?</p>

          <form id="checkoutForm" novalidate>
            <section class="form-block">
              <h2><span class="step">1</span> Contact</h2>
              <div class="field-grid">
                <label class="field field--wide">
                  <span class="label">Email address</span>
                  <input class="input" type="email" name="email" placeholder="you@example.com" autocomplete="email" required />
                </label>
              </div>
            </section>

            <section class="form-block">
              <h2><span class="step">2</span> Delivery</h2>
              <div class="field-grid">
                <label class="field">
                  <span class="label">First name</span>
                  <input class="input" type="text" name="firstName" autocomplete="given-name" required />
                </label>
                <label class="field">
                  <span class="label">Last name</span>
                  <input class="input" type="text" name="lastName" autocomplete="family-name" required />
                </label>
                <label class="field field--wide">
                  <span class="label">Street address</span>
                  <input class="input" type="text" name="address" autocomplete="street-address" required />
                </label>
                <label class="field">
                  <span class="label">City</span>
                  <input class="input" type="text" name="city" autocomplete="address-level2" required />
                </label>
                <label class="field">
                  <span class="label">Postcode</span>
                  <input class="input" type="text" name="postcode" autocomplete="postal-code" required />
                </label>
                <label class="field field--wide">
                  <span class="label">Country</span>
                  <div class="select-wrap">
                    <select class="select" name="country" style="width:100%" autocomplete="country-name">
                      ${countries.map((country) => `<option>${country}</option>`).join('')}
                    </select>
                  </div>
                </label>
              </div>
            </section>

            <section class="form-block">
              <h2><span class="step">3</span> Payment</h2>
              <div class="pay-note" id="payNote">
                ${icons.lock}
                <span>Checking how payment is set up…</span>
              </div>
              <fieldset class="pay-methods" id="payMethods" hidden>
                <legend class="label">How would you like to pay?</legend>
                <label class="pay-method">
                  <input type="radio" name="method" value="card" checked />
                  <span>
                    <b>Card, Apple Pay or Google Pay</b>
                    <small>Visa, Mastercard, Amex — entered on Stripe's secure page.</small>
                  </span>
                </label>
                <label class="pay-method">
                  <input type="radio" name="method" value="auto" />
                  <span>
                    <b>Bank or mobile banking</b>
                    <small>iDEAL, SEPA, ACH, MobilePay and similar, where Stripe supports your country. Card stays available on that page.</small>
                  </span>
                </label>
              </fieldset>
              <p class="summary__fine" style="margin-top:10px">Card details are entered on the secure payment page — Waggle never sees or stores them.</p>
            </section>

            <p id="checkoutError" role="alert" style="color:var(--pink);font-weight:800;margin-top:14px" hidden></p>
            <div style="margin-top:20px">
              <button class="btn btn--lg btn--full" type="submit" id="payBtn" data-total="${money(total)}" disabled>Checking payment…</button>
            </div>
          </form>
        </div>

        <aside class="summary">
          <h2>Your bag</h2>
          <div class="summary__lines">${summaryLinesMarkup()}</div>
          <div class="summary__rows">
            <div class="summary__row"><span>Subtotal</span><span>${money(cart.subtotal)}</span></div>
            <div class="summary__row"><span>Shipping</span><span>${shipping === 0 ? 'Free' : money(shipping)}</span></div>
            <div class="summary__row summary__row--total"><span>Total</span><span>${money(total)}</span></div>
          </div>
          <p class="summary__fine">${cart.count} ${cart.count === 1 ? 'item' : 'items'} · packed with recyclable everything</p>
          <a class="link-btn summary__fine" href="#/shop" style="display:block;margin-top:10px">Keep shopping</a>
        </aside>
      </div>
    </div>`
}

/* ------------------------------------------------------------
   Payments
   ------------------------------------------------------------ */

const payments = {
  enabled: null,
  async check() {
    if (payments.enabled !== null) return payments.enabled
    try {
      const response = await fetch('/api/status', { headers: { accept: 'application/json' } })
      const data = await response.json()
      payments.enabled = Boolean(data && data.payments)
    } catch {
      /* no server here (file:// or a plain static host): stay in demo mode */
      payments.enabled = false
    }
    return payments.enabled
  },
}

function wireCheckoutPayments() {
  const noteAtStart = $('#payNote')
  const buttonAtStart = $('#payBtn')
  if (!noteAtStart || !buttonAtStart) return
  const total = buttonAtStart.dataset.total || ''

  payments.check().then((enabled) => {
    const note = $('#payNote')
    const button = $('#payBtn')
    if (!note || !button) return

    if (enabled) {
      note.innerHTML = `${icons.lock}<span><b>Secure payment by Stripe.</b> You pick the method on Stripe's payment page, and your delivery details are confirmed there too.</span>`
      button.textContent = `Pay ${total} securely`
      const methods = $('#payMethods')
      if (methods) methods.hidden = false
    } else {
      note.innerHTML = `${icons.lock}<span><b>Demo checkout.</b> No card is charged and no order is sent anywhere. Add a Stripe key to take real payments — see the README.</span>`
      button.textContent = `Place demo order — ${total}`
    }
    button.disabled = false
  })
}

async function placeOrder(form) {
  const data = new FormData(form)
  const email = String(data.get('email') || '').trim()
  const error = $('#checkoutError')

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    error.textContent = 'That email address does not look right.'
    error.hidden = false
    return
  }
  for (const field of ['firstName', 'lastName', 'address', 'city', 'postcode']) {
    if (!String(data.get(field) || '').trim()) {
      error.textContent = 'Please fill in the delivery details.'
      error.hidden = false
      form.querySelector(`[name="${field}"]`).focus()
      return
    }
  }
  error.hidden = true

  const customer = {
    email,
    name: `${String(data.get('firstName')).trim()} ${String(data.get('lastName')).trim()}`,
    address: String(data.get('address')).trim(),
    city: String(data.get('city')).trim(),
    postcode: String(data.get('postcode')).trim(),
    country: String(data.get('country') || '').trim(),
  }

  const enabled = await payments.check()
  if (!enabled) {
    placeDemoOrder(customer)
    return
  }

  const button = $('#payBtn')
  const previousLabel = button ? button.textContent : ''
  if (button) {
    button.disabled = true
    button.textContent = 'Taking you to payment…'
  }

  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        customer,
        method: (form.querySelector('input[name="method"]:checked') || {}).value || 'auto',
        items: cart.lines.map((line) => ({ slug: line.slug, option: line.option || null, quantity: line.quantity })),
      }),
    })
    const result = await response.json().catch(() => ({}))
    if (!response.ok || !result.url) throw new Error(result.error || 'We could not start the payment. Please try again.')
    window.location.href = result.url
  } catch (err) {
    error.textContent = err.message
    error.hidden = false
    if (button) {
      button.disabled = false
      button.textContent = previousLabel
    }
  }
}

function placeDemoOrder(customer) {
  const reference = `WG-${Date.now().toString(36).slice(-5).toUpperCase()}`
  const order = {
    reference,
    email: customer.email,
    name: customer.name,
    city: customer.city,
    total: cart.subtotal + shippingFor(cart.subtotal),
    items: cart.items.map((item) => ({
      name: item.product.name,
      art: item.product.art,
      tint: item.product.tint,
      option: item.option,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
  }

  try {
    localStorage.setItem('waggle-order', JSON.stringify(order))
  } catch {
    /* ignore storage limits */
  }

  cart.clear()
  location.hash = `#/order/${reference}`
}

const paidOrders = new Map()
const loadingOrders = new Set()

async function loadPaidOrder(sessionId) {
  try {
    const response = await fetch(`/api/session?id=${encodeURIComponent(sessionId)}`, {
      headers: { accept: 'application/json' },
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok || !data.id) throw new Error(data.error || 'We could not find that payment.')
    paidOrders.set(sessionId, data)
    cart.clear()
  } catch (err) {
    paidOrders.set(sessionId, { error: err.message || 'We could not find that payment.' })
  }
  render()
}

function paidOrderView(sessionId) {
  const order = paidOrders.get(sessionId)

  if (!order) {
    if (!loadingOrders.has(sessionId)) {
      loadingOrders.add(sessionId)
      loadPaidOrder(sessionId)
    }
    return `
      <div class="shell">
        <div class="order">
          <div class="order__check" style="background:var(--sun)">${icons.lock}</div>
          <h1>Checking your payment…</h1>
          <p>One second while we confirm it with Stripe. Please do not close this tab.</p>
        </div>
      </div>`
  }

  if (order.error) {
    return `
      <div class="shell">
        <div class="order">
          <div class="order__check" style="background:var(--pink);color:#fff">${icons.bag}</div>
          <h1>We could not load that order</h1>
          <p>${esc(order.error)} If your card was charged, Stripe has emailed you a receipt and your order is with us.</p>
          <div class="order__actions">
            <a class="btn btn--lg" href="#/shop">Back to the shop ${arrowRight()}</a>
            <a class="btn btn--plain btn--lg" href="mailto:hello@waggle.pet">Email us</a>
          </div>
        </div>
      </div>`
  }

  const items = order.items || []
  const shipping = order.shipping > 0 ? money(order.shipping / 100) : 'Free'

  return `
    <div class="shell">
      <div class="order">
        <div class="order__check">${icons.check}</div>
        <h1>Payment received</h1>
        <div class="order__ref">${icons.bag} Order ${esc(order.reference)}</div>
        <p>Thanks ${esc((order.name || 'friend').split(' ')[0])} — Stripe has emailed your receipt to ${esc(order.email)}. We will pack it today and send tracking the moment it ships.</p>

        ${
          items.length
            ? `<div class="order__card">
                <h2 style="font-size:19px;margin-bottom:12px">What was in the bag</h2>
                <div class="summary__lines">${items
                  .map(
                    (item) => `
                  <div class="summary__line">
                    <span class="line__art" style="background:#D9F1E4">${icons.bag}</span>
                    <span>
                      <span class="summary__line-name">${esc(item.name)}</span>
                      <span class="summary__line-meta">× ${item.quantity}</span>
                    </span>
                    <span class="summary__line-price">${money(item.amount / 100)}</span>
                  </div>`,
                  )
                  .join('')}</div>
                <div class="summary__rows">
                  <div class="summary__row"><span>Shipping</span><span>${shipping}</span></div>
                  <div class="summary__row summary__row--total"><span>Total paid</span><span>${money(order.amountTotal / 100)}</span></div>
                </div>
              </div>`
            : ''
        }

        <div class="order__actions">
          <a class="btn btn--lg" href="#/shop">Keep shopping ${arrowRight()}</a>
          <a class="btn btn--plain btn--lg" href="#/about">Meet Waggle</a>
        </div>
      </div>
    </div>`
}

function orderView(params, reference) {
  const sessionId = params.get('paid')
  if (sessionId) return paidOrderView(sessionId)

  let order = null
  try {
    const raw = localStorage.getItem('waggle-order')
    if (raw) order = JSON.parse(raw)
  } catch {
    order = null
  }

  const isCurrent = order && order.reference === reference
  const items = isCurrent ? order.items : []

  return `
    <div class="shell">
      <div class="order">
        <div class="order__check">${icons.check}</div>
        <h1>You've got good taste</h1>
        <div class="order__ref">${icons.bag} Order ${esc(reference)}</div>
        <p>${isCurrent ? `Thanks ${esc(order.name.split(' ')[0])} — a confirmation is on its way to ${esc(order.email)}.` : 'This demo order is confirmed.'} Since this is a demo checkout, nothing was charged and nothing will ship.</p>

        ${
          items.length
            ? `<div class="order__card">
                <h2 style="font-size:19px;margin-bottom:12px">What was in the bag</h2>
                <div class="summary__lines">${items
                  .map(
                    (item) => `
                  <div class="summary__line">
                    <span class="line__art" style="background:${item.tint}">${productArt(item.art)}</span>
                    <span>
                      <span class="summary__line-name">${esc(item.name)}</span>
                      <span class="summary__line-meta">${item.option ? `${esc(item.option)} · ` : ''}× ${item.quantity}</span>
                    </span>
                    <span class="summary__line-price">${money(item.unitPrice * item.quantity)}</span>
                  </div>`,
                  )
                  .join('')}</div>
                <div class="summary__rows">
                  <div class="summary__row summary__row--total"><span>Total</span><span>${money(order.total)}</span></div>
                </div>
              </div>`
            : ''
        }

        <div class="order__actions">
          <a class="btn btn--lg" href="#/shop">Keep shopping ${arrowRight()}</a>
          <a class="btn btn--plain btn--lg" href="#/about">Meet Waggle</a>
        </div>
      </div>
    </div>`
}

/* ------------------------------------------------------------
   About
   ------------------------------------------------------------ */

function aboutView() {
  return `
    <div class="shell">
      <section class="about__hero">
        <div>
          <span class="pill pill--lilac">${pawMark()} Our story</span>
          <h1>A small shop for big personalities.</h1>
          <p class="lede">Waggle started in a kitchen in 2019, bagging treats for one very picky terrier. Now we stock the food, toys, medicine and daily bits we actually use on our own pets — and we read every label twice.</p>
          <div class="hero__cta" style="margin-top:22px">
            <a class="btn btn--lg" href="#/shop">Shop the range ${arrowRight()}</a>
            <a class="btn btn--plain btn--lg" href="mailto:hello@waggle.pet">Say hello</a>
          </div>
        </div>
        <div class="about__art">${dogFace()}</div>
      </section>

      <section class="about__body">
        <h2>Everything here has been sniffed, chewed and approved by a committee of very serious animals.</h2>
        <div class="about__copy">
          <p>We are a tiny team of six, plus four dogs and two cats who come into the shop and immediately sit on whatever we are trying to photograph. We test everything ourselves before it goes on the shelf, which is why the toy range is smaller than we would like and why the donut bed sells out every few weeks.</p>
          <p>For anything in the health range we work with two practising vets. If a supplement does not have evidence behind it, we do not sell it — and we will always tell you when the right answer is “ask your vet first” rather than “buy this”.</p>
          <p>Everything ships flat-packed in recycled cardboard, from a warehouse that runs on rooftop solar. Returns are 30 days, opened or not, because a bed your cat refuses to touch is no use to anyone.</p>
        </div>
      </section>

      <dl class="stats">
        <div class="stat"><dt>Pets served</dt><dd>24,000+</dd></div>
        <div class="stat"><dt>Products tested by us</dt><dd>100%</dd></div>
        <div class="stat"><dt>Plastic in our packaging</dt><dd>Zero</dd></div>
      </dl>

      <section class="section section--tight">
        <div class="newsletter">
          <div>
            <h2>Questions before you buy?</h2>
            <p>Email a real person. Usually a reply within a few hours, and a photo of the office dog.</p>
          </div>
          <div>
            <a class="btn btn--ink btn--lg" href="mailto:hello@waggle.pet">${icons.mail} hello@waggle.pet</a>
          </div>
        </div>
      </section>
    </div>`
}

/* ------------------------------------------------------------
   Router
   ------------------------------------------------------------ */

const titles = {
  '/': 'Waggle — good stuff for very good pets',
  '/shop': 'Shop all — Waggle',
  '/checkout': 'Checkout — Waggle',
  '/about': 'Our story — Waggle',
}

let lastPath = ''
let lastSearch = ''

function render() {
  const { path, params } = parseHash()
  state.q = path === '/shop' ? params.get('q') || '' : ''
  let html = null
  let title = titles[path]

  if (path === '/') html = homeView()
  else if (path === '/shop') html = shopView(params)
  else if (path.startsWith('/product/')) {
    const slug = path.slice('/product/'.length)
    html = productView(slug)
    if (html) title = `${bySlug(slug).name} — Waggle`
  } else if (path === '/checkout') html = checkoutView()
  else if (path === '/order' || path.startsWith('/order/')) {
    html = orderView(params, path.slice('/order/'.length))
    title = 'Order confirmed — Waggle'
  } else if (path === '/about') html = aboutView()

  if (html === null) {
    html = homeView()
    title = titles['/']
  }

  view.innerHTML = html
  document.title = title
  updateNav(path, params)

  if (path !== lastPath) window.scrollTo({ top: 0 })
  lastPath = path
  lastSearch = params.toString()

  if (path === '/shop') {
    const input = $('#shopSearch')
    if (input) {
      input.addEventListener('input', onSearchInput)
      input.addEventListener('search', onSearchInput)
    }
    const sort = $('#shopSort')
    if (sort) sort.addEventListener('change', () => setShopParam('sort', sort.value === 'featured' ? '' : sort.value))
  }

  if (path === '/checkout') {
    const form = $('#checkoutForm')
    if (form) {
      form.addEventListener('submit', (event) => {
        event.preventDefault()
        placeOrder(form)
      })
      wireCheckoutPayments()
    }
  }

  const newsletter = $('#newsletterForm')
  if (newsletter) {
    newsletter.addEventListener('submit', (event) => {
      event.preventDefault()
      const input = $('#newsletterEmail')
      if (!input.value || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value)) {
        $('#newsletterNote').textContent = 'That email does not look right — try again?'
        input.focus()
        return
      }
      $('#newsletterNote').textContent = 'You are in. 10% off is on its way to your inbox.'
      newsletter.reset()
    })
  }
}

function updateNav(path, params) {
  $$('.nav a, .mobile-nav a').forEach((link) => {
    const href = link.getAttribute('href') || ''
    link.classList.remove('is-active')
    if (href === '#/shop' && path === '/shop' && !params.get('category') && !params.get('pet')) link.classList.add('is-active')
    else if (href.startsWith('#/shop?category=') && path === '/shop' && href.endsWith(`category=${params.get('category')}`)) link.classList.add('is-active')
    else if (href === '#/about' && path === '/about') link.classList.add('is-active')
  })
}

let searchTimer = 0

function onSearchInput(event) {
  clearTimeout(searchTimer)
  const value = event.target.value
  searchTimer = setTimeout(() => {
    state.q = value
    const { params } = parseHash()
    const next = new URLSearchParams(params)
    if (value) next.set('q', value)
    else next.delete('q')
    history.replaceState(null, '', shopUrl(next))
    lastSearch = next.toString()
    renderShopResults(next)
  }, 130)
}

function setShopParam(key, value) {
  const { params, path } = parseHash()
  if (path !== '/shop') return
  const next = new URLSearchParams(params)
  if (value) next.set(key, value)
  else next.delete(key)
  location.hash = shopUrl(next)
}

/* ------------------------------------------------------------
   Bag drawer
   ------------------------------------------------------------ */

function renderDrawer() {
  const panel = $('#drawerPanel')
  if (!panel) return

  if (cart.count === 0) {
    panel.innerHTML = `
      <header class="drawer__head">
        <h2>Your bag <span>0 items</span></h2>
        <button type="button" class="icon-btn" data-close-bag aria-label="Close bag">${icons.close}</button>
      </header>
      <div class="drawer__body">
        <div class="drawer__empty">
          ${icons.bag}
          <h3>Nothing in here yet</h3>
          <p>Your pet is going to be so disappointed. Fix that.</p>
          <a class="btn" href="#/shop" data-close-bag>Start shopping</a>
        </div>
      </div>`
    return
  }

  const remaining = Math.max(0, FREE_SHIPPING_AT - cart.subtotal)
  const progress = Math.min(100, Math.round((cart.subtotal / FREE_SHIPPING_AT) * 100))
  const shipping = shippingFor(cart.subtotal)

  panel.innerHTML = `
    <header class="drawer__head">
      <h2>Your bag <span>${cart.count} ${cart.count === 1 ? 'item' : 'items'}</span></h2>
      <button type="button" class="icon-btn" data-close-bag aria-label="Close bag">${icons.close}</button>
    </header>
    <div class="drawer__body">
      <div class="ship-bar">
        <p>${remaining > 0 ? `You're ${money(remaining)} away from free shipping` : 'Free shipping unlocked. Nice.'}</p>
        <div class="ship-bar__track"><div class="ship-bar__fill" style="width:${progress}%"></div></div>
      </div>
      ${cart.items
        .map(
          (item, index) => `
        <div class="line">
          <a class="line__art" href="#/product/${item.product.slug}" data-close-bag style="background:${item.product.tint}" aria-hidden="true" tabindex="-1">${productArt(item.product.art)}</a>
          <div class="line__info">
            <a class="line__name" href="#/product/${item.product.slug}" data-close-bag>${esc(item.product.name)}</a>
            ${item.option ? `<p class="line__option">${esc(item.option)}</p>` : ''}
            <div class="line__row">
              <div class="qty">
                <button type="button" data-line-dec="${index}" aria-label="Decrease quantity of ${esc(item.product.name)}">−</button>
                <span>${item.quantity}</span>
                <button type="button" data-line-inc="${index}" aria-label="Increase quantity of ${esc(item.product.name)}">+</button>
              </div>
              <span class="line__price">${money(item.unitPrice * item.quantity)}</span>
            </div>
            <button type="button" class="link-btn" data-line-remove="${index}" style="align-self:flex-start;margin-top:4px">Remove</button>
          </div>
        </div>`,
        )
        .join('')}
    </div>
    <footer class="drawer__foot">
      <div class="summary__row"><span>Subtotal</span><span style="font-variant-numeric:tabular-nums">${money(cart.subtotal)}</span></div>
      <p class="drawer__note">${shipping === 0 ? 'Free shipping' : `Shipping ${money(shipping)}`} · taxes calculated at checkout</p>
      <a class="btn btn--lg btn--full" href="#/checkout" data-close-bag>Checkout ${arrowRight()}</a>
    </footer>`
}

function updateBagCount() {
  const count = $('#bagCount')
  const button = $('#bagBtn')
  if (!count) return
  count.textContent = cart.count
  count.hidden = cart.count === 0
  button.setAttribute('aria-label', `Open bag, ${cart.count} ${cart.count === 1 ? 'item' : 'items'}`)
}

function openBag() {
  renderDrawer()
  drawer.classList.add('is-open')
  drawer.setAttribute('aria-hidden', 'false')
  document.body.style.overflow = 'hidden'
  const close = $('#drawerPanel .drawer__head .icon-btn')
  if (close) close.focus()
}

function closeBag(restoreFocus = true) {
  if (!drawer.classList.contains('is-open')) return
  drawer.classList.remove('is-open')
  drawer.setAttribute('aria-hidden', 'true')
  document.body.style.overflow = ''
  if (restoreFocus) $('#bagBtn').focus()
}

document.addEventListener('cart:change', () => {
  updateBagCount()
  renderDrawer()
  if (lastPath === '/checkout') {
    // Keep whatever the shopper has typed when quantities change in the bag.
    const form = $('#checkoutForm')
    const draft = {}
    if (form) new FormData(form).forEach((value, key) => (draft[key] = value))
    render()
    const next = $('#checkoutForm')
    if (next) {
      Object.entries(draft).forEach(([key, value]) => {
        const field = next.querySelector(`[name="${key}"]`)
        if (field) field.value = value
      })
    }
  }
})

/* ------------------------------------------------------------
   Events
   ------------------------------------------------------------ */

function addToBag(slug, { optionIndex = 0, quantity = 1, open = false } = {}) {
  const product = bySlug(slug)
  if (!product) return
  const option = product.options ? product.options.values[optionIndex] || product.options.values[0] : undefined
  const unitPrice = product.price + (option && option.add ? option.add : 0)
  cart.add(product, option ? option.label : undefined, quantity, unitPrice)
  if (open) openBag()
  else toast(`${product.name} added to bag`)
}

document.addEventListener('click', (event) => {
  const add = event.target.closest('[data-add]')
  if (add) {
    addToBag(add.dataset.add)
    add.classList.add('is-added')
    add.innerHTML = icons.check
    setTimeout(() => {
      add.classList.remove('is-added')
      add.innerHTML = icons.plus
    }, 1200)
    return
  }

  const detailAdd = event.target.closest('[data-detail-add]')
  if (detailAdd) {
    addToBag(detailAdd.dataset.detailAdd, { optionIndex: state.optionIndex, quantity: state.quantity, open: true })
    return
  }

  const option = event.target.closest('[data-option]')
  if (option) {
    state.optionIndex = Number(option.dataset.option)
    render()
    const focus = $$('[data-option]')[state.optionIndex]
    if (focus) focus.focus()
    return
  }

  const qty = event.target.closest('[data-qty]')
  if (qty) {
    state.quantity = qty.dataset.qty === 'inc' ? Math.min(99, state.quantity + 1) : Math.max(1, state.quantity - 1)
    render()
    const again = $(`[data-qty="${qty.dataset.qty}"]`)
    if (again) again.focus()
    return
  }

  const facet = event.target.closest('[data-facet]')
  if (facet) {
    const { params } = parseHash()
    const key = facet.dataset.facet
    const value = facet.dataset.value
    setShopParam(key, params.get(key) === value ? '' : value)
    return
  }

  const clear = event.target.closest('[data-clear-filters]')
  if (clear) {
    state.q = ''
    location.hash = '#/shop'
    return
  }

  const dec = event.target.closest('[data-line-dec], [data-line-inc]')
  if (dec) {
    const index = Number(dec.dataset.lineDec ?? dec.dataset.lineInc)
    const line = cart.lines[index]
    if (!line) return
    const delta = dec.dataset.lineInc !== undefined ? 1 : -1
    if (line.quantity + delta <= 0) cart.remove(line.key)
    else cart.setQuantity(line.key, line.quantity + delta)
    return
  }

  const remove = event.target.closest('[data-line-remove]')
  if (remove) {
    const line = cart.lines[Number(remove.dataset.lineRemove)]
    if (line) cart.remove(line.key)
    return
  }

  if (event.target.closest('[data-open-bag]') || event.target.closest('#bagBtn')) {
    event.preventDefault()
    openBag()
    return
  }

  if (event.target.closest('[data-close-bag]')) {
    closeBag()
    return
  }

  if (event.target.closest('[data-close-nav]') || (event.target.closest('.mobile-nav a'))) {
    closeMobileNav()
    return
  }

  if (event.target.closest('#navToggle')) {
    toggleMobileNav()
  }
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeBag()
    closeMobileNav()
  }
})

function toggleMobileNav() {
  const nav = $('#mobileNav')
  const toggle = $('#navToggle')
  const open = nav.hidden
  nav.hidden = !open
  toggle.setAttribute('aria-expanded', String(open))
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
  toggle.innerHTML = open ? icons.close : icons.menu
}

function closeMobileNav() {
  const nav = $('#mobileNav')
  if (!nav || nav.hidden) return
  nav.hidden = true
  const toggle = $('#navToggle')
  toggle.setAttribute('aria-expanded', 'false')
  toggle.setAttribute('aria-label', 'Open menu')
  toggle.innerHTML = icons.menu
}

window.addEventListener('hashchange', () => {
  closeMobileNav()
  closeBag(false)
  render()
})

window.addEventListener('scroll', () => {
  const header = $('#hdr')
  if (header) header.classList.toggle('hdr--scrolled', window.scrollY > 6)
}, { passive: true })

/* ------------------------------------------------------------
   Boot
   ------------------------------------------------------------ */

updateBagCount()
renderDrawer()
render()
