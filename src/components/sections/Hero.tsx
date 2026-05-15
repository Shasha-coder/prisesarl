"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BlueprintStage } from "@/components/sections/BlueprintStage";

type DomainId = "civil" | "telecom" | "energy" | "logistics" | "training";

const DOMAINS: { id: DomainId; label: string; tag: string }[] = [
  { id: "civil",     label: "Génie Civil",       tag: "Bâti" },
  { id: "telecom",   label: "Télécoms",          tag: "Réseau" },
  { id: "energy",    label: "Énergie",           tag: "Watts" },
  { id: "logistics", label: "Logistique",        tag: "Flotte" },
  { id: "training",  label: "Formations",        tag: "Compétence" },
];

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
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

  // Headline entrance.
  useEffect(() => {
    const words = textRef.current?.querySelectorAll(".word");
    if (!words) return;
    gsap.fromTo(
      words,
      { opacity: 0, y: 38, rotateX: -22 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.9,
        stagger: 0.07,
        ease: "power3.out",
        delay: 0.2,
      }
    );
  }, []);

  // Autoplay cycle.
  useEffect(() => {
    if (!autoplay) return;
    const t = window.setTimeout(() => {
      setActive((curr) => {
        const i = DOMAINS.findIndex((d) => d.id === curr);
        return DOMAINS[(i + 1) % DOMAINS.length].id;
      });
    }, 5200);
    return () => window.clearTimeout(t);
  }, [active, autoplay]);

  const activeIndex = DOMAINS.findIndex((d) => d.id === active);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen pt-[120px] pb-[60px] overflow-hidden flex items-center bg-paper bg-paper-grain"
      aria-label="Hero blueprint"
    >
      {/* Coarse grid */}
      <div className="absolute inset-0 bg-blueprint mask-radial opacity-90 pointer-events-none" />
      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_12%_18%,rgba(0,0,0,0.04),transparent_45%),radial-gradient(circle_at_92%_86%,rgba(0,0,0,0.05),transparent_45%)]" />

      <div className="max-w-[1280px] mx-auto px-5 sm:px-7 w-full grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-14 items-center relative z-10">

        {/* Left copy */}
        <div>
          <div className="inline-flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.24em] uppercase text-ink-2 mb-7 px-3.5 py-1.5 border border-grid-strong rounded-full bg-white/40 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-hot shadow-[0_0_0_4px_rgba(43,183,220,0.18)] animate-pulse" />
            Kinshasa · RDC · est. 2013
          </div>

          <h1
            ref={textRef}
            className="font-serif font-semibold text-[clamp(40px,6.4vw,86px)] leading-[1.0] tracking-[-0.025em] text-ink mb-7"
          >
            <span className="word inline-block origin-bottom-left">Construire,</span>{" "}
            <span className="word inline-block origin-bottom-left">connecter,</span>
            <br />
            <span className="word inline-block origin-bottom-left">alimenter,</span>{" "}
            <span className="word inline-block origin-bottom-left">former</span>
            <br />
            <span className="word inline-block origin-bottom-left text-ink-2 italic font-serif">
              — l&apos;avenir, par étapes mesurées.
            </span>
          </h1>

          <p className="text-lg text-ink-2 max-w-[540px] mb-9 leading-[1.62]">
            PRISE Sarl conçoit, bâtit et opère les infrastructures qui tiennent l&apos;Afrique
            centrale en marche — du plan coté au chantier livré, sans sous-traitance déguisée.
          </p>

          <div className="flex flex-wrap gap-3.5 mb-12">
            <Link
              href="#devis"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-hot text-white font-semibold text-sm tracking-[0.01em] shadow-[0_8px_24px_-6px_rgba(43,183,220,0.55)] hover:bg-hot-2 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-8px_rgba(43,183,220,0.65)] transition-all duration-300"
            >
              Demander un devis <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-transparent text-ink font-semibold text-sm tracking-[0.01em] border border-grid-strong hover:bg-ink hover:text-paper hover:border-ink transition-all duration-300"
            >
              Découvrir nos cinq métiers
            </Link>
          </div>

          <div className="flex flex-wrap gap-8 items-center text-ink-2">
            {[
              { num: "12+", label: "années d'expertise" },
              { num: "5",   label: "domaines intégrés" },
              { num: "120+", label: "projets livrés" },
              { num: "9/10", label: "clients récurrents" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <strong className="font-serif text-[34px] text-ink leading-none">{stat.num}</strong>
                <span className="text-[10.5px] tracking-[0.18em] uppercase text-mute mt-1.5">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right stage — BlueprintStage handles all the drawing */}
        <div className="relative">
          <div ref={stageWrapRef} className="transition-transform duration-500 will-change-transform">
            <BlueprintStage active={active} />
          </div>

          {/* Domain switcher chips — outside the stage so 3D tilt doesn't catch them */}
          <div
            className="mt-5 flex items-center justify-center gap-1.5 sm:gap-2 px-2 py-2 bg-ink rounded-full mx-auto w-fit shadow-md"
            role="tablist"
            aria-label="Choix du domaine en cours de tracé"
          >
            {DOMAINS.map((d, i) => (
              <button
                key={d.id}
                onClick={() => {
                  setActive(d.id);
                  setAutoplay(false);
                }}
                role="tab"
                aria-selected={active === d.id}
                className={cn(
                  "px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[11px] sm:text-[12px] font-semibold tracking-[0.04em] transition-all whitespace-nowrap",
                  active === d.id
                    ? "bg-hot text-white shadow-sm"
                    : "text-white/55 hover:text-white"
                )}
              >
                0{i + 1} · {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom plate ticker */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 text-[11px] font-semibold tracking-[0.28em] uppercase text-ink-2 z-[3]">
        <span className="opacity-50">Plan en cours ·</span>
        <span className="text-ink border-b border-ink pb-0.5 transition-all">
          {DOMAINS[activeIndex].label}
        </span>
        <span className="opacity-50">/</span>
        <span className="text-ink-2 font-normal">{DOMAINS[activeIndex].tag}</span>
      </div>
    </section>
  );
}
