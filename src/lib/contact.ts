/**
 * Single source of truth for how customers reach the bakery. The contact page
 * and the footer both read from here, so updating a number in one place updates
 * it everywhere. These are sensible placeholders — swap in the real details.
 */
export const CONTACT = {
  businessName: "Donuts & Cakes",
  area: "Lagos, Nigeria",
  phoneDisplay: "+234 803 000 0000",
  phoneTel: "+2348030000000",
  /** Digits only, no leading +, for wa.me links. */
  whatsapp: "2348030000000",
  email: "hello@donutsandcakes.ng",
  instagramHandle: "@donutsandcakes",
  instagramUrl: "https://instagram.com/donutsandcakes",
  hours: [
    { days: "Tuesday – Sunday", time: "9am – 8pm" },
    { days: "Monday", time: "Closed · we rest the ovens" },
  ],
  deliveryNote:
    "We deliver across Lagos. Free over ₦50,000 — otherwise we quote the exact fee on your confirmation call, never a surprise.",
  leadNote:
    "Ready-made treats need a day's notice. Custom cakes are baked to order, so give us 48 hours.",
} as const;

/** Build a wa.me deep link with a prefilled message. */
export function whatsappLink(message: string): string {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}
