"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/store/cart";
import { IMAGES } from "@/lib/images";
import {
  DONUT_BOXES,
  DONUT_BOX_BASE,
  DONUT_FLAVOURS,
  DONUT_GLAZES,
  DONUT_TOPPINGS,
} from "@/lib/catalog";
import { BuilderLayout, MultiPicker, SinglePicker, Step } from "@/components/builder";
import PreviewStage from "@/components/PreviewStage";
import DonutBoxPreview from "@/components/DonutBoxPreview";
import { cn } from "@/lib/utils";

interface DonutConfig {
  box: string;
  slots: string[];
  glaze: string;
  toppings: string[];
}

function deltaOf(list: { value: string; delta: number }[], value: string): number {
  return list.find((o) => o.value === value)?.delta ?? 0;
}

function DonutBuilderForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { addItem, updateItem, getItem } = useCart();

  const editKey = params.get("edit");

  const existing = editKey ? getItem(editKey) : undefined;
  const cfg = (existing?.config as Partial<DonutConfig> | undefined) ?? {};

  const [box, setBox] = useState(cfg.box ?? "6");
  const count = parseInt(box, 10);
  const [slots, setSlots] = useState<string[]>(() => {
    if (cfg.slots && cfg.slots.length > 0) return cfg.slots.slice(0, parseInt(cfg.box ?? "6", 10));
    return Array(6).fill("Strawberry") as string[];
  });
  const [active, setActive] = useState(0);
  const [glaze, setGlaze] = useState(cfg.glaze ?? "Classic shine");
  const [toppings, setToppings] = useState<string[]>(cfg.toppings ?? ["Sprinkles"]);

  // Keep slot array in sync with box size
  const sizedSlots = useMemo(() => {
    const next = slots.slice(0, count);
    while (next.length < count) next.push(next[next.length - 1] ?? "Strawberry");
    return next;
  }, [slots, count]);

  const changeBox = (v: string) => {
    setBox(v);
    setActive(0);
  };

  const assignFlavour = (flavour: string) => {
    setSlots((prev) => {
      const base = prev.slice(0, count);
      while (base.length < count) base.push(base[base.length - 1] ?? "Strawberry");
      base[Math.min(active, count - 1)] = flavour;
      return base;
    });
    setActive((a) => (a + 1) % count);
  };

  const fillAll = (flavour: string) => setSlots(Array(count).fill(flavour));

  const surpriseMe = () => {
    const pool = DONUT_FLAVOURS.map((f) => f.value);
    setSlots(Array.from({ length: count }, () => pool[Math.floor(Math.random() * pool.length)]));
  };

  const total = useMemo(
    () =>
      DONUT_BOX_BASE +
      deltaOf(DONUT_BOXES, box) +
      sizedSlots.reduce((n, f) => n + deltaOf(DONUT_FLAVOURS, f), 0) +
      deltaOf(DONUT_GLAZES, glaze) +
      toppings.reduce((n, t) => n + deltaOf(DONUT_TOPPINGS, t), 0),
    [box, sizedSlots, glaze, toppings]
  );

  const flavourCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const f of sizedSlots) map.set(f, (map.get(f) ?? 0) + 1);
    return [...map.entries()].map(([f, n]) => `${n}× ${f}`).join(", ");
  }, [sizedSlots]);

  const toggleTopping = (v: string) =>
    setToppings((prev) => (prev.includes(v) ? prev.filter((t) => t !== v) : [...prev, v]));

  const handleAdd = () => {
    const details = [
      `Box of ${count}`,
      `Flavours: ${flavourCounts}`,
      `Glaze: ${glaze}`,
      toppings.length > 0 ? `Toppings: ${toppings.join(", ")}` : "Toppings: none",
    ];
    const config: DonutConfig = { box, slots: sizedSlots, glaze, toppings };
    const name = `Custom Donut Box (${count})`;
    if (editKey && existing) {
      updateItem(editKey, { name, unitPrice: total, details, config });
    } else {
      addItem({ kind: "donut", name, unitPrice: total, details, config, editPath: "/build/donuts" });
    }
    router.push("/cart");
  };

  return (
    <BuilderLayout
      eyebrow={editKey ? "Donut studio · editing" : "Studio 02 · Donut box builder"}
      title={editKey ? "Tweak your box" : "Build your donut box"}
      intro="Choose a flavour for each donut, then finish the box with glaze and toppings."
      cover={IMAGES.heroDonuts}
      stepCount={5}
      preview={
        <PreviewStage model={{ kind: "donut", slots: sizedSlots, glaze, toppings }}>
          <div
            key={`${box}|${glaze}|${toppings.join(",")}|${sizedSlots.join(",")}`}
            className="animate-preview-pop"
          >
            <DonutBoxPreview
              slots={sizedSlots.map((flavour) => ({ flavour }))}
              glaze={glaze}
              toppings={toppings}
            />
          </div>
        </PreviewStage>
      }
      previewLabel={`Box of ${count}: ${flavourCounts}`}
      total={total}
      cta={editKey ? "Update cart" : "Add to cart"}
      onAdd={handleAdd}
    >
      <Step n="01" title="Box size" hint="How many mouths are you feeding?">
        <SinglePicker label="Box size" options={DONUT_BOXES} value={box} onChange={changeBox} />
      </Step>

      <Step n="02" title="Flavours" hint={`Slot ${Math.min(active + 1, count)} of ${count} selected — tap a flavour to fill it.`}>
        <div className="mb-3 grid grid-cols-4 gap-2 sm:grid-cols-6" role="group" aria-label="Donut slots">
          {sizedSlots.map((f, i) => {
            const swatch = DONUT_FLAVOURS.find((d) => d.value === f)?.swatch ?? "#ff8fb1";
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                aria-label={`Slot ${i + 1}: ${f}. Select to change.`}
                title={`Slot ${i + 1}: ${f}`}
                className={cn(
                  "relative grid aspect-square min-h-[52px] place-items-center rounded-2xl border-2 bg-sand transition active:scale-95",
                  i === active ? "border-ember shadow-[0_4px_14px_rgba(143,44,7,0.3)]" : "border-choco/15 hover:border-choco/40"
                )}
              >
                <span
                  aria-hidden
                  className="relative grid h-[72%] w-[72%] place-items-center rounded-full shadow-[inset_-5px_-7px_10px_rgba(43,28,21,0.25),inset_3px_3px_8px_rgba(255,255,255,0.65),0_4px_7px_rgba(43,28,21,0.18)]"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, #fffdfa 0 15%, #6f432e 16% 24%, transparent 25%), radial-gradient(circle at 30% 25%, rgba(255,255,255,.8), transparent 40%), linear-gradient(145deg, ${swatch}, ${swatch} 62%, #70452d)`,
                  }}
                >
                  <span className="absolute -right-1 -top-1 rounded-full bg-cocoa px-1.5 py-0.5 text-[9px] font-black leading-none text-cream">{i + 1}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div aria-label="Assign flavour" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {DONUT_FLAVOURS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => assignFlavour(f.value)}
              className="flex min-h-[52px] items-center gap-2 rounded-2xl border-2 border-choco/15 bg-cream px-3 text-left text-sm font-bold transition hover:border-ember/50 active:scale-[0.98]"
            >
              <span aria-hidden className="h-6 w-6 shrink-0 rounded-full border border-choco/20" style={{ background: f.swatch }} />
              <span>
                {f.label}
                {f.delta > 0 && <span className="block text-[11px] font-semibold text-choco/70">+₦{f.delta.toLocaleString()} each</span>}
              </span>
            </button>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={surpriseMe}
            className="min-h-[44px] rounded-full bg-choco px-5 text-sm font-bold text-cream transition hover:bg-cocoa active:scale-95"
          >
            🎲 Surprise me
          </button>
          <button
            type="button"
            onClick={() => fillAll(sizedSlots[Math.min(active, count - 1)] ?? "Strawberry")}
            className="min-h-[44px] rounded-full border-2 border-choco/15 px-5 text-sm font-bold transition hover:border-choco/40 active:scale-95"
          >
            Fill box with this flavour
          </button>
        </div>
      </Step>

      <Step n="03" title="Glaze" hint="One finishing glaze across the whole box.">
        <SinglePicker label="Box glaze" options={DONUT_GLAZES} value={glaze} onChange={setGlaze} />
      </Step>

      <Step n="04" title="Toppings" hint="Scattered over every donut.">
        <MultiPicker label="Donut toppings" options={DONUT_TOPPINGS} values={toppings} onToggle={toggleTopping} />
      </Step>

      <Step n="05" title="Review" hint="Your box, in words.">
        <ul className="space-y-1.5 text-sm font-semibold">
          {[
            `Box of ${count}`,
            `Flavours: ${flavourCounts}`,
            `Glaze: ${glaze}`,
            toppings.length > 0 ? `Toppings: ${toppings.join(", ")}` : "Toppings: none",
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
function DonutBuilderInner() {
  const { hydrated } = useCart();
  if (!hydrated) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
        <p className="font-display text-2xl font-black">Loading your box…</p>
      </div>
    );
  }
  return <DonutBuilderForm />;
}

export default function BuildDonutsPage() {
  return (
    <Suspense>
      <DonutBuilderInner />
    </Suspense>
  );
}
