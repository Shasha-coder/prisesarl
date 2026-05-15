"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useT } from "@/i18n/I18nProvider";

/**
 * Methodology — six-stage process flow.
 *
 * A vertical "blueprint spine" connects six steps. As the user scrolls,
 * the spine path traces itself and each stage card fades + slides in.
 */

const STAGES = [
  {
    n: "01",
    title: "Étudier",
    sub: "Diagnostic & relevé",
    body: "Visite de site, relevés topographiques, audit technique. Avant toute estimation, nous mesurons.",
    icon: (
      <g>
        <circle cx="22" cy="22" r="14" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <line x1="22" y1="8" x2="22" y2="36" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" />
        <line x1="8" y1="22" x2="36" y2="22" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" />
        <path d="M 22 22 L 30 14" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="22" cy="22" r="2" fill="currentColor" />
      </g>
    ),
  },
  {
    n: "02",
    title: "Concevoir",
    sub: "Plans & dimensionnement",
    body: "Dessins d'exécution, calculs de structure, choix matériaux. Un plan signé, daté, défendable.",
    icon: (
      <g>
        <path d="M 8 32 L 8 14 L 28 14 L 36 22 L 36 32 Z" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <line x1="28" y1="14" x2="28" y2="22" stroke="currentColor" strokeWidth="1.1" />
        <line x1="28" y1="22" x2="36" y2="22" stroke="currentColor" strokeWidth="1.1" />
        <line x1="13" y1="20" x2="23" y2="20" stroke="currentColor" strokeWidth="0.7" />
        <line x1="13" y1="24" x2="23" y2="24" stroke="currentColor" strokeWidth="0.7" />
        <line x1="13" y1="28" x2="20" y2="28" stroke="currentColor" strokeWidth="0.7" />
      </g>
    ),
  },
  {
    n: "03",
    title: "Bâtir",
    sub: "Exécution chantier",
    body: "Gros œuvre, second œuvre, télécoms et électricité avec nos propres équipes. Pas de sous-traitance déguisée.",
    icon: (
      <g>
        <path d="M 8 36 L 22 14 L 36 36 Z" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <line x1="14" y1="36" x2="14" y2="28" stroke="currentColor" strokeWidth="0.9" />
        <line x1="14" y1="28" x2="20" y2="28" stroke="currentColor" strokeWidth="0.9" />
        <line x1="30" y1="36" x2="30" y2="30" stroke="currentColor" strokeWidth="0.9" />
        <line x1="24" y1="30" x2="30" y2="30" stroke="currentColor" strokeWidth="0.9" />
      </g>
    ),
  },
  {
    n: "04",
    title: "Connecter",
    sub: "Télécoms & énergie",
    body: "Pylônes, fibre, MT/BT, panneaux solaires. Mise en service, raccordements, tests de charge.",
    icon: (
      <g>
        <line x1="22" y1="8" x2="22" y2="36" stroke="currentColor" strokeWidth="1.4" />
        <line x1="16" y1="14" x2="28" y2="14" stroke="currentColor" strokeWidth="1.1" />
        <line x1="12" y1="22" x2="32" y2="22" stroke="currentColor" strokeWidth="1.1" />
        <circle cx="22" cy="9" r="1.6" fill="currentColor" />
        <path d="M 28 14 Q 36 18 36 30" fill="none" stroke="currentColor" strokeWidth="0.7" strokeDasharray="2 2" />
        <path d="M 16 14 Q 8 18 8 30" fill="none" stroke="currentColor" strokeWidth="0.7" strokeDasharray="2 2" />
      </g>
    ),
  },
  {
    n: "05",
    title: "Livrer",
    sub: "Logistique & PV",
    body: "Convois lourds, approvisionnement chantier, PV de réception. Vous récupérez les clefs sans rappels.",
    icon: (
      <g>
        <rect x="6" y="20" width="20" height="12" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <path d="M 26 22 L 32 22 L 36 28 L 36 32 L 26 32" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="13" cy="34" r="3" fill="none" stroke="currentColor" strokeWidth="1.1" />
        <circle cx="31" cy="34" r="3" fill="none" stroke="currentColor" strokeWidth="1.1" />
      </g>
    ),
  },
  {
    n: "06",
    title: "Former",
    sub: "Transfert & maintenance",
    body: "Formation des opérateurs locaux, manuels de maintenance, SLA et certificats. La compétence reste sur place.",
    icon: (
      <g>
        <path d="M 8 18 L 22 12 L 36 18 L 22 24 Z" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <line x1="22" y1="24" x2="22" y2="34" stroke="currentColor" strokeWidth="1.1" />
        <line x1="14" y1="22" x2="14" y2="30" stroke="currentColor" strokeWidth="0.8" />
        <line x1="30" y1="22" x2="30" y2="30" stroke="currentColor" strokeWidth="0.8" />
      </g>
    ),
  },
];

