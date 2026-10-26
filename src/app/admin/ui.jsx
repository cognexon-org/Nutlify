import { inr } from "@/lib/pricing";

export const STATUS_STYLE = {
  pending: "bg-[#F3E3C3] text-[#7A5A1E]",
  paid: "bg-[#DCEBDD] text-[#1E5A2E]",
  packed: "bg-[#DDE6F0] text-[#234A73]",
  shipped: "bg-[#E6DDF0] text-[#4B2F73]",
  delivered: "bg-[#CFE6D6] text-[#0F4A2A]",
  cancelled: "bg-[#EEDDDD] text-[#7A2A2A]",
  failed: "bg-[#F2D9D0] text-[#8A3A1E]",
  refunded: "bg-[#E7E2DA] text-[#5A4A3A]",
};

export function StatusBadge({ status }) {
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLE[status] || ""}`}>{status}</span>;
}

export const money = inr;
export const date = (d) =>
  new Date(d).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" });

export function PageTitle({ children, actions }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <h1 className="font-serif text-4xl text-ink">{children}</h1>
      {actions}
    </div>
  );
}
