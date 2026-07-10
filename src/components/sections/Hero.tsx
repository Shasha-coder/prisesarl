"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BlueprintStage } from "@/components/sections/BlueprintStage";
import { useT } from "@/i18n/I18nProvider";

type DomainId = "civil" | "telecom" | "energy" | "logistics" | "training";

const DOMAINS: { id: DomainId; labelFR: string; labelEN: string; tag: string }[] = [
  { id: "civil",     labelFR: "Génie Civil",  labelEN: "Civil",     tag: "Bâti" },
  { id: "telecom",   labelFR: "Télécoms",     labelEN: "Telecom",   tag: "Réseau" },
  { id: "energy",    labelFR: "Énergie",      labelEN: "Energy",    tag: "Watts" },
  { id: "logistics", labelFR: "Logistique",   labelEN: "Logistics", tag: "Flotte" },
  { id: "training",  labelFR: "Formations",   labelEN: "Training",  tag: "Skill" },
];

export function Hero() {
  const t = useT();
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const stageWrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<DomainId>("civil");
  const [autoplay, setAutoplay] = useState(true);

  // Subtle 3D tilt on the stage.
  useEffect(() => {
    const stage = stageWrapRef.current;
    if (!stage || window.matchMedia("(pointer: coarse)").matches) return;

    const handleMove = (e: MouseEvent) => {
      const rect = stage.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const x = ((e.clientX - cx) / rect.width) * 12;
      const y = ((e.clientY - cy) / rect.height) * -12;
      gsap.to(stage, {
        rotationY: x,
        rotationX: y,
        transformPerspective: 1400,
        ease: "power2.out",
        duration: 0.6,
      });
    };
    const handleLeave = () => {
      gsap.to(stage, { rotationY: 0, rotationX: 0, ease: "power3.out", duration: 1 });
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  // Kinetic headline entrance — words rise + blur clears, ink strokes draw under verbs
  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    const words = title.querySelectorAll<HTMLElement>("[data-word]");
    const strokes = title.querySelectorAll<SVGPathElement>("[data-ink]");

    gsap.set(words, { opacity: 0, y: 40, filter: "blur(8px)" });
    gsap.set(strokes, { strokeDasharray: 200, strokeDashoffset: 200 });

    const tl = gsap.timeline({ delay: 0.25 });
    tl.to(words, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.95,
      stagger: 0.08,
      ease: "power3.out",
    });
    tl.to(
      strokes,
      {
        strokeDashoffset: 0,
        duration: 1.0,
        stagger: 0.12,
        ease: "power2.inOut",
      },
      "-=0.6"
    );
  }, [t]); // re-run on language change to redraw

  useEffect(() => {
    if (!autoplay) return;
    // Full SVG construction (layers + pen) needs ~7–8s before the next domain
    const id = window.setTimeout(() => {
      setActive((curr) => {
        const i = DOMAINS.findIndex((d) => d.id === curr);
        return DOMAINS[(i + 1) % DOMAINS.length].id;
      });
    }, 8200);
    return () => window.clearTimeout(id);
  }, [active, autoplay]);

  const activeIndex = DOMAINS.findIndex((d) => d.id === active);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen pt-[120px] pb-[60px] overflow-hidden flex items-center bg-paper bg-paper-grain"
      aria-label="Hero"
    >
      <div className="absolute inset-0 bg-blueprint mask-radial opacity-90 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_12%_18%,rgba(0,0,0,0.04),transparent_45%),radial-gradient(circle_at_92%_86%,rgba(0,0,0,0.05),transparent_45%)]" />

      <div className="max-w-[1280px] mx-auto px-5 sm:px-7 w-full grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-14 items-center relative z-10">

        <div>
          <div className="inline-flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.24em] uppercase text-ink-2 mb-7 px-3.5 py-1.5 border border-grid-strong rounded-full bg-white/40 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-hot shadow-[0_0_0_4px_rgba(43,183,220,0.18)] animate-pulse" />
            {t("hero.eyebrow")}
          </div>

          {/* Headline — kinetic + ink underlines on the four verbs */}
          <h1
            ref={titleRef}
            key={t("hero.title.line1a")}
            className="font-serif font-semibold text-[clamp(40px,6.4vw,86px)] leading-[1.0] tracking-[-0.025em] text-ink mb-8"
          >
            <span className="inline-flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <Verb word={t("hero.title.line1a")} />
              <Verb word={t("hero.title.line1b")} />
            </span>
            <br />
            <span className="inline-flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <Verb word={t("hero.title.line2a")} />
              <Verb word={t("hero.title.line2b")} />
            </span>
            <br />
            <span
              data-word
              className="inline-block font-serif italic text-ink-2 text-[clamp(26px,3.6vw,52px)] tracking-[-0.01em] mt-2"
            >
              {t("hero.title.line3")}
            </span>
          </h1>

          <p className="text-lg text-ink-2 max-w-[540px] mb-9 leading-[1.62]">
            {t("hero.lede")}
          </p>

          <div className="flex flex-wrap gap-3.5 mb-12">
            <Link
              href="#devis"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-hot text-white font-semibold text-sm tracking-[0.01em] shadow-[0_8px_24px_-6px_rgba(43,183,220,0.55)] hover:bg-hot-2 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-8px_rgba(43,183,220,0.65)] transition-all duration-300"
            >
              {t("hero.cta.devis")} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-transparent text-ink font-semibold text-sm tracking-[0.01em] border border-grid-strong hover:bg-ink hover:text-paper hover:border-ink transition-all duration-300"
            >
              {t("hero.cta.services")}
            </Link>
          </div>

          <div className="flex flex-wrap gap-8 items-center text-ink-2">
            {[
              { num: "12+",  key: "hero.stat.years" as const },
              { num: "5",    key: "hero.stat.domains" as const },
              { num: "120+", key: "hero.stat.projects" as const },
              { num: "9/10", key: "hero.stat.retention" as const },
            ].map((stat) => (
              <div key={stat.key} className="flex flex-col">
                <strong className="font-serif text-[34px] text-ink leading-none">{stat.num}</strong>
                <span className="text-[10.5px] tracking-[0.18em] uppercase text-mute mt-1.5">
                  {t(stat.key)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div ref={stageWrapRef} className="transition-transform duration-500 will-change-transform">
            <BlueprintStage active={active} />
          </div>

          <div
            className="mt-5 flex items-center justify-center gap-1.5 sm:gap-2 px-2 py-2 bg-ink rounded-full mx-auto w-fit shadow-md"
            role="tablist"
            aria-label="Domaine en cours de tracé"
          >
            {DOMAINS.map((d, i) => (
              <button
                key={d.id}
                onClick={() => { setActive(d.id); setAutoplay(false); }}
                role="tab"
                aria-selected={active === d.id}
                className={cn(
                  "px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[11px] sm:text-[12px] font-semibold tracking-[0.04em] transition-all whitespace-nowrap",
                  active === d.id
                    ? "bg-hot text-white shadow-sm"
                    : "text-white/55 hover:text-white"
                )}
              >
                0{i + 1} · {d.labelFR}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 text-[11px] font-semibold tracking-[0.28em] uppercase text-ink-2 z-[3]">
        <span className="opacity-50">{t("hero.ticker")} ·</span>
        <span className="text-ink border-b border-ink pb-0.5 transition-all">
          {DOMAINS[activeIndex].labelFR}
        </span>
        <span className="opacity-50">/</span>
        <span className="text-ink-2 font-normal">{DOMAINS[activeIndex].tag}</span>
      </div>
    </section>
  );
}

/**
 * A headline verb with a hand-drawn ink stroke that draws beneath it.
 * The stroke uses a slightly imperfect path so it reads as ink on paper,
 * not as a CSS underline.
 */
function Verb({ word }: { word: string }) {
  return (
    <span className="relative inline-block">
      <span data-word className="inline-block">{word}</span>
      <svg
        className="absolute -bottom-1 left-0 right-0 w-full h-[10px] pointer-events-none"
        viewBox="0 0 200 10"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          data-ink
          d="M 4 6 Q 50 1, 100 4 T 196 5"
          fill="none"
          stroke="var(--color-hot)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