export function Methodology() {
  const t = useT();
  const sectionRef = useRef<HTMLElement>(null);
  const spineRef = useRef<SVGPathElement>(null);
  const stagesRef = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const spine = spineRef.current;
      if (spine) {
        const len = spine.getTotalLength();
        spine.style.strokeDasharray = String(len);
        spine.style.strokeDashoffset = String(len);

        gsap.to(spine, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "bottom 30%",
            scrub: 0.6,
          },
        });
      }

      stagesRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, x: i % 2 === 0 ? -28 : 28, y: 10 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="methode"
      className="relative py-[140px] bg-paper bg-paper-grain overflow-hidden"
    >
      <div className="absolute inset-0 bg-blueprint mask-fade-b opacity-60 pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-5 sm:px-7 relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-6 md:gap-[60px] items-end mb-[80px]">
          <div>
            <div className="inline-flex items-center gap-2.5 text-[11px] font-bold tracking-[0.32em] uppercase text-hot mb-4">
              <span className="inline-grid place-items-center w-6 h-6 rounded-full bg-hot text-white text-[10px] tracking-normal">03</span>
              {t("method.eyebrow")}
            </div>
            <h2 className="font-serif font-semibold text-[clamp(34px,5vw,60px)] leading-[1.02] tracking-[-0.025em] text-ink">
              {t("method.title")}
            </h2>
          </div>
          <p className="text-[17px] text-ink-2 leading-[1.7] max-w-[540px] md:ml-auto md:text-right">
            {t("method.lede")}
          </p>
        </div>

        {/* Spine + stages */}
        <div className="relative">
          {/* Vertical spine (desktop only) */}
          <svg
            className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[120px] h-full pointer-events-none"
            viewBox="0 0 120 1200"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              ref={spineRef}
              d="M 60 0 C 60 80, 30 120, 60 200 S 90 320, 60 400 S 30 520, 60 600 S 90 720, 60 800 S 30 920, 60 1000 S 90 1120, 60 1200"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="text-ink"
              strokeLinecap="round"
            />
          </svg>

          <ol className="flex flex-col gap-12 md:gap-16 relative">
            {STAGES.map((stage, i) => {
              const onRight = i % 2 === 1;
              return (
                <li
                  key={stage.n}
                  ref={(el) => { stagesRef.current[i] = el; }}
                  className={`md:grid md:grid-cols-[1fr_120px_1fr] items-center will-change-transform ${onRight ? "" : ""}`}
                >
                  {/* Left column (or empty) */}
                  <div className={`md:pr-12 ${onRight ? "md:order-3 md:pl-12 md:pr-0 md:text-left" : "md:text-right"}`}>
                    <Card stage={stage} mirrored={onRight} />
                  </div>

                  {/* Node on spine */}
                  <div className="hidden md:flex items-center justify-center md:order-2">
                    <div className="relative w-14 h-14 grid place-items-center rounded-full bg-paper border-2 border-ink shadow-sm z-10">
                      <span className="font-mono text-[11px] font-bold text-ink tracking-[0.05em]">{stage.n}</span>
                      <span className="absolute -inset-1 rounded-full border border-ink/20" />
                    </div>
                  </div>

                  {/* Empty mirror column */}
                  <div className={onRight ? "md:order-1" : "md:order-3"} aria-hidden="true" />
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Card({ stage, mirrored }: { stage: (typeof STAGES)[number]; mirrored: boolean }) {
  return (
    <div className={`inline-flex flex-col gap-3 max-w-[440px] ${mirrored ? "" : "md:ml-auto"}`}>
      <div className={`flex items-center gap-3 md:gap-4 ${mirrored ? "" : "md:flex-row-reverse"}`}>
        <svg width="44" height="44" viewBox="0 0 44 44" className="text-ink shrink-0">
          {stage.icon}
        </svg>
        <span className="font-mono text-[11px] font-semibold tracking-[0.18em] uppercase text-mute">
          {stage.sub}
        </span>
      </div>
      <h3 className="font-serif font-semibold text-[34px] leading-[1.05] tracking-[-0.01em] text-ink">
        {stage.title}
      </h3>
      <p className="text-[15px] text-ink-2 leading-[1.65]">{stage.body}</p>
      <span className="md:hidden mt-1 font-mono text-[10px] tracking-[0.2em] uppercase text-rust">
        Étape {stage.n}
      </span>
    </div>
  );
}
