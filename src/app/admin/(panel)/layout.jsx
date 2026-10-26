import Link from "next/link";
import { LayoutDashboard, Package, ShoppingBag, Tag, Users, ExternalLink, LogOut } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { NutlifyLogo } from "@/components/Logo";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin", robots: { index: false } };

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
  { href: "/admin/customers", label: "Customers", icon: Users },
];

export default async function AdminLayout({ children }) {
  const admin = await requireAdmin();
  return (
    <div className="min-h-[100svh] lg:grid lg:grid-cols-[15rem_1fr]">
      <aside className="border-b border-line bg-surface/60 lg:min-h-[100svh] lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-4 lg:block lg:py-6">
          <Link href="/admin" className="flex items-center gap-2">
            <NutlifyLogo className="h-7 w-auto" />
            <span className="text-xs uppercase tracking-wide text-muted">Admin</span>
          </Link>
          <p className="hidden truncate pt-1 text-xs text-muted lg:block">{admin.email}</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:pb-0">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-ink hover:bg-bg">
              <Icon size={18} className="text-gold" /> {label}
            </Link>
          ))}
          <a href="/" target="_blank" className="flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-ink hover:bg-bg">
            <ExternalLink size={18} className="text-gold" /> View site
          </a>
          <form action="/api/admin/logout" method="post">
            <button className="flex w-full items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-ink hover:bg-bg">
              <LogOut size={18} className="text-gold" /> Sign out
            </button>
          </form>
        </nav>
      </aside>
      <main className="min-w-0 px-5 py-8 sm:px-8 lg:px-10">{children}</main>
    </div>
  );
}
