"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/store/cart";
import { IMAGES } from "@/lib/images";
import {
  SMOOTHIE_BASES,
  SMOOTHIE_BASE_PRICE,
  SMOOTHIE_EXTRAS,
  SMOOTHIE_FRUITS,
  SMOOTHIE_SIZES,
} from "@/lib/catalog";
import { BuilderLayout, MultiPicker, SinglePicker, Step } from "@/components/builder";
import PreviewStage from "@/components/PreviewStage";
import SmoothiePreview from "@/components/SmoothiePreview";

interface SmoothieConfig {
  size: string;
  base: string;
  fruits: string[];
  extras: string[];
}

const DEFAULTS: SmoothieConfig = {
  size: "Regular 350ml",
  base: "Milk",
  fruits: ["Strawberry", "Banana"],
  extras: [],
};

function deltaOf(list: { value: string; delta: number }[], value: string): number {
  return list.find((o) => o.value === value)?.delta ?? 0;
}

function SmoothieBuilderForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { addItem, updateItem, getItem } = useCart();

  const editKey = params.get("edit");
  const existing = editKey ? getItem(editKey) : undefined;
  const initial: SmoothieConfig = {
    ...DEFAULTS,
    ...((existing?.config as Partial<SmoothieConfig> | undefined) ?? {}),
  };

  const [size, setSize] = useState(initial.size);
  const [base, setBase] = useState(initial.base);
  const [fruits, setFruits] = useState<string[]>(initial.fruits);
  const [extras, setExtras] = useState<string[]>(initial.extras);

  const total = useMemo(
    () =>
      SMOOTHIE_BASE_PRICE +
      deltaOf(SMOOTHIE_SIZES, size) +
      deltaOf(SMOOTHIE_BASES, base) +
      fruits.reduce((n, f) => n + deltaOf(SMOOTHIE_FRUITS, f), 0) +
      extras.reduce((n, e) => n + deltaOf(SMOOTHIE_EXTRAS, e), 0),
    [size, base, fruits, extras]
  );

  const baseSwatch = SMOOTHIE_BASES.find((b) => b.value === base)?.swatch ?? "#fdf6ec";
  const valid = fruits.length > 0;

  const toggleFruit = (v: string) =>
    setFruits((prev) => (prev.includes(v) ? prev.filter((f) => f !== v) : [...prev, v]));
  const toggleExtra = (v: string) =>
    setExtras((prev) => (prev.includes(v) ? prev.filter((e) => e !== v) : [...prev, v]));

  const surprise = () => {
    const pick = <T,>(l: T[]) => l[Math.floor(Math.random() * l.length)];
    setSize(pick(SMOOTHIE_SIZES.map((o) => o.value)));
    setBase(pick(SMOOTHIE_BASES.map((o) => o.value)));
    const pool = SMOOTHIE_FRUITS.map((o) => o.value);
    setFruits([...pool].sort(() => Math.random() - 0.5).slice(0, 1 + Math.floor(Math.random() * 4)));
    const exPool = SMOOTHIE_EXTRAS.map((o) => o.value);
    setExtras(exPool.filter(() => Math.random() > 0.7).slice(0, 2));
  };

  const handleAdd = () => {
    if (!valid) return;
    const details = [
      `Size: ${size}`,
      `Base: ${base}`,
      `Fruits: ${fruits.join(", ")}`,
      extras.length > 0 ? `Extras: ${extras.join(", ")}` : "Extras: none",
    ];
    const config: SmoothieConfig = { size, base, fruits, extras };
    const name = `Custom ${fruits[0]} Blend`;
    if (editKey && existing) {
      updateItem(editKey, { name, unitPrice: total, details, config });
    } else {
      addItem({ kind: "smoothie", name, unitPrice: total, details, config, editPath: "/build/smoothie" });
    }
    router.push("/cart");
  };

  return (
    <BuilderLayout
      eyebrow={editKey ? "Smoothie studio · editing" : "Studio 03 · Smoothie builder"}
      title={editKey ? "Tweak your blend" : "Build your blend"}
      intro="Choose your size, base and fruit. Your blend updates as you go."
      cover={IMAGES.heroSmoothie}
      stepCount={5}
      preview={
        <PreviewStage model={{ kind: "smoothie", size, baseSwatch, fruits, extras }}>
          <div
            key={`${size}|${base}|${fruits.join(",")}|${extras.join(",")}`}
            className="animate-preview-pop"
          >
            <SmoothiePreview baseSwatch={baseSwatch} fruits={fruits} extras={extras} size={size} />
          </div>
        </PreviewStage>
      }
      previewLabel={
        fruits.length > 0
          ? `${base} smoothie with ${fruits.join(", ")}`
          : "Empty glass — add some fruit"
      }
      total={total}
      cta={editKey ? "Update cart" : "Add to cart"}
      onAdd={handleAdd}
      canAdd={valid}
    >
      <div className="mb-6">
        <button
          type="button"
          onClick={surprise}
          className="min-h-[44px] rounded-full bg-cocoa px-5 text-sm font-bold text-cream transition hover:bg-ember active:scale-95"
        >
          🎲 Surprise me — the blender decides
        </button>
      </div>
      <Step n="01" title="Size" hint="Regular quenches. Large commits.">
        <SinglePicker label="Smoothie size" options={SMOOTHIE_SIZES} value={size} onChange={setSize} />
      </Step>

      <Step n="02" title="Base" hint="The creamy (or fresh) foundation.">
        <SinglePicker label="Smoothie base" options={SMOOTHIE_BASES} value={base} onChange={setBase} />
      </Step>

      <Step n="03" title="Fruits" hint="Pick 1–4 real fruits. This is where the colour comes from.">
        <MultiPicker label="Smoothie fruits" options={SMOOTHIE_FRUITS} values={fruits} onToggle={toggleFruit} max={4} />
        {fruits.length === 0 && (
          <p role="alert" className="mt-2 text-sm font-bold text-ember-deep">
            Add at least one fruit to build your blend.
          </p>
        )}
      </Step>

      <Step n="04" title="Extras" hint="The finishing touches.">
        <MultiPicker label="Smoothie extras" options={SMOOTHIE_EXTRAS} values={extras} onToggle={toggleExtra} />
      </Step>

      <Step n="05" title="Review" hint="Your blend, in words.">
        <ul className="space-y-1.5 text-sm font-semibold">
          {[
            `Size: ${size}`,
            `Base: ${base}`,
            fruits.length > 0 ? `Fruits: ${fruits.join(", ")}` : "Fruits: none yet",
            extras.length > 0 ? `Extras: ${extras.join(", ")}` : "Extras: none",
          ].map((d) => (
            <li key={d} className="flex gap-2">
              <span aria-hidden className="text-leaf">✓</span> {d}
            </li>
          ))}
        </ul>
      </Step>
    </BuilderLayout>
  );
}

/**
 * Gate: the persisted cart only exists in the browser, so wait for it before
 * mounting the form — otherwise defaults would clobber a saved configuration.
 * Kept as a separate component so the form's hooks never run conditionally.
 */
function SmoothieBuilderInner() {
  const { hydrated } = useCart();
  if (!hydrated) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
        <p className="font-display text-2xl font-black">Loading your blend…</p>
      </div>
    );
  }
  return <SmoothieBuilderForm />;
}

export default function BuildSmoothiePage() {
  return (
    <Suspense>
      <SmoothieBuilderInner />
    </Suspense>
  );
}
