import type { Metadata } from "next";
import CategoryView from "@/components/CategoryView";

export const metadata: Metadata = {
  title: "Cakes",
  description:
    "Ready-made celebration cakes, cupcakes and fully custom builds. Chocolate, vanilla, red velvet and more — Lagos, Nigeria.",
};

export default function CakesPage() {
  return (
    <CategoryView
      category="cakes"
      title="Cakes"
      blurb="Ready-made showpieces and cupcakes, baked fresh every morning. Want it your way? The cake builder is one tap away."
      builderHref="/build/cake"
      builderLabel="Build a custom cake"
      builderText="Shape, size, flavour, filling, frosting, toppings & your inscription — with a live preview."
      galleryHref="/cakes/gallery"
      galleryLabel="Browse the cake gallery"
    />
  );
}
