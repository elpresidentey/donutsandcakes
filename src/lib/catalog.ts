import type { Img } from "./images";
import { IMAGES } from "./images";

export type Category = "cakes" | "donuts" | "smoothies" | "juices";

export interface SizeOption {
  label: string;
  delta: number;
}

export interface Product {
  id: string;
  category: Category;
  name: string;
  tagline: string;
  description: string;
  ingredients: string[];
  price: number;
  compareAt?: number;
  image: Img;
  badge?: string;
  serves?: string;
  sizes: SizeOption[];
}

const cakeSizes = (): SizeOption[] => [
  { label: '6" · Serves 8–10', delta: -4500 },
  { label: '8" · Serves 12–16', delta: 0 },
  { label: '10" · Serves 20–25', delta: 9500 },
  { label: '12" · Serves 30–40', delta: 19000 },
];

const cupSizes = (): SizeOption[] => [
  { label: "Box of 4", delta: 0 },
  { label: "Box of 6", delta: 4200 },
  { label: "Box of 12", delta: 13500 },
];

const singleDonutSizes = (): SizeOption[] => [
  { label: "Single", delta: 0 },
  { label: "Box of 4", delta: 5200 },
  { label: "Box of 6", delta: 8000 },
];

const boxDonutSizes = (base: number): SizeOption[] =>
  base >= 12
    ? [
        { label: `Box of ${base}`, delta: 0 },
        { label: `Party double (${base * 2})`, delta: 13600 },
      ]
    : [
        { label: `Box of ${base}`, delta: 0 },
        { label: "Box of 12", delta: 6800 },
      ];

const drinkSizes = (): SizeOption[] => [
  { label: "Regular · 350ml", delta: 0 },
  { label: "Large · 500ml", delta: 1500 },
];

