"use client";

import { useState } from "react";
import { useCustomer } from "./CustomerProvider";

function GoogleLogo() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

const MESSAGES = {
  "auth/popup-closed-by-user": "",
  "auth/cancelled-popup-request": "",
  "auth/popup-blocked": "Your browser blocked the sign-in window. Allow pop-ups for this site and try again.",
  "auth/unauthorized-domain": "This website’s address isn’t authorised in Firebase yet (Authentication > Settings > Authorized domains).",
  "auth/network-request-failed": "Network problem. Check your connection and try again.",
};

/**
 * "Continue with Google". Firebase handles the Google account and creates the Firebase user;
 * then our server verifies the token and creates or updates the customer in MongoDB.
 */
export default function GoogleButton({ onSignedIn, className = "", label = "Continue with Google" }) {
  const { refresh } = useCustomer();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function go() {
    setError("");
    setBusy(true);
    try {
      const { firebaseAuth, googleProvider, firebaseConfigured } = await import("@/lib/firebase-client");
      if (!firebaseConfigured) throw Object.assign(new Error("Google sign-in isn’t set up yet."), { code: "not-configured" });
      const { signInWithPopup } = await import("firebase/auth");
      const result = await signInWithPopup(firebaseAuth(), googleProvider());
      const idToken = await result.user.getIdToken();
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Sign-in failed.");
      await refresh();
      onSignedIn?.(d.customer);
    } catch (err) {
      const msg = err?.code in MESSAGES ? MESSAGES[err.code] : err?.message || "Sign-in failed. Please try again.";
      setError(msg);
    }
    setBusy(false);
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={go}
        disabled={busy}
        className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-line bg-white px-6 py-3 text-[0.95rem] font-medium text-[#1f1f1f] shadow-sm transition-colors hover:bg-[#f7f7f7] disabled:opacity-60"
      >
        <GoogleLogo />
        {busy ? "Signing in…" : label}
      </button>
      {error && (
        <p role="alert" className="mt-3 text-sm text-[#B4532A] dark:text-[#E8A27C]">
          {error}
        </p>
      )}
    </div>
  );
}
