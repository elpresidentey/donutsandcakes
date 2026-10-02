"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/store/cart";
import {
  CAKE_BASE,
  CAKE_FILLINGS,
  CAKE_FLAVOURS,
  CAKE_FROSTINGS,
  CAKE_SHAPES,
  CAKE_SIZES,
  CAKE_TOPPINGS,
} from "@/lib/catalog";
import { BuilderLayout, MultiPicker, SinglePicker, Step } from "@/components/builder";
import CakePreview from "@/components/CakePreview";

interface CakeConfig {
  shape: string;
  size: string;
  flavour: string;
  filling: string;
  frosting: string;
  toppings: string[];
  inscription: string;
  gold: boolean;
}

const DEFAULTS: CakeConfig = {
  shape: "round",
  size: '8"',
  flavour: "Vanilla",
  filling: "None",
  frosting: "Buttercream",
  toppings: ["Sprinkles"],
  inscription: "",
  gold: false,
};

const GOLD_PRICE = 1200;

function deltaOf(list: { value: string; delta: number }[], value: string): number {
  return list.find((o) => o.value === value)?.delta ?? 0;
}

function CakeBuilderForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { addItem, updateItem, getItem } = useCart();

  const editKey = params.get("edit");

  const existing = editKey ? getItem(editKey) : undefined;
  const initial: CakeConfig =
    existing && existing.config
      ? { ...DEFAULTS, ...((existing.config as Partial<CakeConfig>) ?? {}) }
      : DEFAULTS;

  const [shape, setShape] = useState(initial.shape);
  const [size, setSize] = useState(initial.size);
  const [flavour, setFlavour] = useState(initial.flavour);
  const [filling, setFilling] = useState(initial.filling);
  const [frosting, setFrosting] = useState(initial.frosting);
  const [toppings, setToppings] = useState<string[]>(initial.toppings);
  const [inscription, setInscription] = useState(initial.inscription);
  const [gold, setGold] = useState(initial.gold);

  const total = useMemo(
    () =>
      CAKE_BASE +
      deltaOf(CAKE_SHAPES, shape) +
      deltaOf(CAKE_SIZES, size) +
      deltaOf(CAKE_FLAVOURS, flavour) +
      deltaOf(CAKE_FILLINGS, filling) +
      deltaOf(CAKE_FROSTINGS, frosting) +
      toppings.reduce((n, t) => n + deltaOf(CAKE_TOPPINGS, t), 0) +
      (gold && inscription.trim() ? GOLD_PRICE : 0),
    [shape, size, flavour, filling, frosting, toppings, gold, inscription]
  );

  const sponge = CAKE_FLAVOURS.find((f) => f.value === flavour)?.swatch ?? "#f6e3b4";
  const frostSwatch = CAKE_FROSTINGS.find((f) => f.value === frosting)?.swatch ?? "#fff3e0";

  const summary = `${shape} ${flavour} cake, ${size}, ${frosting.toLowerCase()} frosting`;

  const toggleTopping = (v: string) =>
    setToppings((prev) => (prev.includes(v) ? prev.filter((t) => t !== v) : [...prev, v]));

  const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];
  const surprise = () => {
    setShape(pick(CAKE_SHAPES.map((o) => o.value)));
    setSize(pick(CAKE_SIZES.map((o) => o.value)));
    setFlavour(pick(CAKE_FLAVOURS.map((o) => o.value)));
    setFilling(pick(CAKE_FILLINGS.map((o) => o.value)));
    setFrosting(pick(CAKE_FROSTINGS.map((o) => o.value)));
    const pool = CAKE_TOPPINGS.map((o) => o.value);
    setToppings(pool.filter(() => Math.random() > 0.55).slice(0, 4));
    const lines = ["Nigeria", "Happy Birthday!", "Congratulations!", "God Is Good", "Ada's Special", "It's a party"];
    setInscription(pick(lines));
    setGold(Math.random() > 0.5);
  };

  const handleAdd = () => {
    const details = [
      `Shape: ${shape}`,
      `Size: ${size}`,
      `Flavour: ${flavour}`,
      `Filling: ${filling}`,
      `Frosting: ${frosting}`,
      toppings.length > 0 ? `Toppings: ${toppings.join(", ")}` : "Toppings: none",
    ];
    if (inscription.trim()) {
      details.push(`Inscription: “${inscription.trim().slice(0, 20)}”${gold ? " (gold)" : ""}`);
    }
    const config: CakeConfig = { shape, size, flavour, filling, frosting, toppings, inscription, gold };
    const name = `Custom ${flavour} Cake (${size})`;
    if (editKey && existing) {
      updateItem(editKey, { name, unitPrice: total, details, config });
    } else {
      addItem({ kind: "cake", name, unitPrice: total, details, config, editPath: "/build/cake" });
    }
    router.push("/cart");
  };

  return (
    <BuilderLayout
      eyebrow={editKey ? "Cake studio · editing" : "Studio 01 · Cake builder"}
      title={editKey ? "Tweak your cake" : "Build your cake"}
      intro="Every tap redraws your cake and updates the price. Play as long as you like — the best ones never get rushed."
      preview={
        <div
          key={`${shape}|${size}|${sponge}|${frostSwatch}|${frosting}|${filling}|${toppings.join(",")}`}
          className="animate-preview-pop"
        >
          <CakePreview
            shape={shape}
            size={size}
            sponge={sponge}
            frosting={frostSwatch}
            frostingKind={frosting}
            filling={filling}
            toppings={toppings}
            inscription={inscription}
            gold={gold}
          />
        </div>
      }
      previewLabel={summary}
      total={total}
      cta={editKey ? "Update cart" : "Add to cart"}
      onAdd={handleAdd}
    >
      <div className="mb-6">
        <button
          type="button"
          onClick={surprise}
          className="min-h-[44px] rounded-full bg-cocoa px-5 text-sm font-bold text-cream transition hover:bg-ember active:scale-95"
        >
          🎲 Surprise me — let fate frost
        </button>
      </div>
      <Step n="01" title="Shape" hint="The silhouette of your showpiece.">
        <SinglePicker label="Cake shape" options={CAKE_SHAPES} value={shape} onChange={setShape} />
      </Step>

      <Step n="02" title="Size" hint="Bigger party? Bigger cake.">
        <SinglePicker label="Cake size" options={CAKE_SIZES} value={size} onChange={setSize} />
      </Step>

      <Step n="03" title="Flavour" hint="The sponge inside.">
        <SinglePicker label="Cake flavour" options={CAKE_FLAVOURS} value={flavour} onChange={setFlavour} />
      </Step>

      <Step n="04" title="Filling" hint="A surprise layer in the middle.">
        <SinglePicker label="Cake filling" options={CAKE_FILLINGS} value={filling} onChange={setFilling} />
      </Step>

      <Step n="05" title="Frosting" hint="The coat it wears.">
        <SinglePicker label="Cake frosting" options={CAKE_FROSTINGS} value={frosting} onChange={setFrosting} />
      </Step>

      <Step n="06" title="Toppings" hint="Pick as many as you like.">
        <MultiPicker label="Cake toppings" options={CAKE_TOPPINGS} values={toppings} onToggle={toggleTopping} />
      </Step>

      <Step n="07" title="Inscription" hint="Up to 20 characters, piped on the front.">
        <label htmlFor="inscription" className="sr-only">Cake inscription</label>
        <input
          id="inscription"
          type="text"
          value={inscription}
          maxLength={20}
          onChange={(e) => setInscription(e.target.value)}
          placeholder='e.g. Happy Birthday Ada!'
          className="min-h-[52px] w-full rounded-2xl border-2 border-choco/15 bg-cream px-4 font-bold placeholder:font-medium placeholder:text-choco/70 focus:border-ember-deep"
        />
        {inscription.trim() && (
          <button
            type="button"
            onClick={() => setGold((g) => !g)}
            aria-pressed={gold}
            className={`mt-2 min-h-[48px] rounded-full border-2 px-5 text-sm font-bold transition active:scale-95 ${
              gold ? "border-honey bg-butter" : "border-choco/15 bg-cream hover:border-choco/40"
            }`}
          >
            {gold ? "✓ " : ""}Gold lettering (+₦1,200)
          </button>
        )}
      </Step>

      <Step n="08" title="Review" hint="Your creation, in words.">
        <ul className="space-y-1.5 text-sm font-semibold">
          {[
            `Shape: ${shape}`,
            `Size: ${size}`,
            `Flavour: ${flavour}`,
            `Filling: ${filling}`,
            `Frosting: ${frosting}`,
            toppings.length > 0 ? `Toppings: ${toppings.join(", ")}` : "Toppings: none",
            inscription.trim() ? `Inscription: “${inscription.trim()}”${gold ? " in gold" : ""}` : "Inscription: none",
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
function CakeBuilderInner() {
  const { hydrated } = useCart();
  if (!hydrated) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
        <p className="font-display text-2xl font-black">Loading your cake…</p>
      </div>
    );
  }
  return <CakeBuilderForm />;
}

export default function BuildCakePage() {
  return (
    <Suspense>
      <CakeBuilderInner />
    </Suspense>
  );
}