export const PRODUCTS: Product[] = [
  // ------------------------------- CAKES -------------------------------
  {
    id: "midnight-choco-fudge",
    category: "cakes",
    name: "Midnight Choco Fudge",
    tagline: "Dark, moist & unapologetically chocolatey",
    description:
      "Three layers of dark cocoa sponge, silky fudge frosting and a glossy ganache drip. Our most re-ordered celebration cake.",
    ingredients: ["Dark cocoa sponge", "Fudge frosting", "Chocolate ganache", "Cocoa nibs", "Free-range eggs"],
    price: 32500,
    image: IMAGES.chocoFudge,
    badge: "Bestseller",
    serves: "Serves 12–16",
    sizes: cakeSizes(),
  },
  {
    id: "vanilla-bean-party",
    category: "cakes",
    name: "Vanilla Bean Party Cake",
    tagline: "Classic vanilla, dressed for candles",
    description:
      "Fluffy vanilla-bean sponge with clouds of vanilla buttercream. Made for birthdays, graduations and every excuse to celebrate.",
    ingredients: ["Vanilla-bean sponge", "Vanilla buttercream", "Madagascar vanilla", "Free-range eggs"],
    price: 28000,
    image: IMAGES.vanillaParty,
    serves: "Serves 12–16",
    sizes: cakeSizes(),
  },
  {
    id: "choco-berry-truffle",
    category: "cakes",
    name: "Choco-Berry Truffle",
    tagline: "Chocolate layers, berry-kissed frosting",
    description:
      "Rich chocolate sponge stacked with whipped berry frosting and finished with fresh berries. Decadent but never heavy.",
    ingredients: ["Chocolate sponge", "Whipped berry frosting", "Fresh strawberries", "Dark chocolate shavings"],
    price: 35000,
    image: IMAGES.chocoTruffle,
    serves: "Serves 12–16",
    sizes: cakeSizes(),
  },
  {
    id: "rustic-bloom",
    category: "cakes",
    name: "Rustic Bloom Cake",
    tagline: "Naked frosting, fresh flowers",
    description:
      "Our signature rustic finish with barely-there frosting, crowned with fresh seasonal flowers. A showpiece for weddings and showers.",
    ingredients: ["Vanilla sponge", "Lightly whipped cream", "Berry compote", "Fresh seasonal flowers"],
    price: 42000,
    compareAt: 48000,
    image: IMAGES.flowerCake,
    badge: "Celebration pick",
    serves: "Serves 12–16",
    sizes: cakeSizes(),
  },
  {
    id: "red-velvet-cups",
    category: "cakes",
    name: "Red Velvet Cupcakes",
    tagline: "Box of 4 · cream-cheese swirl",
    description:
      "Velvety cocoa-red sponge with tangy cream-cheese frosting. Baked fresh every morning, boxed to share (or not).",
    ingredients: ["Cocoa-red sponge", "Cream-cheese frosting", "Buttermilk", "Vanilla"],
    price: 9800,
    image: IMAGES.redVelvetCups,
    sizes: cupSizes(),
  },
  {
    id: "pink-party-cups",
    category: "cakes",
    name: "Pink Party Cupcakes",
    tagline: "Box of 4 · strawberry-pink frosting",
    description:
      "Chocolate cupcakes under swirls of pink frosting with heart sprinkles. Party-ready straight out of the box.",
    ingredients: ["Chocolate sponge", "Strawberry frosting", "Heart sprinkles", "Butter"],
    price: 9200,
    image: IMAGES.pinkPartyCups,
    sizes: cupSizes(),
  },
  {
    id: "strawberry-cloud-cups",
    category: "cakes",
    name: "Strawberry Cloud Cupcakes",
    tagline: "Box of 4 · fresh strawberry tops",
    description:
      "Light vanilla sponge, whipped strawberry frosting and a fresh strawberry on every cup. Tastes like a Lagos weekend.",
    ingredients: ["Vanilla sponge", "Strawberry whipped cream", "Fresh strawberries"],
    price: 9800,
    image: IMAGES.strawberryCups,
    badge: "New",
    sizes: cupSizes(),
  },
  {
    id: "choco-swirl-cup",
    category: "cakes",
    name: "Choco Swirl Cupcake",
    tagline: "Single · extra frosting",
    description:
      "One very generous chocolate cupcake with a tall swirl of frosting. For when a whole cake is a commitment.",
    ingredients: ["Chocolate sponge", "Chocolate frosting", "Cocoa dust"],
    price: 2800,
    image: IMAGES.chocoSwirlCup,
    sizes: singleDonutSizes(),
  },
  {
    id: "birthday-cupcakes",
    category: "cakes",
    name: "Birthday Cupcakes",
    tagline: "Box of 4 · toppers included",
    description:
      "Chocolate cupcakes under a tall swirl of frosting, each with a candle-ready topper. The easiest way to make someone's day at the office or at home.",
    ingredients: ["Chocolate sponge", "Vanilla buttercream", "Sprinkles", "Free-range eggs"],
    price: 9800,
    image: IMAGES.birthdayCup,
    sizes: cupSizes(),
  },
  {
    id: "blue-velvet-cups",
    category: "cakes",
    name: "Blue Velvet Cupcakes",
    tagline: "Box of 4 · blue-mist frosting",
    description:
      "Vanilla-bean cupcakes under a cool blue frosting swirl. A calm, photographic alternative to the usual pink — great for baby showers and birthdays.",
    ingredients: ["Vanilla-bean sponge", "Blue buttercream", "Vanilla", "Butter"],
    price: 9800,
    image: IMAGES.blueCup,
    sizes: cupSizes(),
  },
  {
    id: "assorted-cupcake-box",
    category: "cakes",
    name: "Assorted Cupcake Box",
    tagline: "12 cupcakes · mixed flavours",
    description:
      "A dozen frosted cupcakes in mixed flavours, boxed to share. When one flavour is never going to be enough for the whole room.",
    ingredients: ["Vanilla & chocolate sponges", "Assorted buttercream", "Sprinkles", "Free-range eggs"],
    price: 26500,
    compareAt: 29400,
    image: IMAGES.assortedCups,
    badge: "Sharing",
    sizes: cupSizes(),
  },
  {
    id: "carrot-cream-cheese",
    category: "cakes",
    name: "Carrot Cream Cheese Cake",
    tagline: "Spiced carrot, tangy cream cheese",
    description:
      "Moist spiced carrot sponge with toasted walnuts under a thick layer of tangy cream-cheese frosting. Comforting, never too sweet.",
    ingredients: ["Spiced carrot sponge", "Cream-cheese frosting", "Walnuts", "Cinnamon", "Free-range eggs"],
    price: 30000,
    image: IMAGES.carrotCake,
    serves: "Serves 12–16",
    sizes: cakeSizes(),
  },
  {
    id: "black-forest",
    category: "cakes",
    name: "Black Forest Cake",
    tagline: "Chocolate, cherry & whipped cream",
    description:
      "Layers of dark chocolate sponge, cherry compote and pillowy whipped cream, finished with chocolate shavings and a cherry on top. A classic done properly.",
    ingredients: ["Chocolate sponge", "Cherry compote", "Whipped cream", "Dark chocolate shavings"],
    price: 33000,
    image: IMAGES.blackForest,
    badge: "Classic",
    serves: "Serves 12–16",
    sizes: cakeSizes(),
  },
  {
    id: "chocolate-cheesecake",
    category: "cakes",
    name: "Chocolate Cheesecake",
    tagline: "Dense, dark & deeply creamy",
    description:
      "A baked chocolate cheesecake on a cocoa biscuit base — dense, glossy and rich. Slices beautifully, disappears quickly.",
    ingredients: ["Cream cheese", "Dark chocolate", "Cocoa biscuit base", "Free-range eggs", "Cream"],
    price: 34000,
    image: IMAGES.chocoCheesecake,
    serves: "Serves 10–12",
    sizes: cakeSizes(),
  },

  // ------------------------------- DONUTS ------------------------------
  {
    id: "strawberry-sprinkle",
    category: "donuts",
    name: "Strawberry Sprinkle Donut",
    tagline: "The icon. Pink glaze, rainbow crunch",
    description:
      "Fluffy raised donut dipped in strawberry glaze and rolled in rainbow sprinkles. Impossible to eat just one — you've been warned.",
    ingredients: ["Raised yeast dough", "Strawberry glaze", "Rainbow sprinkles"],
    price: 1800,
    image: IMAGES.sprinkleSingle,
    badge: "Iconic",
    sizes: singleDonutSizes(),
  },
  {
    id: "honey-glaze",
    category: "donuts",
    name: "Honey Glaze Donut",
    tagline: "Simple, glossy, perfect",
    description:
      "Our classic raised donut with a crackly honey glaze. Best eaten within ten minutes of the box opening. It won't survive longer.",
    ingredients: ["Raised yeast dough", "Honey glaze", "Vanilla"],
    price: 1600,
    image: IMAGES.honeyGlaze,
    sizes: singleDonutSizes(),
  },
  {
    id: "glazed-dozen",
    category: "donuts",
    name: "Glazed Dozen Box",
    tagline: "12 honey-glazed rings",
    description:
      "A full dozen of glossy honey-glazed donuts in our signature pink box. Built for offices, parties and serious cravings.",
    ingredients: ["Raised yeast dough", "Honey glaze", "Vanilla"],
    price: 16500,
    compareAt: 19200,
    image: IMAGES.glazedBox,
    badge: "Sharing",
    sizes: boxDonutSizes(12),
  },
  {
    id: "party-mix-6",
    category: "donuts",
    name: "Party Mix Box",
    tagline: "6 assorted glazed & chocolate",
    description:
      "Can't decide? Don't. Six of our most-loved glazed and chocolate donuts in one box, ready to disappear.",
    ingredients: ["Raised yeast dough", "Honey glaze", "Chocolate dip", "Assorted toppings"],
    price: 9800,
    image: IMAGES.partyMixBox,
    sizes: boxDonutSizes(6),
  },
  {
    id: "pink-parade-6",
    category: "donuts",
    name: "Pink Parade Box",
    tagline: "6 pink-iced show-offs",
    description:
      "Six strawberry-iced donuts with sprinkles, on our most photogenic pink. Order one for the taste, post one for the likes.",
    ingredients: ["Raised yeast dough", "Strawberry icing", "Rainbow sprinkles"],
    price: 10500,
    image: IMAGES.pinkParade,
    badge: "Most gifted",
    sizes: boxDonutSizes(6),
  },
  {
    id: "choco-vanilla-mix-9",
    category: "donuts",
    name: "Choco-Vanilla Mix Box",
    tagline: "9 frosted favourites",
    description:
      "Nine frosted donuts alternating chocolate and vanilla with crunchy toppings. The crowd-pleaser box.",
    ingredients: ["Raised yeast dough", "Chocolate frosting", "Vanilla frosting", "Crunchy toppings"],
    price: 14200,
    image: IMAGES.chocoVanillaMix,
    sizes: boxDonutSizes(9),
  },
  {
    id: "chocolate-glazed",
    category: "donuts",
    name: "Chocolate Glazed Donut",
    tagline: "Single · dark glaze, white drizzle",
    description:
      "Our fluffy raised donut under a deep chocolate glaze with a white chocolate drizzle. The grown-up cousin of the sprinkle icon.",
    ingredients: ["Raised yeast dough", "Dark chocolate glaze", "White chocolate drizzle"],
    price: 1900,
    image: IMAGES.chocoGlazed,
    sizes: singleDonutSizes(),
  },
  {
    id: "choco-sprinkle-box",
    category: "donuts",
    name: "Choco Sprinkle Box",
    tagline: "6 chocolate donuts, full rainbow",
    description:
      "Six chocolate-glazed donuts rolled in rainbow sprinkles. Maximum chocolate, maximum colour, zero restraint.",
    ingredients: ["Raised yeast dough", "Chocolate glaze", "Rainbow sprinkles"],
    price: 10800,
    image: IMAGES.chocoSprinkleBox,
    badge: "Kids' favourite",
    sizes: boxDonutSizes(6),
  },
  {
    id: "cinnamon-minis",
    category: "donuts",
    name: "Cinnamon Mini Donuts",
    tagline: "Box of 12 · warm cinnamon sugar",
    description:
      "Bite-size donuts tumbled in cinnamon sugar while still warm. Twelve little bites that go dangerously fast with coffee.",
    ingredients: ["Mini yeast dough", "Cinnamon sugar", "Vanilla", "Butter"],
    price: 12500,
    image: IMAGES.cinnamonMinis,
    sizes: boxDonutSizes(12),
  },
  {
    id: "donut-holes",
    category: "donuts",
    name: "Powdered Donut Holes",
    tagline: "Box of 12 · light & snowy",
    description:
      "Pillowy donut holes dusted in powdered sugar, bagged to share. The low-commitment way to satisfy a craving.",
    ingredients: ["Yeast dough", "Powdered sugar", "Vanilla"],
    price: 8500,
    image: IMAGES.donutHoles,
    badge: "New",
    sizes: boxDonutSizes(12),
  },
  {
    id: "choco-lovers-box",
    category: "donuts",
    name: "Choco Lovers Box",
    tagline: "9 all-chocolate donuts",
    description:
      "Nine donuts for people who already know the answer is chocolate. Glazed, dipped and drizzled, all cocoa, all the way down.",
    ingredients: ["Raised yeast dough", "Chocolate glaze", "Chocolate dip", "Cocoa drizzle"],
    price: 14800,
    image: IMAGES.chocoTray,
    sizes: boxDonutSizes(9),
  },

  // ----------------------------- SMOOTHIES -----------------------------
  {
    id: "strawberry-bliss",
    category: "smoothies",
    name: "Strawberry Bliss",
    tagline: "Strawberry · banana · yoghurt",
    description:
      "Thick-blended strawberries, banana and creamy yoghurt. Our bestseller since day one — basically dessert you can justify.",
    ingredients: ["Strawberries", "Banana", "Creamy yoghurt", "Honey"],
    price: 5200,
    image: IMAGES.strawberryBliss,
    badge: "Bestseller",
    sizes: drinkSizes(),
  },
  {
    id: "berry-medley",
    category: "smoothies",
    name: "Berry Medley",
    tagline: "Mixed berries · honey · milk",
    description:
      "A triple-berry blend with a touch of honey. Tart, sweet and deeply pink — the colour alone sells it.",
    ingredients: ["Strawberries", "Blueberries", "Blackberries", "Honey", "Fresh milk"],
    price: 5800,
    image: IMAGES.berryMedley,
    sizes: drinkSizes(),
  },
  {
    id: "blueberry-cloud",
    category: "smoothies",
    name: "Blueberry Cloud",
    tagline: "Blueberry · banana · oat milk",
    description:
      "Blueberries whipped with banana and oat milk into a lavender-hued cloud. Dairy-free and dangerously smooth.",
    ingredients: ["Blueberries", "Banana", "Oat milk"],
    price: 6200,
    image: IMAGES.blueberryCloud,
    sizes: drinkSizes(),
  },
  {
    id: "tropical-glow-bowl",
    category: "smoothies",
    name: "Tropical Glow Bowl",
    tagline: "Mango · berries · granola",
    description:
      "A thick mango-berry blend eaten with a spoon, loaded with fresh fruit, almonds and crunch. Breakfast, upgraded.",
    ingredients: ["Mango", "Mixed berries", "Granola", "Almonds", "Coconut flakes"],
    price: 7500,
    image: IMAGES.glowBowl,
    badge: "Breakfast hero",
    sizes: drinkSizes(),
  },
  {
    id: "strawberry-fields",
    category: "smoothies",
    name: "Strawberry Fields",
    tagline: "Strawberry · mint · coconut water",
    description:
      "Lighter and fresher — strawberries and mint over coconut water. The post-workout (or post-party) reset.",
    ingredients: ["Strawberries", "Fresh mint", "Coconut water"],
    price: 4800,
    image: IMAGES.strawberryFields,
    sizes: drinkSizes(),
  },
  {
    id: "pink-shake",
    category: "smoothies",
    name: "Pink Shake",
    tagline: "Strawberry · vanilla · milk",
    description:
      "Old-school milkshake energy: strawberries, vanilla and cold milk, crowned with whipped cream. No notes.",
    ingredients: ["Strawberries", "Vanilla", "Cold milk", "Whipped cream"],
    price: 5500,
    image: IMAGES.pinkShake,
    sizes: drinkSizes(),
  },
  {
    id: "mango-tango",
    category: "smoothies",
    name: "Mango Tango",
    tagline: "Ripe mango · yoghurt · honey",
    description:
      "Thick-blended ripe mangoes with creamy yoghurt and a touch of honey. Golden, tropical and the taste of a good Lagos afternoon.",
    ingredients: ["Ripe mangoes", "Creamy yoghurt", "Honey", "Ice"],
    price: 5500,
    image: IMAGES.mangoTango,
    badge: "Seasonal star",
    sizes: drinkSizes(),
  },
  {
    id: "green-glow",
    category: "smoothies",
    name: "Green Glow",
    tagline: "Spinach · apple · mint · lime",
    description:
      "Fresh spinach and green apple blended with mint and a squeeze of lime. Tastes far better than it looks — clean, cold and energising.",
    ingredients: ["Spinach", "Green apple", "Fresh mint", "Lime", "Ice"],
    price: 6000,
    image: IMAGES.greenGlow,
    sizes: drinkSizes(),
  },
  {
    id: "pb-banana",
    category: "smoothies",
    name: "PB Banana Smoothie",
    tagline: "Peanut butter · banana · milk",
    description:
      "Banana and peanut butter blended with cold milk into a filling, protein-ish treat. Breakfast, a post-workout fix and a snack in one cup.",
    ingredients: ["Banana", "Peanut butter", "Cold milk", "Oats", "Honey"],
    price: 5800,
    image: IMAGES.pbBanana,
    sizes: drinkSizes(),
  },
  {
    id: "avocado-cream",
    category: "smoothies",
    name: "Avocado Cream",
    tagline: "Avocado · milk · vanilla",
    description:
      "Ripe avocado whipped with cold milk and vanilla into something impossibly silky. Rich, creamy and surprisingly moreish.",
    ingredients: ["Ripe avocado", "Cold milk", "Vanilla", "Honey"],
    price: 6500,
    image: IMAGES.avoCream,
    sizes: drinkSizes(),
  },
  {
    id: "chocolate-shake",
    category: "smoothies",
    name: "Chocolate Shake",
    tagline: "Cocoa · milk · vanilla cream",
    description:
      "A proper thick chocolate shake — real cocoa, cold milk and vanilla, crowned with cream. Dessert you can drink with a straight face.",
    ingredients: ["Cocoa", "Cold milk", "Vanilla", "Whipped cream", "Ice"],
    price: 5800,
    image: IMAGES.chocoShake,
    sizes: drinkSizes(),
  },

  // ------------------------------- JUICES ------------------------------
  {
    id: "orange-classic",
    category: "juices",
    name: "Fresh Squeezed Orange",
    tagline: "100% oranges. Nothing else.",
    description:
      "Oranges pressed to order — never from concentrate, never with added sugar. Sunshine in a cup.",
    ingredients: ["100% fresh oranges"],
    price: 3800,
    image: IMAGES.orangeClassic,
    sizes: drinkSizes(),
  },
  {
    id: "sunrise-orange",
    category: "juices",
    name: "Sunrise Orange 500ml",
    tagline: "Big bottle, bright morning",
    description:
      "Half a litre of fresh-pressed orange juice, bottled for your fridge or your commute. Serves one very happy person.",
    ingredients: ["100% fresh oranges"],
    price: 4500,
    image: IMAGES.orangeMorning,
    sizes: drinkSizes(),
  },
  {
    id: "mango-gold",
    category: "juices",
    name: "Mango Gold 500ml",
    tagline: "Ripe mango, pressed thick",
    description:
      "Thick-pressed ripe mangoes with a squeeze of lime. Tastes like the best part of mango season, all year.",
    ingredients: ["Ripe mangoes", "Lime"],
    price: 4800,
    image: IMAGES.mangoBottle,
    badge: "Seasonal star",
    sizes: drinkSizes(),
  },
  {
    id: "citrus-press",
    category: "juices",
    name: "Citrus Press Cooler",
    tagline: "Orange · pineapple · mint",
    description:
      "Orange and pineapple pressed together over ice with torn mint. The cooler every Lagos afternoon deserves.",
    ingredients: ["Oranges", "Pineapple", "Fresh mint"],
    price: 4200,
    image: IMAGES.orangePress,
    sizes: drinkSizes(),
  },
  {
    id: "pineapple-juice",
    category: "juices",
    name: "Pineapple Juice",
    tagline: "100% pineapple, pressed fresh",
    description:
      "Ripe pineapples pressed to order into a golden, tangy-sweet juice. Nothing added, nothing taken away — just pineapple.",
    ingredients: ["100% fresh pineapple"],
    price: 4200,
    image: IMAGES.pineappleJuice,
    sizes: drinkSizes(),
  },
  {
    id: "watermelon-juice",
    category: "juices",
    name: "Watermelon Juice",
    tagline: "Cold-pressed watermelon",
    description:
      "Fresh watermelon pressed into a light, hydrating pink juice. The most refreshing thing on the menu on a hot Lagos day.",
    ingredients: ["100% fresh watermelon", "Lime"],
    price: 4000,
    image: IMAGES.watermelonJuice,
    badge: "New",
    sizes: drinkSizes(),
  },
  {
    id: "green-juice",
    category: "juices",
    name: "Green Machine Juice",
    tagline: "Cucumber · celery · green apple",
    description:
      "Cucumber, celery and green apple cold-pressed into a clean, crisp green juice. Light, hydrating and exactly what it says on the tin.",
    ingredients: ["Cucumber", "Celery", "Green apple", "Lime", "Ginger"],
    price: 4800,
    image: IMAGES.greenJuice,
    sizes: drinkSizes(),
  },
  {
    id: "lemon-ginger",
    category: "juices",
    name: "Lemon Ginger Refresher",
    tagline: "Lemon · ginger · a little honey",
    description:
      "Fresh lemon and ginger over ice with a touch of honey. Bright, zingy and just spicy enough — a pick-me-up in a cup.",
    ingredients: ["Fresh lemon", "Ginger", "Honey", "Ice"],
    price: 3800,
    image: IMAGES.lemonGinger,
    sizes: drinkSizes(),
  },
];

