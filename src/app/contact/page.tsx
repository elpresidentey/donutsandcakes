import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT, whatsappLink } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Message us on WhatsApp, call, or email. Hours, delivery area and lead times for Donuts & Cakes, Nigeria.",
};

const CHANNELS = [
  {
    icon: "💬",
    label: "WhatsApp",
    value: CONTACT.phoneDisplay,
    note: "Fastest — send a cake idea, get a quote",
    href: whatsappLink("Hi Donuts & Cakes! I'd like to place an order 🍰"),
    external: true,
    accent: "bg-mint/60",
  },
  {
    icon: "📞",
    label: "Call us",
    value: CONTACT.phoneDisplay,
    note: "Tue–Sun, 9am–8pm",
    href: `tel:${CONTACT.phoneTel}`,
    external: false,
    accent: "bg-butter/50",
  },
  {
    icon: "✉️",
    label: "Email",
    value: CONTACT.email,
    note: "Orders, invoices & big events",
    href: `mailto:${CONTACT.email}`,
    external: false,
    accent: "bg-sand",
  },
  {
    icon: "📸",
    label: "Instagram",
    value: CONTACT.instagramHandle,
    note: "Fresh bakes, daily",
    href: CONTACT.instagramUrl,
    external: true,
    accent: "bg-ember/10",
  },
];

const FAQ = [
  {
    q: "How far ahead should I order?",
    a: CONTACT.leadNote,
  },
  {
    q: "Do you deliver?",
    a: CONTACT.deliveryNote,
  },
  {
    q: "Can I pay on delivery?",
    a: "Yes. We confirm every order by phone first and settle payment then — nothing is charged when you order online.",
  },
  {
    q: "Can you match a design I saw online?",
    a: "Almost always. Send us the picture on WhatsApp and we'll tell you honestly what we can do, and the price, before you commit.",
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-cocoa" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-20 sm:px-6 sm:pt-24">
          <p className="text-label uppercase text-honey">We&apos;re easy to reach</p>
          <h1 className="mt-2 font-display text-display text-cream">
            Say hello
          </h1>
          <p className="mt-3 max-w-xl font-medium text-cream/85">
            Questions, custom designs, a big order for an office or a wedding —
            WhatsApp is quickest, but pick whichever way suits you. A real person
            in our kitchen reads every message.
          </p>
          <a
            href={whatsappLink("Hi Donuts & Cakes! I have a question 🍩")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex min-h-[52px] items-center gap-2 rounded-full bg-ember px-8 py-3 font-display text-lg font-black text-white transition hover:bg-ember-deep active:scale-95"
          >
            <span aria-hidden>💬</span> Message us on WhatsApp
          </a>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {/* Channels */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CHANNELS.map((c) => {
            const inner = (
              <>
                <span
                  aria-hidden
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${c.accent}`}
                >
                  {c.icon}
                </span>
                <p className="mt-3 text-label uppercase text-choco/60">{c.label}</p>
                <p className="mt-1 font-display text-lg font-black break-words">
                  {c.value}
                </p>
                <p className="mt-1 text-sm font-semibold text-choco/70">{c.note}</p>
              </>
            );
            const cls =
              "group flex h-full flex-col rounded-3xl bg-milk p-5 ring-1 ring-inset ring-choco/10 transition hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(43,28,21,0.12)]";
            return c.external ? (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cls}
              >
                {inner}
              </a>
            ) : (
              <a key={c.label} href={c.href} className={cls}>
                {inner}
              </a>
            );
          })}
        </div>

        {/* Hours + delivery */}
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl bg-milk p-6 ring-1 ring-inset ring-choco/10">
            <h2 className="font-display text-heading">Opening hours</h2>
            <p className="mt-1 text-sm font-semibold text-choco/70">
              Baking fresh every day we&apos;re open.
            </p>
            <dl className="mt-4 divide-y divide-choco/10">
              {CONTACT.hours.map((h) => (
                <div
                  key={h.days}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <dt className="font-bold">{h.days}</dt>
                  <dd className="text-right font-semibold text-choco/75">
                    {h.time}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-sand px-4 py-2 text-xs font-bold text-choco/80">
              <span aria-hidden>📍</span> {CONTACT.area}
            </p>
          </div>

          <div className="rounded-3xl bg-cocoa p-6 text-cream ring-1 ring-inset ring-cream/10">
            <h2 className="font-display text-heading">Delivery &amp; pickup</h2>
            <p className="mt-3 text-sm leading-relaxed text-cream/80">
              {CONTACT.deliveryNote}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-cream/80">
              Prefer to collect? Choose pickup at checkout and we&apos;ll have it
              boxed and ready — you&apos;ll get a call the moment it&apos;s out of
              the oven.
            </p>
            <Link
              href="/shop"
              className="mt-5 inline-flex min-h-[48px] items-center rounded-full bg-cream px-7 py-2.5 font-display font-black text-cocoa transition hover:bg-white active:scale-95"
            >
              Browse the menu →
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <section className="mt-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="font-display text-heading">
            Good to know
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {FAQ.map((f) => (
              <div
                key={f.q}
                className="rounded-3xl border-2 border-choco/10 bg-milk p-5"
              >
                <h3 className="font-display text-lg font-black">{f.q}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-choco/75">
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
