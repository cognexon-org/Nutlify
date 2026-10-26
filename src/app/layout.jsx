// Fonts are bundled with the site (no request to Google at runtime).
import "@fontsource/crimson-pro/400.css";
import "@fontsource/crimson-pro/500.css";
import "@fontsource/crimson-pro/600.css";
import "@fontsource/crimson-pro/400-italic.css";
import "@fontsource/jost/400.css";
import "@fontsource/jost/500.css";
import "@fontsource/jost/600.css";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import CartDrawer from "@/components/cart/CartDrawer";
import { CustomerProvider } from "@/components/auth/CustomerProvider";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "NUVANA by Nutlify | Dry Fruit & Seed Mix, Fruit & Berries Mix", template: "%s | Nutlify" },
  description:
    "NUVANA by Nutlify: a Dry Fruit & Seed Mix and a Fruit & Berries Mix, in pouches, boxes and Diwali gift packs. Nourish Naturally. Thrive Daily.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: "Nutlify",
    title: "NUVANA by Nutlify | Dry Fruit & Seed Mix, Fruit & Berries Mix",
    description: "A Dry Fruit & Seed Mix and a Fruit & Berries Mix for everyday enjoyment. Nourish Naturally. Thrive Daily.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FCF0DC",
};

// Applies the saved or system theme before first paint, so there's no flash.
const themeScript = `(function(){try{var s=localStorage.getItem("nutlify-theme");var d=s?s==="forest":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark")}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <MotionConfig reducedMotion="user">
          <CustomerProvider>
            <CartProvider>
              {children}
              <CartDrawer />
            </CartProvider>
          </CustomerProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
