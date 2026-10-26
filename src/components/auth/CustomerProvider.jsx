"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const Ctx = createContext({ customer: null, loading: true, refresh: () => {}, signOut: async () => {} });

/** Knows whether a customer is signed in (asks the server once per page load). */
export function CustomerProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const r = await fetch("/api/auth/me", { cache: "no-store" });
      const d = await r.json();
      setCustomer(d.customer);
    } catch {
      setCustomer(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const signOut = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    try {
      const { firebaseAuth, firebaseConfigured } = await import("@/lib/firebase-client");
      if (firebaseConfigured) await (await import("firebase/auth")).signOut(firebaseAuth());
    } catch {}
    setCustomer(null);
  }, []);

  return <Ctx.Provider value={{ customer, loading, refresh, signOut }}>{children}</Ctx.Provider>;
}

export const useCustomer = () => useContext(Ctx);
