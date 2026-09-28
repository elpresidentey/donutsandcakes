/**
 * Curated Pexels food photography.
 * URL pattern: https://images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg
 * Each entry: [pexelsId, altText]. Use `px(id)` to build a sized URL.
 */
export function px(id: number, w = 1200): string {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
}

export type Img = { id: number; alt: string };

const img = (id: number, alt: string): Img => ({ id, alt });

export const IMAGES = {
  // Hero slides: landscape, moody, subject sits centre/right so the headline
  // has the dark left third to itself. Portrait shots get cropped to mush by
  // object-cover in a wide viewport, so these are all ~3:2.
  heroCake: img(3534022, "Cake with lit candles held in a dark, candlelit room"),
  heroDonuts: img(4801057, "Assorted glazed and sprinkled donuts in an open box"),
  heroSmoothie: img(2351085, "Pink berry smoothie in a tall glass with a fruit garnish"),

  chocoFudge: img(2067436, "Chocolate fudge cake on rustic linen"),
  chocoTruffle: img(2144200, "Chocolate layer cake with frosting"),
  vanillaParty: img(4110012, "White frosted birthday cake with lit candles"),
  flowerCake: img(19310813, "Rustic birthday cake with flowers and candles"),

  redVelvetCups: img(37754631, "Red velvet cupcakes with cream cheese frosting"),
  pinkPartyCups: img(6815973, "Chocolate cupcakes with pink frosting"),
  strawberryCups: img(8655210, "Strawberry topped cupcakes with pink frosting"),
  chocoSwirlCup: img(1775285, "Chocolate cupcake with swirl frosting"),
  birthdayCup: img(913136, "Chocolate cupcake with birthday topper"),
  blueCup: img(1591147, "Cupcake with blue icing"),
  assortedCups: img(33248585, "Assorted frosted cupcakes in a box"),

  sprinkleSingle: img(1785852, "Donut with colourful sprinkles held in hands"),
  glazedBox: img(9619310, "Glazed donuts arranged in a box"),
  partyMixBox: img(34491951, "Assorted glazed and chocolate donuts in a box"),
  pinkParade: img(35081225, "Pink iced donuts with sprinkles"),
  honeyGlaze: img(22679361, "Close-up of glossy glazed donuts"),
  chocoVanillaMix: img(22856218, "Variety of frosted doughnuts with toppings"),

  strawberryBliss: img(775032, "Strawberry smoothie in a jar with berries"),
  strawberryFields: img(4051780, "Strawberry smoothie on a white table"),
  berryMedley: img(434295, "Berry smoothies with fresh berries"),
  blueberryCloud: img(17585023, "Purple berry smoothie in a crystal glass"),
  glowBowl: img(1099680, "Smoothie bowl topped with berries and mango"),
  pinkShake: img(26844445, "Strawberry shake in a tall glass"),

  orangeClassic: img(5947063, "Pouring fresh orange juice into a glass"),
  orangeMorning: img(12896835, "Fresh orange juice with citrus slices and juicer"),
  mangoBottle: img(4955257, "Mango juice in a glass bottle with ripe mangoes"),
  orangePress: img(29185888, "Pouring fresh tropical juice into a glass"),
} satisfies Record<string, Img>;
