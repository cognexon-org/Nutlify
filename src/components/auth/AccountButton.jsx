"use client";

import Link from "next/link";
import { UserRound } from "lucide-react";
import { useCustomer } from "./CustomerProvider";

export default function AccountButton() {
  const { customer, loading } = useCustomer();
  const label = customer ? `Your account (${customer.name || customer.email})` : "Sign in";
  return (
    <Link href={customer ? "/account" : "/login"} className="rounded-full p-1.5 text-ink transition-colors hover:text-gold" aria-label={label} title={label}>
      {!loading && customer?.photoUrl ? (
        <img src={customer.photoUrl} alt="" referrerPolicy="no-referrer" className="h-7 w-7 rounded-full" />
      ) : (
        <UserRound size={22} />
      )}
    </Link>
  );
}
