"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

/**
 * BlueprintStage — The Hero's premium drafting stage.
 *
 * Animates the actual high-resolution blueprint images provided by the user.
 * Employs a high-contrast ink-line extraction filter to isolate and draw the
 * physical lines of the drawing from top to bottom, using a golden laser sweep
 * and CSS gradient masks. Glassmorphic capsules keep all text labels highly readable.
 */

type DomainId = "civil" | "telecom" | "energy" | "logistics" | "training";

interface Props {
  active: DomainId;
}

const DOMAIN_META: Record<DomainId, { plate: string; subject: string; scale: string; date: string; src: string }> = {
  civil:     { plate: "P-01 / CIV", subject: "Bâtiment R+3 · Coupe AA",       scale: "1 : 200", date: "DR. 04·12·25", src: "/blueprint-civil.jpg" },
  telecom:   { plate: "P-02 / TEL", subject: "Pylône autoportant · 42 m",      scale: "1 : 150", date: "DR. 11·12·25", src: "/blueprint-telecom.jpg" },
  energy:    { plate: "P-03 / ENE", subject: "Centrale solaire · 220 kWc",     scale: "1 : 120", date: "DR. 18·12·25", src: "/blueprint-energy.jpg" },
  logistics: { plate: "P-04 / LOG", subject: "Convoi chantier · 8×4 + remorque", scale: "1 : 90",  date: "DR. 02·01·26", src: "/blueprint-logistics.jpg" },
  training:  { plate: "P-05 / FOR", subject: "Centre de formation · Niveau 1",  scale: "1 : 100", date: "DR. 09·01·26", src: "/blueprint-training.jpg" },
};

