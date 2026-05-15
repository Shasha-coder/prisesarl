"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Trust — the "Pourquoi PRISE" strip.
 *
 * Animated counters on top, eight short reasons below. Deliberately dense
 * and editorial-looking — not a feature grid, more like an introductory
 * tear-sheet from an engineering office.
 */

const COUNTERS = [
  { num: 12,  suffix: "+", label: "années d'expertise" },
  { num: 120, suffix: "+", label: "projets livrés" },
  { num: 11,  suffix: "",  label: "provinces couvertes" },
  { num: 9,   suffix: "/10", label: "clients récurrents" },
];

const REASONS = [
  { n: "01", h: "Authenticité",        b: "Pas de revendeurs. Nous livrons ce que nous avons signé." },
  { n: "02", h: "Flexibilité",         b: "Du chantier rural à l'industriel — nos process s'adaptent." },
  { n: "03", h: "Compréhension",       b: "Nos ingénieurs viennent du terrain congolais, pas d'un Excel." },
  { n: "04", h: "Expertise locale",    b: "Réseau de fournisseurs, transporteurs, opérateurs locaux." },
  { n: "05", h: "Approche qualité",    b: "Méthode ISO, PV de réception, traçabilité matériaux." },
  { n: "06", h: "Solutions modernes",  b: "Solaire hybride, fibre, calcul de structure 3D." },
  { n: "07", h: "Respect des délais",  b: "Le planning Gantt est contractuel, pas décoratif." },
  { n: "08", h: "Accompagnement",      b: "Formation des opérateurs, SLA, maintenance évolutive." },
];

export function Trust() {
  const sectionRef = useRef<HTMLElement>(null);
  const counterRefs = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      counterRefs.current.forEach((el, i) => {
        if (!el) return;
        const target = COUNTERS[i].num;
        const proxy = { v: 0 };
        gsap.to(proxy, {
          v: target,
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
          onUpdate: () => {
            el.textContent = Math.round(proxy.v).toString();
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="pourquoi" className="relative py-[120px] bg-surface overflow-hidden">
      <div className="absolute inset-0 bg-blueprint-sm opacity-30 pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-5 sm:px-7 relative z-10">

        {/* Counter strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 pb-12 border-b border-ink/10 mb-14">
          {COUNTERS.map((c, i) => (
            <div key={c.label} className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span
                  ref={(el) => { if (el) counterRefs.current[i] = el; }}
                  className="font-serif font-semibold text-[clamp(40px,6vw,72px)] leading-none text-ink tabular-nums"
                >
                  0
                </span>
                <span className="font-serif text-[clamp(22px,3vw,36px)] text-hot leading-none">
                  {c.suffix}
                </span>
              </div>
              <span className="text-[11px] tracking-[0.22em] uppercase text-mute mt-3 font-semibold">
                {c.label}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-10 md:gap-16">
          <div>
            <div className="inline-flex items-center gap-2.5 text-[11px] font-bold tracking-[0.32em] uppercase text-hot mb-4">
              <span className="inline-grid place-items-center w-6 h-6 rounded-full bg-hot text-white text-[10px] tracking-normal">05</span>
              Pourquoi PRISE
            </div>
            <h2 className="font-serif font-semibold text-[clamp(30px,4vw,48px)] leading-[1.05] tracking-[-0.02em] text-ink">
              Huit raisons, <br />
              <em className="italic text-ink-2">aucun argumentaire creux.</em>
            </h2>
            <p className="text-[15px] text-ink-2 mt-5 max-w-[400px] leading-[1.65]">
              Une entreprise d&apos;ingénierie se juge sur ce qui tient après la livraison. Voici ce
              qui nous distingue, signé en bas de chaque PV.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
            {REASONS.map((r) => (
              <div key={r.n} className="py-4 border-b border-ink/10">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="font-mono text-[10.5px] tracking-[0.18em] text-rust">{r.n}</span>
                  <h3 className="font-serif font-semibold text-[19px] text-ink leading-tight">{r.h}</h3>
                </div>
                <p className="text-[14px] text-ink-2 leading-[1.55] pl-8">{r.b}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
