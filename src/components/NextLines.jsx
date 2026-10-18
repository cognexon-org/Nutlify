import { NuvanaLogo } from "./Logo";
import { contactLink } from "../config/site";

/*
 * Future concepts from the portfolio board, described by occasion only.
 * Descriptions stay neutral (no nutrient or benefit claims) until recipes and labels are final.
 */
const lines = [
  { name: "DAILY", body: "An everyday blend, planned in single-serve and family sizes.", color: "#5E8F3A" },
  { name: "ACTIVE", body: "A portable single-serve snack for gym days and active routines.", color: "#C9632B" },
  { name: "FOCUS", body: "A nut-and-seed blend for long work and study days.", color: "#2F5E9E" },
  { name: "BALANCE", body: "A rounded mix of nuts and seeds for any time of day.", color: "#6B4A98" },
  { name: "IRON+", body: "A nut, seed and dried-fruit blend, planned with dates and figs.", color: "#A8323A" },
];

export default function NextLines() {
  return (
    <section id="next" className="section">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h2 className="text-4xl text-ink sm:text-5xl">What we’re working on next</h2>
            <p className="mt-5 max-w-prose text-muted">
              NUVANA is the first of a family. These blends are still in the kitchen, and we’ll only launch them once
              the recipes are right. Single-serve sachets, larger family packs and festive gift boxes are on the list too.
            </p>
          </div>
          <a
            href={contactLink("Hi Nutlify, please let me know when new NUVANA blends launch.")}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost shrink-0 self-start md:self-auto"
          >
            Tell me when they launch
          </a>
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {lines.map((l) => (
            <li key={l.name} className="relative flex flex-col overflow-hidden rounded-2xl border border-line bg-bg p-6 pt-8">
              <span className="absolute inset-x-0 top-0 h-1.5" style={{ background: l.color }} />
              <NuvanaLogo className="h-6 w-32 justify-center items-center mx-auto" />
              <p className="mt-4 font-sans text-3xl font-semibold tracking-wide dark:brightness-[1.7]" style={{ color: l.color }}>
                {l.name}
              </p>
              <p className="mt-3 text-[0.98rem] text-muted">{l.body}</p>
              <p className="mt-auto pt-6"><span className="inline-flex rounded-full border border-line px-3 py-1 text-xs text-muted">In development</span></p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