export const productById = (id: string): Product | undefined =>
  PRODUCTS.find((p) => p.id === id);

export const productsByCategory = (c: Category): Product[] =>
  PRODUCTS.filter((p) => p.category === c);

export const CATEGORIES: { slug: Category; name: string; blurb: string }[] = [
  { slug: "cakes", name: "Cakes", blurb: "Showpieces for the days worth marking" },
  { slug: "donuts", name: "Donuts", blurb: "Singles, and boxes worth fighting over" },
  { slug: "smoothies", name: "Smoothies", blurb: "Thick, cold, and blended to order" },
  { slug: "juices", name: "Natural Juices", blurb: "Pressed fresh — never from a bottle" },
];

/* ------------------------------ HERO SLIDES ----------------------------- */

export interface HeroSlide {
  eyebrow: string;
  titleA: string;
  titleB: string;
  text: string;
  cta: string;
  href: string;
  image: Img;
  bg: string; // flat hex tint behind the hero photo
  chip: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    eyebrow: "01 · Cakes",
    titleA: "MAKE YOUR",
    titleB: "CAKE",
    text: "Choose the shape, the sponge, the filling, the colour, the words on top. Then watch our bakers turn your idea into something you can hold — and never let go of.",
    cta: "Build Your Cake",
    href: "/build/cake",
    image: IMAGES.heroCake,
    bg: "#f0e2d0",
    chip: "From ₦18,000",
  },
  {
    eyebrow: "02 · Donuts",
    titleA: "STACK YOUR",
    titleB: "BOX",
    text: "Pick the glazes, mix the flavours, pile on the toppings. Six bites, six personalities, one box that says exactly who you turned out to be.",
    cta: "Build Your Box",
    href: "/build/donuts",
    image: IMAGES.heroDonuts,
    bg: "#efe0c8",
    chip: "From ₦6,800",
  },
  {
    eyebrow: "03 · Smoothies",
    titleA: "BLEND YOUR",
    titleB: "MOOD",
    text: "Real fruit, blended thick, finished your way. No soda, no syrup, no shortcuts — just the honest cold of something made for you.",
    cta: "Build Your Blend",
    href: "/build/smoothie",
    image: IMAGES.heroSmoothie,
    bg: "#e0ecdf",
    chip: "From ₦3,500",
  },
];

