/* ============================================================
   Waggle catalogue — edit this file to change products.
   Prices are whole dollars; `compareAt` shows a strikethrough.
   ============================================================ */

const categories = [
  { key: 'food', label: 'Food & treats', art: 'bag', tint: '#FFE3BF', blurb: 'Kibble, wet food and snacks worth begging for' },
  { key: 'toys', label: 'Toys & play', art: 'ball', tint: '#FFDCE6', blurb: 'Squeaky, bouncy and (mostly) indestructible' },
  { key: 'health', label: 'Health & care', art: 'pipette', tint: '#D9F1E4', blurb: 'Flea, joint and calm support for the wobbly days' },
  { key: 'accessories', label: 'Accessories', art: 'collar', tint: '#DCEBFF', blurb: 'Collars, beds, bowls and other daily heroes' },
  { key: 'grooming', label: 'Grooming', art: 'brush', tint: '#E8DEFF', blurb: 'Bathtime with a lot less drama' },
]

const products = [
  {
    slug: 'chicken-crunch-kibble',
    name: 'Chicken Crunch kibble',
    price: 34,
    compareAt: 42,
    category: 'food',
    pets: ['dog'],
    art: 'bag',
    tint: '#FFE3BF',
    badge: 'Bestseller',
    short: 'Air-dried chicken · 2 kg',
    description:
      'Small, crunchy, chicken-first kibble for dogs who inhale dinner and then look up as if they have never been fed. Made with real chicken and sweet potato, gently baked so nothing good gets cooked out.',
    bullets: ['Real chicken is the first ingredient', 'No artificial colours or flavours', 'Small kibble suits most breeds from 12 weeks'],
    spec: { label: 'Ingredients', body: 'Chicken 45%, sweet potato, oats, chicken fat, salmon oil, chicory root, vitamins and minerals. 31% protein, 14% fat.' },
    options: { name: 'Bag size', values: [{ label: '2 kg', add: 0 }, { label: '6 kg', add: 26 }] },
    featured: true,
  },
  {
    slug: 'salmon-pate',
    name: 'Salmon pâté, six pack',
    price: 19,
    category: 'food',
    pets: ['cat'],
    art: 'can',
    tint: '#FFDCE0',
    badge: 'New',
    short: 'Grain-free wet food · 6 × 85 g',
    description:
      'Silky pâté made from salmon and pumpkin, with a texture cats actually lick clean. A splash of water in the bowl makes it a sauce, which is how the fussy ones like it.',
    bullets: ['Grain-free and complete', 'Six 85 g tins', 'Gently steamed in the tin'],
    spec: { label: 'Ingredients', body: 'Salmon 60%, pumpkin, chicken liver, salmon broth, sunflower oil, taurine, vitamins. 10% protein, 6% fat.' },
    isNew: true,
  },
  {
    slug: 'peanut-butter-biscuits',
    name: 'Peanut butter biscuits',
    price: 12,
    category: 'food',
    pets: ['dog'],
    art: 'cookie',
    tint: '#FFECC9',
    short: 'Crunchy oat cookies · 250 g',
    description:
      'Oat and peanut butter biscuits with a snap loud enough to summon a dog from three rooms away. Break one in half for small friends and training wins.',
    bullets: ['Baked in small batches', 'Xylitol-free peanut butter', 'About 24 biscuits per bag'],
    spec: { label: 'Ingredients', body: 'Oats, wholemeal flour, peanut butter 12%, egg, honey, coconut oil. No xylitol, no salt.' },
    options: { name: 'Bag', values: [{ label: '250 g', add: 0 }, { label: '500 g', add: 9 }] },
  },
  {
    slug: 'freeze-dried-fish-bites',
    name: 'Freeze-dried fish bites',
    price: 14,
    category: 'food',
    pets: ['cat'],
    art: 'fish',
    tint: '#D9F0FF',
    badge: 'New',
    short: 'One ingredient · 40 g',
    description:
      'Whole white fish, freeze-dried and snapped into training-size pieces. Pure fish, nothing else, which makes them the closest thing to cat currency.',
    bullets: ['Single ingredient', 'High protein, low smell', 'Roughly 120 tiny bites'],
    spec: { label: 'Ingredients', body: '100% freeze-dried white fish. That is the whole list. 78% protein.' },
    isNew: true,
  },
  {
    slug: 'dental-chew-sticks',
    name: 'Dental chew sticks',
    price: 16,
    category: 'food',
    pets: ['dog'],
    art: 'stick',
    tint: '#DFF3D6',
    short: 'Daily dental chews · 14 pack',
    description:
      'A soft, ridged stick that scrapes as it is chewed, plus mint and chlorophyll for the breath. One a day keeps the vet happy and the sofa kissable.',
    bullets: ['14 sticks, one a day', 'Ridged texture cleans as they chew', 'Suitable for dogs over 4 months'],
    spec: { label: 'Ingredients', body: 'Rice flour, potato starch, glycerine, mint, chlorophyll, sodium hexametaphosphate, brewers yeast.' },
  },

  {
    slug: 'bouncy-ball-trio',
    name: 'Bouncy ball trio',
    price: 9,
    category: 'toys',
    pets: ['dog', 'cat'],
    art: 'ball',
    tint: '#FFDCE6',
    badge: 'Bestseller',
    short: 'Three sizes · natural rubber',
    description:
      'Three natural-rubber balls in a pink that never gets lost under the sofa (it does). Bouncy enough for a proper chase, soft enough for the teeth that do the catching.',
    bullets: ['3 balls: 5 cm, 6.5 cm and 8 cm', 'Natural, non-toxic rubber', 'Floats in water'],
    spec: { label: 'Materials', body: 'Natural rubber with a food-grade colourant. Rinse clean, air dry.' },
  },
  {
    slug: 'rope-tug-toy',
    name: 'Rope tug toy',
    price: 14,
    category: 'toys',
    pets: ['dog'],
    art: 'rope',
    tint: '#FFE9C2',
    short: 'Cotton rope · 34 cm',
    description:
      'Chunky cotton rope with a knotted ball at each end, built for the standoff at the end of the garden. Flossing for teeth, arm workout for you.',
    bullets: ['Sturdy triple-knot ends', 'Machine washable', '34 cm long'],
    spec: { label: 'Materials', body: '100% cotton rope and a natural rubber ball. Not for heavy power chewers.' },
  },
  {
    slug: 'feather-wand',
    name: 'Feather wand',
    price: 11,
    category: 'toys',
    pets: ['cat'],
    art: 'wand',
    tint: '#E6DBFF',
    badge: 'Bestseller',
    short: 'Beech handle · 60 cm',
    description:
      'A light beech wand with three fluttering feathers on a swivel clip. The clip means you can swap the feathers when your cat has loved them into oblivion.',
    bullets: ['Swivel clip for swapping lures', 'Two spare feathers included', 'Wand unscrews to store flat'],
    spec: { label: 'Materials', body: 'Beech handle, cotton cord, natural feathers. Play supervised and put it away after.' },
  },
  {
    slug: 'squeaky-duck',
    name: 'Squeaky duck',
    price: 13,
    category: 'toys',
    pets: ['dog'],
    art: 'duck',
    tint: '#FFF3C2',
    short: 'Plush · 24 cm',
    description:
      'A ridiculous yellow duck with a squeaker in the belly and no dignity whatsoever. Reinforced seams so the fun lasts longer than four minutes.',
    bullets: ['Double-stitched seams', 'Two squeakers', 'Machine washable on cold'],
    spec: { label: 'Materials', body: 'Recycled polyester plush with a recycled PET fill. No plastic beans.' },
  },
  {
    slug: 'cuddly-bear-plush',
    name: 'Cuddly bear plush',
    price: 18,
    category: 'toys',
    pets: ['dog', 'cat'],
    art: 'bear',
    tint: '#FFE0CC',
    badge: 'Low stock',
    short: 'Sleep buddy · 30 cm',
    description:
      'Not a chew toy, a friend. A soft, floppy bear with no squeaker and no rattles, for the pets who like something to lean on at bedtime.',
    bullets: ['No squeaker, no crinkle', 'Very soft, very floppy', 'Machine washable at 30°'],
    spec: { label: 'Materials', body: 'Recycled plush and recycled fibre fill. Best for gentle cuddlers.' },
    isNew: true,
  },

  {
    slug: 'flea-tick-drops',
    name: 'Flea & tick drops',
    price: 24,
    category: 'health',
    pets: ['dog', 'cat'],
    art: 'pipette',
    tint: '#D9F1E4',
    badge: 'Bestseller',
    short: '3 month supply · spot on',
    description:
      'Monthly spot-on drops that break the flea life cycle and keep ticks from hitching a ride home from the park. Three pipettes, one per month.',
    bullets: ['Three monthly doses', 'Waterproof after 24 hours', 'For pets over 2 kg and 8 weeks'],
    spec: { label: 'Good to know', body: 'Contains fipronil and (S)-methoprene. Always check the dose with your vet, especially for pregnant, nursing or unwell pets.' },
    options: { name: 'Size', values: [{ label: 'Under 10 kg', add: 0 }, { label: '10–25 kg', add: 6 }] },
    featured: true,
  },
  {
    slug: 'joint-support-chews',
    name: 'Joint support chews',
    price: 28,
    category: 'health',
    pets: ['dog'],
    art: 'jar',
    tint: '#DCEBFF',
    short: 'Glucosamine · 60 chews',
    description:
      'Soft chicken chews with glucosamine, green-lipped mussel and turmeric, for the dogs who take the stairs one at a time now. Two months of support in a jar.',
    bullets: ['60 soft chews', 'Glucosamine, chondroitin and turmeric', 'Vet-formulated recipe'],
    spec: { label: 'Good to know', body: 'A supplement, not a medicine. If your dog is limping or suddenly stiff, see your vet first.' },
  },
  {
    slug: 'calming-tablets',
    name: 'Calming tablets',
    price: 19,
    category: 'health',
    pets: ['dog', 'cat'],
    art: 'blister',
    tint: '#E8DEFF',
    short: 'L-theanine · 30 tablets',
    description:
      'For fireworks, car trips and the bin lorry that is clearly a monster. L-theanine and chamomile in a tablet that hides well in a spoon of pâté.',
    bullets: ['30 tablets', 'Give 1 hour before the scary thing', 'No drowsiness'],
    spec: { label: 'Good to know', body: 'Contains L-theanine, chamomile and vitamin B3. Ask your vet before combining with prescribed medication.' },
  },
  {
    slug: 'skin-coat-oil',
    name: 'Skin & coat oil',
    price: 22,
    category: 'health',
    pets: ['dog', 'cat'],
    art: 'dropper',
    tint: '#FFF0D6',
    short: 'Salmon oil · 250 ml',
    description:
      'Cold-pressed salmon oil with omega 3 and 6, pumped over dinner to make coats glossy and skin less itchy. Most pets think it is a treat, which is the point.',
    bullets: ['250 ml, about 50 servings', 'Pump bottle, no drips', 'Keep in the fridge once open'],
    spec: { label: 'Ingredients', body: '100% cold-pressed salmon oil. 1 pump per 5 kg of body weight, daily.' },
  },

  {
    slug: 'soft-wash-collar',
    name: 'Soft-wash collar',
    price: 22,
    category: 'accessories',
    pets: ['dog', 'cat'],
    art: 'collar',
    tint: '#FFDCE0',
    short: 'Washed cotton · quick release',
    description:
      'A soft cotton collar that gets softer with every muddy adventure, with a quick-release buckle and a brass ring for the tag that jingles at 3 a.m.',
    bullets: ['Quick-release buckle', 'Adjustable 28–42 cm', 'Machine washable'],
    spec: { label: 'Materials', body: 'Washed cotton webbing, acetal buckle, solid brass D-ring.' },
    options: { name: 'Colour', values: [{ label: 'Sunset', add: 0 }, { label: 'Ocean', add: 0 }, { label: 'Meadow', add: 0 }] },
  },
  {
    slug: 'reflective-leash',
    name: 'Reflective leash',
    price: 26,
    category: 'accessories',
    pets: ['dog'],
    art: 'leash',
    tint: '#DCEBFF',
    short: 'Padded handle · 1.5 m',
    description:
      'A light leash with a stitched reflective stripe, so evening walks show up in headlights. The padded handle is kind to hands when a squirrel appears.',
    bullets: ['Reflective stripe both sides', 'Padded neoprene handle', 'Swivel trigger clip'],
    spec: { label: 'Materials', body: 'Recycled polyester webbing, neoprene padding, zinc alloy clip. Hand wash.' },
    options: { name: 'Length', values: [{ label: '1.5 m', add: 0 }, { label: '3 m', add: 6 }] },
  },
  {
    slug: 'donut-bed',
    name: 'Donut bed',
    price: 68,
    category: 'accessories',
    pets: ['dog', 'cat'],
    art: 'bed',
    tint: '#FFE6CE',
    badge: 'Bestseller',
    short: 'Faux fur · machine washable',
    description:
      'A deep, fluffy donut with a raised rim to rest a chin on, because apparently that is essential. The base is water resistant and the whole cover zips off for the wash.',
    bullets: ['Raised rim for chin support', 'Removable, washable cover', 'Non-slip base'],
    spec: { label: 'Materials', body: 'Recycled faux fur cover, recycled fibre fill, water-resistant base. Cover washes at 30°.' },
    options: { name: 'Size', values: [{ label: 'Small · 50 cm', add: 0 }, { label: 'Medium · 65 cm', add: 18 }, { label: 'Large · 80 cm', add: 34 }] },
    featured: true,
  },
  {
    slug: 'paw-print-bowl',
    name: 'Paw print bowl',
    price: 18,
    category: 'accessories',
    pets: ['dog', 'cat'],
    art: 'bowl',
    tint: '#DDF3F1',
    short: 'Stoneware · 500 ml',
    description:
      'A heavy stoneware bowl with a paw pressed into the side, so dinner does not slide across the kitchen floor. Wide and shallow, which is easier on whiskers.',
    bullets: ['Holds 500 ml', 'Dishwasher safe', 'Non-slip silicone base'],
    spec: { label: 'Materials', body: 'Glazed stoneware with a food-safe finish and silicone foot.' },
  },

  {
    slug: 'oatmeal-shampoo',
    name: 'Oatmeal shampoo',
    price: 16,
    category: 'grooming',
    pets: ['dog', 'cat'],
    art: 'shampoo',
    tint: '#FFF3C2',
    short: 'Soothing wash · 300 ml',
    description:
      'A gentle oatmeal and aloe wash for itchy, sensitive skin, with a lather that rinses out before your pet decides the bath is a betrayal.',
    bullets: ['300 ml, about 8 washes', 'pH balanced for pets', 'Soap-free, tear-free'],
    spec: { label: 'Ingredients', body: 'Colloidal oatmeal, aloe vera, glycerine, mild coconut-derived cleansers. Free from parabens and dyes.' },
  },
  {
    slug: 'deshedding-brush',
    name: 'De-shedding brush',
    price: 21,
    category: 'grooming',
    pets: ['dog', 'cat'],
    art: 'brush',
    tint: '#E8DEFF',
    badge: 'New',
    short: 'Fine steel pins · self-cleaning',
    description:
      'Fine steel pins that lift the undercoat before it becomes a second dog on your rug. One click retracts the pins so the fur comes off in a neat little pad.',
    bullets: ['One-click fur release', 'Rounded pins, no scratches', 'Non-slip handle'],
    spec: { label: 'Materials', body: 'Stainless steel pins, recycled ABS handle, rubber grip. Wipe clean.' },
    isNew: true,
  },
]

const bySlug = (slug) => products.find((p) => p.slug === slug)
const categoryByKey = (key) => categories.find((c) => c.key === key)
const newArrivals = products.filter((p) => p.isNew)
const featured = products.filter((p) => p.featured)

const FREE_SHIPPING_AT = 49
const SHIPPING_FLAT = 6

const petFilters = [
  { key: 'dog', label: 'Dogs' },
  { key: 'cat', label: 'Cats' },
]

const money = (value) => {
  const rounded = Math.round(value * 100) / 100
  return `$${Number.isInteger(rounded) ? rounded : rounded.toFixed(2)}`
}
