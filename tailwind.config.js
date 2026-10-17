/** @type {import('tailwindcss').Config} */
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Theme-aware tokens (see src/index.css for values)
        bg: v("bg"),
        surface: v("surface"),
        ink: v("ink"),
        muted: v("muted"),
        brand: v("brand"),
        "on-brand": v("on-brand"),
        gold: v("gold"),
        line: v("line"),
        band: v("band"),
        // Fixed brand colours
        forest: { DEFAULT: "#004B39", deep: "#0F3327" },
        cream: "#FCF0DC",
        walnut: "#5A2A12",
      },
      fontFamily: {
        serif: ['"Crimson Pro"', "Georgia", "Cambria", '"Times New Roman"', "serif"],
        sans: ['"Jost"', "system-ui", "-apple-system", '"Segoe UI"', "Roboto", "sans-serif"],
      },
      maxWidth: { prose: "34rem" },
    },
  },
  plugins: [],
};