/* ---------------------------- BUILDER OPTIONS --------------------------- */

export interface PricedOption {
  value: string;
  label: string;
  delta: number;
  swatch?: string; // hex for visual preview
  note?: string;
}

export const CAKE_BASE = 18000;

export const CAKE_SHAPES: PricedOption[] = [
  { value: "round", label: "Round", delta: 0, note: "The classic" },
  { value: "square", label: "Square", delta: 2000, note: "Modern edges" },
  { value: "heart", label: "Heart", delta: 4500, note: "For sweethearts" },
];

export const CAKE_SIZES: PricedOption[] = [
  { value: '6"', label: '6" · Serves 8–10', delta: 0 },
  { value: '8"', label: '8" · Serves 12–16', delta: 8000 },
  { value: '10"', label: '10" · Serves 20–25', delta: 16000 },
  { value: '12"', label: '12" · Serves 30–40', delta: 26000 },
];

export const CAKE_FLAVOURS: PricedOption[] = [
  { value: "Vanilla", label: "Vanilla Bean", delta: 0, swatch: "#f6e3b4" },
  { value: "Chocolate", label: "Chocolate", delta: 1500, swatch: "#6b3e26" },
  { value: "Red Velvet", label: "Red Velvet", delta: 2500, swatch: "#a62b3a" },
  { value: "Strawberry", label: "Strawberry", delta: 2000, swatch: "#f7a8b8" },
  { value: "Lemon", label: "Lemon Zest", delta: 1500, swatch: "#f5e08c" },
  { value: "Coconut", label: "Coconut", delta: 2000, swatch: "#fbf6ec" },
];

