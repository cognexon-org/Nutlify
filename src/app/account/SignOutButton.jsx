"use client";

import { useRouter } from "next/navigation";
import { useCustomer } from "@/components/auth/CustomerProvider";

export default function SignOutButton() {
  const router = useRouter();
  const { signOut } = useCustomer();
  return (
    <button
      type="button"
      onClick={async () => {
        await signOut();
        router.replace("/");
        router.refresh();
      }}
      className="btn-ghost"
    >
      Sign out
    </button>
  );
}
