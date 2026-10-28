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
import { seo, SITE_URL } from "@/config/seo";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: seo.defaultTitle, template: seo.titleTemplate },
  description: seo.description,
  keywords: seo.keywords,
  applicationName: `${seo.product} by ${seo.brand}`,
  authors: [{ name: seo.brand, url: SITE_URL }],
  creator: seo.brand,
  publisher: seo.brand,
  category: "food",
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg", apple: "/favicon.svg" },
  openGraph: {
    type: "website",
    locale: seo.locale,
    url: "/",
    siteName: `${seo.product} by ${seo.brand}`,
    title: seo.defaultTitle,
    description: seo.description,
    images: [{ url: seo.ogImage, width: 1200, height: 630, alt: "NUVANA Premium Dry Fruit & Seed Mix by Nutlify" }],
  },
  twitter: { card: "summary_large_image", title: seo.defaultTitle, description: seo.description, images: [seo.ogImage] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  // Paste the codes from Google Search Console / Bing Webmaster Tools into these env variables.
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } : {}),
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } } : {}),
  },
  formatDetection: { telephone: false },
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
    <html lang="en-IN" suppressHydrationWarning>
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
