"use client";

import { NutlifyLogo } from "./Logo";
import ThemeToggle from "./ThemeToggle";
import CartButton from "./cart/CartButton";
import AccountButton from "./auth/AccountButton";

/** Compact header for checkout, order and policy pages. */
export default function SimpleHeader({ showCart = true }) {
  return (
    <header className="border-b border-line/70" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
      <div className="container-x flex h-16 items-center justify-between sm:h-20">
        <a href="/" aria-label="Nutlify home">
          <NutlifyLogo className="h-8 w-auto sm:h-9" />
        </a>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <AccountButton />
          {showCart && <CartButton />}
        </div>
      </div>
    </header>
  );
}