export const CAKE_FILLINGS: PricedOption[] = [
  { value: "None", label: "No filling", delta: 0 },
  { value: "Chocolate ganache", label: "Chocolate ganache", delta: 2500 },
  { value: "Strawberry jam", label: "Strawberry jam", delta: 2000 },
  { value: "Caramel", label: "Salted caramel", delta: 2500 },
  { value: "Cream cheese", label: "Cream cheese", delta: 3000 },
  { value: "Lemon curd", label: "Lemon curd", delta: 2200 },
];

export const CAKE_FROSTINGS: PricedOption[] = [
  { value: "Buttercream", label: "Buttercream", delta: 0, swatch: "#fff3e0" },
  { value: "Whipped cream", label: "Whipped cream", delta: 1500, swatch: "#ffffff" },
  { value: "Pink frosting", label: "Pink frosting", delta: 2000, swatch: "#ffc2d4" },
  { value: "Chocolate drip", label: "Chocolate drip", delta: 3000, swatch: "#4a2a1a" },
  { value: "Fondant", label: "Smooth fondant", delta: 6000, swatch: "#fdf7ff" },
  { value: "Naked", label: "Naked (rustic)", delta: -1000 },
];

export const CAKE_TOPPINGS: PricedOption[] = [
  { value: "Sprinkles", label: "Rainbow sprinkles", delta: 1000 },
  { value: "Fresh berries", label: "Fresh berries", delta: 3500 },
  { value: "Chocolate shavings", label: "Chocolate shavings", delta: 2000 },
  { value: "Gold dust", label: "Edible gold dust", delta: 5000 },
  { value: "Oreo crunch", label: "Oreo crunch", delta: 1800 },
  { value: "Toasted coconut", label: "Toasted coconut", delta: 1500 },
  { value: "Cherries", label: "Glazed cherries", delta: 2200 },
  { value: "Fresh flowers", label: "Fresh flowers", delta: 4000 },
];

