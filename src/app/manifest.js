import { seo } from "@/config/seo";

export default function manifest() {
  return {
    name: `${seo.product} by ${seo.brand}`,
    short_name: seo.brand,
    description: seo.description,
    start_url: "/",
    display: "standalone",
    background_color: "#FCF0DC",
    theme_color: "#004B39",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
