"use client";

import { NutlifyLogo, NuvanaLogo } from "./Logo";
import Ornament from "./Ornament";
import VegMark from "./VegMark";
import { site, whatsappDisplay } from "@/config/site";

const policyLinks = [
  { href: "/policies/shipping", label: "Shipping & delivery" },
  { href: "/policies/refunds", label: "Cancellations & refunds" },
  { href: "/policies/terms", label: "Terms & conditions" },
  { href: "/policies/privacy", label: "Privacy policy" },
  { href: "/policies/contact", label: "Contact us" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-band text-cream" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      <div className="container-x flex flex-col items-center py-20 text-center">
        <NutlifyLogo onDark className="h-12 w-auto" />
        <p className="mt-3 font-serif text-xl text-cream/90">{site.tagline}</p>
        <div className="my-8">
          <Ornament className="w-48 !text-[#DEB870]" hole="rgb(var(--band))" />
        </div>
        <NuvanaLogo onDark className="h-auto w-56" />
        <p className="mt-3 font-sans text-sm font-medium uppercase tracking-[0.08em] text-[#DEB870]">{site.descriptor}</p>
        <a href="/#packs" className="btn mt-10 bg-[#DEB870] text-[#0F3327] hover:bg-[#E8C886]">
          Shop NUVANA
        </a>
      </div>

      <div className="border-t border-cream/15">
        <div className="container-x grid gap-8 py-10 text-sm text-cream/70 sm:grid-cols-3">
          <div>
            <p className="text-cream">Contact</p>
            <p className="mt-2">
              <a href={`mailto:${site.email}`} className="hover:text-cream">{site.email}</a>
            </p>
            {site.whatsapp && (
              <p>
                <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-cream">
                  WhatsApp {whatsappDisplay()}
                </a>
              </p>
            )}
            <p>{site.location}</p>
          </div>
          <nav aria-label="Policies">
            <p className="text-cream">Policies</p>
            <ul className="mt-2 space-y-1">
              {policyLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-cream">{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="sm:text-right">
            <p>© {year} Nutlify. NUVANA is a product of Nutlify.</p>
            {site.fssai && <p className="mt-1">FSSAI Lic. No. {site.fssai}</p>}
            {site.instagram && (
              <p className="mt-1">
                <a href={site.instagram} target="_blank" rel="noreferrer" className="hover:text-cream">Instagram</a>
              </p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