export const DONUT_BOXES: PricedOption[] = [
  { value: "4", label: "Box of 4", delta: 0, note: "₦6,800" },
  { value: "6", label: "Box of 6", delta: 2600, note: "₦9,400" },
  { value: "9", label: "Box of 9", delta: 6800, note: "₦13,600" },
  { value: "12", label: "Box of 12", delta: 10200, note: "₦17,000" },
];
export const DONUT_BOX_BASE = 6800;

export const DONUT_FLAVOURS: PricedOption[] = [
  { value: "Strawberry", label: "Strawberry", delta: 0, swatch: "#ff8fb1" },
  { value: "Chocolate", label: "Chocolate", delta: 0, swatch: "#5a3423" },
  { value: "Vanilla", label: "Vanilla", delta: 0, swatch: "#f7e7c3" },
  { value: "Honey glaze", label: "Honey glaze", delta: 0, swatch: "#f2b950" },
  { value: "Blueberry", label: "Blueberry", delta: 300, swatch: "#8b7bd8" },
  { value: "Lemon", label: "Lemon", delta: 300, swatch: "#f5dd6b" },
  { value: "Caramel", label: "Caramel", delta: 300, swatch: "#d99a4e" },
  { value: "Red velvet", label: "Red velvet", delta: 400, swatch: "#b03040" },
];

