import type { Metadata } from "next";
import CategoryView from "@/components/CategoryView";

export const metadata: Metadata = {
  title: "Donuts",
  description:
    "Fluffy donuts, glazed rings and shareable party boxes. Build your own box or grab a ready-made favourite.",
};

export default function DonutsPage() {
  return (
    <CategoryView
      category="donuts"
      title="Donuts"
      blurb="Pillowy, glossy and gone too fast. Singles for the craving, boxes for the crowd."
      builderHref="/build/donuts"
      builderLabel="Build your donut box"
      builderText="Pick the box size, choose every flavour, glaze and topping — watch it fill up live."
    />
  );
}
