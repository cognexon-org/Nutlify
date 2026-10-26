"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NutlifyLogo } from "@/components/Logo";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      router.replace("/admin");
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Login failed.");
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-[100svh] place-items-center px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-line bg-surface/60 p-8">
        <NutlifyLogo className="h-9 w-auto" />
        <h1 className="mt-6 font-serif text-3xl text-ink">Admin sign in</h1>
        <label className="mt-6 flex flex-col gap-1.5">
          <span className="text-sm text-muted">Email</span>
          <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required className="rounded-lg border border-line bg-bg px-4 py-3 text-ink outline-none focus:border-gold" />
        </label>
        <label className="mt-4 flex flex-col gap-1.5">
          <span className="text-sm text-muted">Password</span>
          <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required className="rounded-lg border border-line bg-bg px-4 py-3 text-ink outline-none focus:border-gold" />
        </label>
        {error && <p role="alert" className="mt-4 text-sm text-[#B4532A] dark:text-[#E8A27C]">{error}</p>}
        <button type="submit" disabled={busy} className="btn-primary mt-6 w-full disabled:opacity-60">
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