export function BlueprintStage({ active }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  
  // Image elements refs
  const imgRefs = useRef<Record<string, HTMLImageElement | null>>({});

  useEffect(() => {
    const activeImg = imgRefs.current[active];
    if (!activeImg) return;

    // Reset all inactive images
    Object.keys(DOMAIN_META).forEach((key) => {
      const img = imgRefs.current[key];
      if (img && key !== active) {
        gsap.set(img, { opacity: 0 });
      }
    });

    // Make the active image visible
    gsap.set(activeImg, { opacity: 1 });

    const tl = gsap.timeline();

    // 1. Reset and sweep the golden laser sweeper line
    if (sweepRef.current && glowRef.current) {
      gsap.set(sweepRef.current, { top: "0%", opacity: 1 });
      gsap.set(glowRef.current, { opacity: 0.14 });

      tl.fromTo(sweepRef.current,
        { top: "0%" },
        { top: "100%", duration: 1.8, ease: "power2.inOut" }
      );
      tl.to(sweepRef.current, { opacity: 0, duration: 0.3 }, "-=0.2");
      tl.to(glowRef.current, { opacity: 0, duration: 0.45 }, "-=0.4");
    }

    // 2. Premium ink-line extraction & gradient mask reveal (After Effects style)
    // We animate a custom CSS property `--reveal-progress` from 0% to 100%
    // and smoothly transition the grayscale/contrast filters to reveal the paper texture.
    tl.fromTo(activeImg,
      {
        "--reveal-progress": "0%",
        filter: "grayscale(1) contrast(14) brightness(0.2) opacity(0)",
      },
      {
        "--reveal-progress": "115%",
        filter: "grayscale(0) contrast(1) brightness(1) opacity(1)",
        duration: 1.8,
        ease: "power2.inOut"
      },
      "-=2.1"
    );

    return () => {
      tl.kill();
    };
  }, [active]);

  return (
    <div
      ref={containerRef}
      className="relative aspect-square w-full max-w-[560px] sm:max-w-[600px] mx-auto lg:ml-auto paper-texture rounded-[18px] overflow-hidden paper-edge [transform-style:preserve-3d] p-3 sm:p-5 shadow-xl border border-grid-strong/50 bg-[#f7f3e8]"
    >
      {/* Fine architectural grid */}
      <div className="absolute inset-0 bg-blueprint-xs opacity-[0.45] pointer-events-none z-10" />

      {/* Laser glow highlight */}
      <div 
        ref={glowRef}
        className="absolute inset-0 bg-[#ff8a65]/5 opacity-0 transition-opacity duration-300 pointer-events-none z-15" 
      />

      {/* Corner crops (drawing pins / registration marks) */}
      <CornerMark className="top-2 left-2 z-20" />
      <CornerMark className="top-2 right-2 rotate-90 z-20" />
      <CornerMark className="bottom-2 left-2 -rotate-90 z-20" />
      <CornerMark className="bottom-2 right-2 rotate-180 z-20" />

      {/* Premium High-Contrast Header Bar (Guarantees perfect text readability) */}
      <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between z-20 px-3 py-1.5 rounded-full bg-[#fcfaf2]/90 border border-grid-strong/80 backdrop-blur-md shadow-sm">
        <span className="text-[9px] sm:text-[10px] tracking-[0.24em] font-bold text-ink uppercase">
          {DOMAIN_META[active].plate}
        </span>
        <span className="text-[8px] sm:text-[9.5px] tracking-[0.2em] font-bold text-ink-2 uppercase text-center max-w-[180px] sm:max-w-[240px] truncate">
          Architectural Drawing
        </span>
        <span className="text-[9px] sm:text-[10px] tracking-[0.24em] font-bold text-ink uppercase">
          ECHELLE {DOMAIN_META[active].scale}
        </span>
      </div>

      {/* Laser Plotter Sweep light bar */}
      <div
        ref={sweepRef}
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff8a65] to-transparent shadow-[0_0_12px_#ff8a65] pointer-events-none z-30 opacity-0"
        style={{ top: "0%" }}
      />

      {/* The drawing JPEGs container */}
      <div className="absolute inset-0 w-full h-full p-2 sm:p-4 mt-8 mb-8 relative">
        {/* CSS rules for the After Effects gradient sweep mask */}
        <style>{`
          .blueprint-sweep-image {
            mask-image: linear-gradient(to bottom, black 0%, black var(--reveal-progress, 0%), transparent calc(var(--reveal-progress, 0%) + 15%), transparent 100%);
            -webkit-mask-image: linear-gradient(to bottom, black 0%, black var(--reveal-progress, 0%), transparent calc(var(--reveal-progress, 0%) + 15%), transparent 100%);
          }
        `}</style>

        {(Object.keys(DOMAIN_META) as DomainId[]).map((key) => {
          const item = DOMAIN_META[key];
          return (
            <img
              key={key}
              ref={(el) => { imgRefs.current[key] = el; }}
              src={item.src}
              alt={item.subject}
              className={cn(
                "absolute inset-0 w-full h-full object-contain pointer-events-none select-none transition-opacity duration-300 blueprint-sweep-image",
                active === key ? "opacity-100" : "opacity-0"
              )}
            />
          );
        })}
      </div>

      {/* Premium High-Contrast Bottom Legend Bar (Guarantees perfect text readability) */}
      <div className="absolute left-4 right-4 bottom-3 flex items-center justify-between z-20 px-3 py-1.5 rounded-full bg-[#fcfaf2]/90 border border-grid-strong/80 backdrop-blur-md shadow-sm">
        <span className="text-[9px] sm:text-[10px] tracking-[0.18em] font-bold text-ink uppercase truncate max-w-[200px] sm:max-w-[280px]">
          {DOMAIN_META[active].subject}
        </span>
        <span className="text-[9px] sm:text-[10px] tracking-[0.18em] font-bold text-ink-2 uppercase font-mono">
          {DOMAIN_META[active].date}
        </span>
      </div>
    </div>
  );
}

function CornerMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`absolute w-5 h-5 text-ink-2 pointer-events-none ${className}`}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.6"
    >
      <path d="M 0 4 L 4 4 L 4 0" />
      <circle cx="4" cy="4" r="1" fill="currentColor" />
    </svg>
  );
}
