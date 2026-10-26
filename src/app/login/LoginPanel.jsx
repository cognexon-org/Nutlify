"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import GoogleButton from "@/components/auth/GoogleButton";
import { useCustomer } from "@/components/auth/CustomerProvider";

export default function LoginPanel({ next }) {
  const router = useRouter();
  const { customer, loading } = useCustomer();

  useEffect(() => {
    if (!loading && customer) router.replace(next);
  }, [customer, loading, next, router]);

  return (
    <div className="w-full max-w-sm rounded-2xl border border-line bg-surface/60 p-8 text-center">
      <h1 className="font-serif text-3xl text-ink">Sign in to Nutlify</h1>
      <p className="mt-3 text-muted">See your orders and check out faster next time. New here? Continuing creates your account.</p>
      <GoogleButton className="mt-8" onSignedIn={() => router.replace(next)} />
      <p className="mt-6 text-xs text-muted">
        You can also check out as a guest without signing in. By continuing you agree to our{" "}
        <a href="/policies/terms" className="underline">terms</a> and <a href="/policies/privacy" className="underline">privacy policy</a>.
      </p>
    </div>
  );
}
