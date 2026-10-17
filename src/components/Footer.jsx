import { NutlifyLogo, NuvanaLogo } from "./Logo";
import Ornament from "./Ornament";
import { site, contactLink, contactLabel } from "../config/site";

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
        <a
          href={contactLink("Hi Nutlify, I’d like to order NUVANA.")}
          target="_blank"
          rel="noreferrer"
          className="btn mt-10 bg-[#DEB870] text-[#0F3327] hover:bg-[#E8C886]"
        >
          {contactLabel()}
        </a>
      </div>

      <div className="border-t border-cream/15">
        <div className="container-x grid gap-8 py-10 text-sm text-cream/70 sm:grid-cols-3">
          <div>
            <p className="text-cream">Contact</p>
            <p className="mt-2">
              <a href={`mailto:${site.email}`} className="hover:text-cream">{site.email}</a>
            </p>
            <p>{site.website}</p>
            <p>{site.location}</p>
          </div>
          <div>
            <p className="text-cream">Allergen information</p>
            <p className="mt-2 max-w-xs">Contains tree nuts: almonds, cashews, walnuts and pistachios.</p>
          </div>
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
