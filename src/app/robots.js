import { abs, SITE_URL } from "@/config/seo";

export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/checkout", "/account", "/order/", "/login"] }],
    sitemap: abs("/sitemap.xml"),
    host: SITE_URL,
  };
}
