import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NutlifyLogo } from "./Logo";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "#inside", label: "What’s inside" },
  { href: "#packs", label: "Packs" },
  { href: "#gifting", label: "Gifting" },
  { href: "#made", label: "How it’s made" },
  { href: "#next", label: "Coming next" },
  { href: "#faq", label: "FAQ" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open ? "border-b border-line/70 bg-bg/85 backdrop-blur-md" : "border-b border-transparent"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="header-pad mx-auto flex h-16 w-full max-w-6xl items-center justify-between sm:h-20">
        <a href="#top" className="shrink-0" aria-label="Nutlify home">
          <NutlifyLogo className="h-8 w-auto sm:h-9" />
        </a>

        <nav className="hidden items-center gap-7 xl:flex" aria-label="Main">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-[0.95rem] text-muted transition-colors hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a href="#packs" className="btn-primary hidden !px-5 !py-2.5 sm:inline-flex">
            Shop NUVANA
          </a>
          <button
            type="button"
            className="rounded-full p-2 text-ink xl:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden xl:hidden"
          >
            <ul className="header-pad mx-auto flex max-w-6xl flex-col pb-6 pt-2">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-line/60 py-4 font-serif text-2xl text-ink"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li className="pt-6">
                <a href="#packs" onClick={() => setOpen(false)} className="btn-primary w-full">
                  Shop NUVANA
                </a>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