export const DONUT_GLAZES: PricedOption[] = [
  { value: "Classic shine", label: "Classic shine", delta: 0 },
  { value: "Chocolate dip", label: "Extra chocolate dip", delta: 800 },
  { value: "Strawberry dip", label: "Extra strawberry dip", delta: 800 },
  { value: "Caramel drizzle", label: "Caramel drizzle", delta: 1000 },
  { value: "Vanilla bean", label: "Vanilla bean glaze", delta: 600 },
];

export const DONUT_TOPPINGS: PricedOption[] = [
  { value: "Sprinkles", label: "Rainbow sprinkles", delta: 800 },
  { value: "Chopped nuts", label: "Chopped roasted nuts", delta: 1000 },
  { value: "Oreo crumbs", label: "Oreo crumbs", delta: 900 },
  { value: "Coconut flakes", label: "Coconut flakes", delta: 700 },
  { value: "Choc chips", label: "Chocolate chips", delta: 900 },
  { value: "Dried berries", label: "Freeze-dried berries", delta: 1200 },
];

export const SMOOTHIE_BASE_PRICE = 3500;

export const SMOOTHIE_SIZES: PricedOption[] = [
  { value: "Regular 350ml", label: "Regular · 350ml", delta: 0 },
  { value: "Large 500ml", label: "Large · 500ml", delta: 1500 },
];

