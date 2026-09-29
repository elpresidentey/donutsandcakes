import type { Metadata } from "next";
import CakeGallery from "@/components/CakeGallery";

export const metadata: Metadata = {
  title: "Cake Gallery",
  description:
    "Browse every cake we bake — celebration cakes and cupcakes — then tap any treat for a closer look. Lagos, Nigeria.",
};

export default function CakeGalleryPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="text-label uppercase text-ember">
        Fresh from the oven
      </p>
      <h1 className="mt-1 font-display text-display">
        The cake gallery
      </h1>
      <p className="mt-2 max-w-xl text-choco/70">
        Every cake type we bake, in one place. Filter by occasion, tap any
        treat for a closer look, or jump straight to the builder for something
        fully yours.
      </p>
      <div className="mt-6">
        <CakeGallery />
      </div>
    </div>
  );
}
