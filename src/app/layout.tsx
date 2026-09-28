import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/store/cart";
import SiteHeader from "@/components/SiteHeader";
import MobileNav from "@/components/MobileNav";
import SiteFooter from "@/components/SiteFooter";
import PwaRegister from "@/components/PwaRegister";

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
  themeColor: "#b04a76",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-NG">
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
