import { useEffect, useState } from "react";

/** Switches between the Cream and Forest themes — the two packaging themes. */
export default function ThemeToggle({ className = "" }) {
  const [forest, setForest] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", forest);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", forest ? "#0C281E" : "#FCF0DC");
  }, [forest]);

  const toggle = () => {
    const next = !forest;
    setForest(next);
    try {
      localStorage.setItem("nutlify-theme", next ? "forest" : "cream");
    } catch (e) {
      /* storage unavailable: theme still applies for this visit */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`group inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm text-muted transition-colors hover:border-gold hover:text-ink ${className}`}
      aria-label={forest ? "Switch to the cream theme" : "Switch to the forest theme"}
      title={forest ? "Cream theme" : "Forest theme"}
    >
      <span className="relative h-4 w-4 overflow-hidden rounded-full border border-gold/60">
        <span className="absolute inset-0 bg-cream" />
        <span
          className={`absolute inset-0 bg-forest-deep transition-transform duration-500 ${
            forest ? "translate-x-0" : "translate-x-1/2"
          }`}
        />
      </span>
      <span className="hidden sm:inline">{forest ? "Forest" : "Cream"}</span>
    </button>
  );
}