export const SMOOTHIE_BASES: PricedOption[] = [
  { value: "Milk", label: "Fresh milk", delta: 0, swatch: "#fdf6ec" },
  { value: "Yoghurt", label: "Creamy yoghurt", delta: 800, swatch: "#f6efe2" },
  { value: "Coconut water", label: "Coconut water", delta: 600, swatch: "#eef7ee" },
  { value: "Orange juice", label: "Orange juice", delta: 500, swatch: "#ffe3b3" },
  { value: "Almond milk", label: "Almond milk", delta: 1200, swatch: "#f3e8d5" },
];

export const SMOOTHIE_FRUITS: PricedOption[] = [
  { value: "Strawberry", label: "Strawberry", delta: 900, swatch: "#ff6b8f" },
  { value: "Banana", label: "Banana", delta: 500, swatch: "#f7e08b" },
  { value: "Mango", label: "Mango", delta: 1000, swatch: "#ffb03a" },
  { value: "Pineapple", label: "Pineapple", delta: 800, swatch: "#ffe066" },
  { value: "Blueberry", label: "Blueberry", delta: 1200, swatch: "#7c6fd0" },
  { value: "Apple", label: "Green apple", delta: 600, swatch: "#a8d878" },
  { value: "Watermelon", label: "Watermelon", delta: 500, swatch: "#ff7d7d" },
  { value: "Avocado", label: "Avocado", delta: 1500, swatch: "#9dbb5f" },
];

export const SMOOTHIE_EXTRAS: PricedOption[] = [
  { value: "Honey", label: "Honey", delta: 500 },
  { value: "Ginger", label: "Fresh ginger", delta: 300 },
  { value: "Mint", label: "Mint leaves", delta: 200 },
  { value: "Chia seeds", label: "Chia seeds", delta: 700 },
  { value: "Oats", label: "Rolled oats", delta: 400 },
  { value: "Peanut butter", label: "Peanut butter", delta: 800 },
  { value: "Dates", label: "Dates", delta: 600 },
  { value: "Extra ice", label: "Extra ice", delta: 0 },
];
