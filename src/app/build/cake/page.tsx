"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/store/cart";
import { IMAGES } from "@/lib/images";
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
import PreviewStage from "@/components/PreviewStage";
import CakePreview from "@/components/CakePreview";

interface CakeConfig {
  occasion: string;
  guests: number;
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
  occasion: "Birthday",
  guests: 14,
  shape: "round",
  size: '8"',
  flavour: "Vanilla",
  filling: "None",
  frosting: "Buttercream",
  toppings: ["Sprinkles"],
  inscription: "",
  gold: false,
};

const GUEST_OPTIONS = [
  { count: 8, label: "8–10 guests" },
  { count: 14, label: "12–16 guests" },
  { count: 22, label: "20–25 guests" },
  { count: 35, label: "30–40 guests" },
];

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
  const fromCart: CakeConfig =
    existing && existing.config
      ? { ...DEFAULTS, ...((existing.config as Partial<CakeConfig>) ?? {}) }
      : DEFAULTS;
  const shared = params.get("design");
  const initial: CakeConfig = (() => {
    if (!shared || editKey) return fromCart;
    try {
      const bytes = Uint8Array.from(atob(shared), (c) => c.charCodeAt(0));
      const parsed = JSON.parse(new TextDecoder().decode(bytes)) as Partial<CakeConfig>;
      return { ...DEFAULTS, ...parsed, toppings: Array.isArray(parsed.toppings) ? parsed.toppings : DEFAULTS.toppings };
    } catch {
      return fromCart;
    }
  })();

  const [occasion, setOccasion] = useState(initial.occasion);
  const [guests, setGuests] = useState(initial.guests);
  const [shape, setShape] = useState(initial.shape);
  const [size, setSize] = useState(initial.size);
  const [flavour, setFlavour] = useState(initial.flavour);
  const [filling, setFilling] = useState(initial.filling);
  const [frosting, setFrosting] = useState(initial.frosting);
  const [toppings, setToppings] = useState<string[]>(initial.toppings);
  const [inscription, setInscription] = useState(initial.inscription);
  const [gold, setGold] = useState(initial.gold);
  const [shareMessage, setShareMessage] = useState("");

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
  const fillingSwatch: string = {
    "Chocolate ganache": "#4a2a1a",
    "Strawberry jam": "#d83a52",
    Caramel: "#c07a1e",
    "Cream cheese": "#fdf3e0",
    "Lemon curd": "#f0cf4a",
  }[filling] ?? "#f7f2e8";

  const summary = `${occasion} cake for about ${guests} guests · ${shape} ${flavour}, ${size}, ${frosting.toLowerCase()} frosting`;

  const chooseGuests = (count: number) => {
    setGuests(count);
    setSize(count <= 10 ? '6"' : count <= 16 ? '8"' : count <= 25 ? '10"' : '12"');
  };

  const shareDesign = async () => {
    const config: CakeConfig = { occasion, guests, shape, size, flavour, filling, frosting, toppings, inscription, gold };
    const bytes = new TextEncoder().encode(JSON.stringify(config));
    const token = btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(""));
    const url = new URL("/build/cake", window.location.origin);
    url.searchParams.set("design", token);
    const nativeShare = (navigator as unknown as { share?: (data: ShareData) => Promise<void> }).share;
    try {
      if (nativeShare) await nativeShare.call(navigator, { title: "My cake design", url: url.toString() });
      else await navigator.clipboard.writeText(url.toString());
      setShareMessage(nativeShare ? "Design ready to share." : "Design link copied.");
    } catch {
      setShareMessage("Sharing was cancelled.");
    }
  };

  const choosePreset = (preset: "celebration" | "garden" | "chocolate") => {
    if (preset === "celebration") {
      setShape("round"); setFlavour("Vanilla"); setFilling("Strawberry jam"); setFrosting("Buttercream"); setToppings(["Sprinkles", "Cherries"]);
    } else if (preset === "garden") {
      setShape("heart"); setFlavour("Lemon"); setFilling("Lemon curd"); setFrosting("Cream cheese"); setToppings(["Fresh flowers", "Fresh berries"]);
    } else {
      setShape("round"); setFlavour("Chocolate"); setFilling("Chocolate ganache"); setFrosting("Chocolate drip"); setToppings(["Chocolate shavings", "Gold dust"]);
    }
  };

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
      `Occasion: ${occasion}`,
      `Guests: ${guests}`,
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
    const config: CakeConfig = { occasion, guests, shape, size, flavour, filling, frosting, toppings, inscription, gold };
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
      intro="Choose each detail and watch your cake take shape with live pricing."
      cover={IMAGES.heroCake}
      stepCount={9}
      preview={
        <PreviewStage
          model={{
            kind: "cake",
            shape,
            size,
            sponge,
            frosting: frostSwatch,
            filling,
            toppings,
            inscription,
            gold,
          }}
          sliceContent={
            <div className="flex items-center gap-4">
              <div aria-hidden className="w-20 shrink-0 overflow-hidden rounded-lg border border-choco/10 shadow-sm">
                <div className="h-2.5" style={{ background: frostSwatch }} />
                <div className="h-5" style={{ background: sponge }} />
                {filling !== "None" && <div className="h-1.5" style={{ background: fillingSwatch }} />}
                <div className="h-5" style={{ background: sponge }} />
                <div className="h-2.5" style={{ background: frostSwatch }} />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-ember">Slice view</p>
                <p className="mt-1 text-sm font-bold">{flavour} sponge{filling !== "None" ? ` · ${filling}` : " · no filling"}</p>
              </div>
            </div>
          }
        >
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
        </PreviewStage>
      }
      previewLabel={summary}
      total={total}
      cta={editKey ? "Update cart" : "Add to cart"}
      onAdd={handleAdd}
    >
      <section className="mb-6 rounded-2xl bg-sand/65 p-4 sm:p-5" aria-label="Baker-picked designs">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-ember">Baker-picked starts</p><p className="mt-1 text-sm font-semibold text-choco/70">Choose a look, then make it yours.</p></div>
          <button type="button" onClick={surprise} className="min-h-10 rounded-full border border-choco/15 bg-milk px-4 text-xs font-bold text-choco transition hover:border-ember/50">Surprise me ✦</button>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[["celebration", "Party classic"], ["garden", "Garden party"], ["chocolate", "Chocolate luxe"]].map(([id, label]) => (
            <button key={id} type="button" onClick={() => choosePreset(id as "celebration" | "garden" | "chocolate")} className="min-h-11 rounded-xl border border-choco/10 bg-milk px-2 text-xs font-bold text-choco transition hover:border-ember/50 hover:text-ember-deep">{label}</button>
          ))}
        </div>
      </section>
      <Step n="01" title="The celebration" hint="Tell us what the cake is for and how many guests you’re sharing it with.">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-choco/55">Occasion</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Occasion">
          {["Birthday", "Wedding", "Graduation", "Baby shower", "Just because"].map((item) => <button key={item} type="button" aria-pressed={occasion === item} onClick={() => setOccasion(item)} className={`min-h-11 rounded-full border px-4 text-sm font-bold transition ${occasion === item ? "border-ember bg-ember text-white" : "border-choco/15 bg-cream hover:border-ember/50"}`}>{item}</button>)}
        </div>
        <p className="mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-choco/55">Guests</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Number of guests">
          {GUEST_OPTIONS.map(({ count, label }) => <button key={count} type="button" aria-pressed={guests === count} onClick={() => chooseGuests(count)} className={`min-h-12 rounded-xl border px-2 text-sm font-bold transition ${guests === count ? "border-ember bg-ember/8 ring-1 ring-ember/25" : "border-choco/12 bg-cream/60 hover:border-choco/35"}`}>{label}</button>)}
        </div>
        <p className="mt-3 text-sm font-semibold text-ember-deep">Suggested size: {size}, serves about {guests <= 10 ? "8–10" : guests <= 16 ? "12–16" : guests <= 25 ? "20–25" : "30–40"}.</p>
      </Step>
      <Step n="02" title="Shape" hint="The silhouette of your showpiece.">
        <SinglePicker label="Cake shape" options={CAKE_SHAPES} value={shape} onChange={setShape} />
      </Step>

      <Step n="03" title="Size" hint="Bigger party? Bigger cake.">
        <SinglePicker label="Cake size" options={CAKE_SIZES} value={size} onChange={setSize} />
      </Step>

      <Step n="04" title="Flavour" hint="The sponge inside.">
        <SinglePicker label="Cake flavour" options={CAKE_FLAVOURS} value={flavour} onChange={setFlavour} />
      </Step>

      <Step n="05" title="Filling" hint="A surprise layer in the middle.">
        <SinglePicker label="Cake filling" options={CAKE_FILLINGS} value={filling} onChange={setFilling} />
      </Step>

      <Step n="06" title="Frosting" hint="The coat it wears.">
        <SinglePicker label="Cake frosting" options={CAKE_FROSTINGS} value={frosting} onChange={setFrosting} />
      </Step>

      <Step n="07" title="Toppings" hint="Pick as many as you like.">
        <MultiPicker label="Cake toppings" options={CAKE_TOPPINGS} values={toppings} onToggle={toggleTopping} />
      </Step>

      <Step n="08" title="Inscription" hint="Up to 20 characters, piped on the front.">
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
        <p className="mt-2 text-right text-xs font-semibold tabular-nums text-choco/55" aria-live="polite">
          {inscription.length}/20 characters
        </p>
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

      <Step n="09" title="Review" hint="Your creation, in words.">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-sand/70 p-4">
          <div><p className="text-xs font-bold uppercase tracking-wider text-choco/55">Made for</p><p className="mt-1 font-display text-lg font-black">{occasion} · {guests} guests</p></div>
          <button type="button" onClick={shareDesign} className="min-h-11 rounded-full border border-choco/15 bg-milk px-4 text-sm font-bold transition hover:border-ember/50">Share design ↗</button>
          {shareMessage && <p className="w-full text-xs font-semibold text-leaf" aria-live="polite">{shareMessage}</p>}
        </div>
        <ul className="space-y-1.5 text-sm font-semibold">
          {[
            `Occasion: ${occasion}`,
            `Guests: ${guests}`,
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
        <div className="mt-5 rounded-xl border border-choco/10 p-4">
          <p className="font-bold">Made to match your design</p>
          <p className="mt-1 text-sm leading-relaxed text-choco/65">Your order summary includes the size, layers, finish, toppings and inscription you’ve chosen.</p>
        </div>
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
