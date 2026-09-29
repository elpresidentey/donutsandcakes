import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/store/cart";
import SiteHeader from "@/components/SiteHeader";
import MobileNav from "@/components/MobileNav";
import SiteFooter from "@/components/SiteFooter";
import PwaRegister from "@/components/PwaRegister";

/* Self-hosted at build time — no runtime call to fonts.googleapis.com, so type
   renders identically on a cold cache, a slow connection or offline.

   Both faces are requested as variable fonts (weight omitted) rather than as a
   fixed weight list: the app leans on 900 for display type but also sets 800
   via --text-label, and a variable axis serves every step without synthesised
   faux-bold. `latin-ext` is included because Yoruba and Igbo names use
   characters outside basic latin (ẹ ọ ṣ ị ụ); the browser only fetches that
   subset when such a glyph actually appears. */
const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Donuts & Cakes — Build Your Dessert | Lagos",
    template: "%s · Donuts & Cakes",
  },
  description:
    "A premium Nigerian dessert studio. Build your own cakes, donut boxes and smoothies — or shop ready-made treats, natural juices and more. Lagos, Nigeria.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Donuts & Cakes",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#c2410c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-NG"
      className={`${fraunces.variable} ${instrumentSans.variable}`}
    >
      <body className="antialiased">
        <CartProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-choco focus:px-5 focus:py-3 focus:font-bold focus:text-cream"
          >
            Skip to main content
          </a>
          <SiteHeader />
          {/* tabIndex={-1} makes <main> programmatically focusable. Without it the
              skip link scrolls the page but leaves focus parked on <body>, so the
              next Tab press jumps back into the header instead of into the content
              the user just skipped to. */}
          <main id="main" tabIndex={-1} className="min-h-[70vh] pb-24 outline-none md:pb-0">
            {children}
          </main>
          <div className="pb-20 md:pb-0">
            <SiteFooter />
          </div>
          <MobileNav />
          <PwaRegister />
        </CartProvider>
      </body>
    </html>
  );
}
