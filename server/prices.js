/* ============================================================
   The prices the checkout API actually charges, in cents.

   This mirrors js/data.js. The browser's numbers are never
   trusted — the cart is repriced here — so if you change a price
   in js/data.js, change it here too or checkout will refuse the
   order with "we no longer sell that" / wrong totals.
   ============================================================ */

export const CURRENCY = 'usd'
export const FREE_SHIPPING_AT = 4900 // $49
export const SHIPPING_FLAT = 600 // $6

/** slug -> { name, price (cents), options: { label: extra cents } } */
export const CATALOGUE = {
  'chicken-crunch-kibble': { name: 'Chicken Crunch kibble', price: 3400, options: { '2 kg': 0, '6 kg': 2600 } },
  'salmon-pate': { name: 'Salmon pâté, six pack', price: 1900 },
  'peanut-butter-biscuits': { name: 'Peanut butter biscuits', price: 1200, options: { '250 g': 0, '500 g': 900 } },
  'freeze-dried-fish-bites': { name: 'Freeze-dried fish bites', price: 1400 },
  'dental-chew-sticks': { name: 'Dental chew sticks', price: 1600 },
  'bouncy-ball-trio': { name: 'Bouncy ball trio', price: 900 },
  'rope-tug-toy': { name: 'Rope tug toy', price: 1400 },
  'feather-wand': { name: 'Feather wand', price: 1100 },
  'squeaky-duck': { name: 'Squeaky duck', price: 1300 },
  'cuddly-bear-plush': { name: 'Cuddly bear plush', price: 1800 },
  'flea-tick-drops': { name: 'Flea & tick drops', price: 2400, options: { 'Under 10 kg': 0, '10–25 kg': 600 } },
  'joint-support-chews': { name: 'Joint support chews', price: 2800 },
  'calming-tablets': { name: 'Calming tablets', price: 1900 },
  'skin-coat-oil': { name: 'Skin & coat oil', price: 2200 },
  'soft-wash-collar': { name: 'Soft-wash collar', price: 2200, options: { Sunset: 0, Ocean: 0, Meadow: 0 } },
  'reflective-leash': { name: 'Reflective leash', price: 2600, options: { '1.5 m': 0, '3 m': 600 } },
  'donut-bed': {
    name: 'Donut bed',
    price: 6800,
    options: { 'Small · 50 cm': 0, 'Medium · 65 cm': 1800, 'Large · 80 cm': 3400 },
  },
  'paw-print-bowl': { name: 'Paw print bowl', price: 1800 },
  'oatmeal-shampoo': { name: 'Oatmeal shampoo', price: 1600 },
  'deshedding-brush': { name: 'De-shedding brush', price: 2100 },
}
