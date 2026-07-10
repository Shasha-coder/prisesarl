"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

/**
 * BlueprintStage — high-quality civil plates with a real plotter reveal.
 *
 * Uses the PRISE engineering artworks (bridge, urban complex, villa, cable-stay).
 * Animation pipeline (not a simple image fade):
 *   1. Sheet load + grid
 *   2. High-contrast ink extraction (line-art pass)
 *   3. Diagonal plotter mask + laser pen (lines appear as if drawn)
 *   4. Sepia/color warm-in to full plate
 *   5. Slow cinematic pan/zoom across the panorama
 */

type DomainId = "civil" | "telecom" | "energy" | "logistics" | "training";

interface Plate {
  src: string;
  plate: string;
  subject: string;
  scale: string;
  date: string;
  /** Ken Burns direction */
  pan: "left" | "right" | "up" | "center";
}

interface Props {
  active: DomainId;
}

/** Génie civil — user-supplied HQ plates */
const CIVIL_PLATES: Plate[] = [
  {
    src: "/blueprints/civil-1.webp",
    plate: "P-01 / CIV",
    subject: "Pont franchissement · Élévation principale",
    scale: "1 : 500",
    date: "DR. 04·12·25",
    pan: "right",
  },
  {
    src: "/blueprints/civil-2.webp",
    plate: "P-02 / CIV",
    subject: "Complexe urbain · Infrastructure & structure",
    scale: "1 : 200",
    date: "DR. 11·12·25",
    pan: "left",
  },
  {
    src: "/blueprints/civil-3.webp",
    plate: "P-03 / CIV",
    subject: "Codex Architectura · Villa structurelle",
    scale: "1 : 100",
    date: "DR. 18·12·25",
    pan: "center",
  },
  {
    src: "/blueprints/civil-4.webp",
    plate: "P-04 / CIV",
    subject: "Pontis Magnus · Suspension funiculaire",
    scale: "1 : 300",
    date: "DR. 02·01·26",
    pan: "right",
  },
];

/** Other domains — archive plates (same reveal engine) */
const DOMAIN_PLATES: Record<Exclude<DomainId, "civil">, Plate> = {
  telecom: {
    src: "/blueprint-telecom.jpg",
    plate: "P-05 / TEL",
    subject: "Pylône autoportant · 42 m",
    scale: "1 : 150",
    date: "DR. 11·12·25",
    pan: "up",
  },
  energy: {
    src: "/blueprint-energy.jpg",
    plate: "P-06 / ENE",
    subject: "Centrale solaire · 220 kWc",
    scale: "1 : 120",
    date: "DR. 18·12·25",
    pan: "center",
  },
  logistics: {
    src: "/blueprint-logistics.jpg",
    plate: "P-07 / LOG",
    subject: "Convoi chantier · 8×4 + remorque",
    scale: "1 : 90",
    date: "DR. 02·01·26",
    pan: "left",
  },
  training: {
    src: "/blueprint-training.jpg",
    plate: "P-08 / FOR",
    subject: "Centre de formation · Niveau 1",
    scale: "1 : 100",
    date: "DR. 09·01·26",
    pan: "center",
  },
};

export function BlueprintStage({ active }: Props) {
  const [civilIndex, setCivilIndex] = useState(0);
  const [imgReady, setImgReady] = useState(false);

  const plate: Plate =
    active === "civil" ? CIVIL_PLATES[civilIndex % CIVIL_PLATES.length] : DOMAIN_PLATES[active];

  // Rotate HQ civil plates while domain stays on civil
  useEffect(() => {
    if (active !== "civil") return;
    const id = window.setInterval(() => {
      setCivilIndex((i) => (i + 1) % CIVIL_PLATES.length);
    }, 9000);
    return () => window.clearInterval(id);
  }, [active]);

  // Reset civil index when leaving/returning feels snappier on domain click
  useEffect(() => {
    if (active === "civil") setCivilIndex(0);
  }, [active]);

  const frameRef = useRef<HTMLDivElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const inkRef = useRef<HTMLImageElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const penRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const panTweenRef = useRef<gsap.core.Tween | null>(null);

  // Preload next civil plate for smoother swaps
  useEffect(() => {
    if (active !== "civil") return;
    const next = CIVIL_PLATES[(civilIndex + 1) % CIVIL_PLATES.length];
    const pre = new Image();
    pre.src = next.src;
  }, [active, civilIndex]);

  useEffect(() => {
    setImgReady(false);
  }, [plate.src]);

  useEffect(() => {
    if (!imgReady) return;
    const img = imgRef.current;
    const ink = inkRef.current;
    const wrap = imgWrapRef.current;
    const sweep = sweepRef.current;
    const pen = penRef.current;
    const glow = glowRef.current;
    if (!img || !ink || !wrap) return;

    tlRef.current?.kill();
    panTweenRef.current?.kill();

    // Reset state
    gsap.set([img, ink], {
      scale: 1.08,
      xPercent: plate.pan === "left" ? 4 : plate.pan === "right" ? -4 : 0,
      yPercent: plate.pan === "up" ? 3 : 0,
      transformOrigin: "50% 50%",
    });
    gsap.set(ink, {
      opacity: 1,
      filter: "grayscale(1) contrast(2.4) brightness(1.15) invert(0)",
      clipPath: "inset(0 100% 0 0)",
    });
    gsap.set(img, {
      opacity: 0,
      filter: "grayscale(0.35) contrast(1.05) brightness(1.02) sepia(0.25)",
      clipPath: "inset(0 100% 0 0)",
    });
    if (sweep) gsap.set(sweep, { left: "0%", opacity: 1 });
    if (pen) gsap.set(pen, { left: "0%", top: "42%", opacity: 1 });
    if (glow) gsap.set(glow, { opacity: 0.18 });
    if (vignetteRef.current) gsap.set(vignetteRef.current, { opacity: 0.55 });

    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
    });
    tlRef.current = tl;

    // 1) Soft paper settle
    tl.fromTo(
      wrap,
      { opacity: 0.4, scale: 0.985 },
      { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" }
    );

    // 2) Ink pass — lines plot left → right (clip reveal)
    tl.to(
      ink,
      {
        clipPath: "inset(0 0% 0 0)",
        duration: 2.1,
        ease: "power3.inOut",
      },
      "-=0.05"
    );

    // Laser + pen ride the reveal edge
    if (sweep) {
      tl.fromTo(
        sweep,
        { left: "0%" },
        { left: "100%", duration: 2.1, ease: "power3.inOut" },
        "<"
      );
    }
    if (pen) {
      tl.fromTo(
        pen,
        { left: "0%" },
        {
          left: "100%",
          duration: 2.1,
          ease: "power3.inOut",
          onUpdate: function () {
            // Gentle vertical drift so pen feels alive on the plate
            const p = this.progress();
            const wobble = Math.sin(p * Math.PI * 3) * 8;
            gsap.set(pen, { top: `${42 + wobble}%` });
          },
        },
        "<"
      );
    }

    // 3) Color plate follows slightly behind the ink (warm parchment finish)
    tl.to(
      img,
      {
        opacity: 1,
        clipPath: "inset(0 0% 0 0)",
        duration: 1.85,
        ease: "power2.inOut",
      },
      "-=1.35"
    );
    tl.to(
      img,
      {
        filter: "grayscale(0) contrast(1) brightness(1) sepia(0.08)",
        duration: 1.2,
        ease: "power1.out",
      },
      "-=0.9"
    );

    // 4) Fade ink layer so full artwork remains (no double stack)
    tl.to(ink, { opacity: 0, duration: 0.7, ease: "power1.out" }, "-=0.55");

    // 5) Hide plotter tools
    if (sweep) tl.to(sweep, { opacity: 0, duration: 0.3 }, "-=0.5");
    if (pen) tl.to(pen, { opacity: 0, duration: 0.35 }, "-=0.45");
    if (glow) tl.to(glow, { opacity: 0, duration: 0.5 }, "-=0.4");
    if (vignetteRef.current) {
      tl.to(vignetteRef.current, { opacity: 0.25, duration: 0.6 }, "-=0.5");
    }

    // 6) Cinematic hold — slow Ken Burns across the high-detail plate
    const panTarget = {
      scale: 1.14,
      xPercent:
        plate.pan === "left" ? -5 : plate.pan === "right" ? 5 : plate.pan === "center" ? 0 : 0,
      yPercent: plate.pan === "up" ? -4 : plate.pan === "center" ? -1.5 : -1,
      duration: 7.5,
      ease: "none",
    };
    panTweenRef.current = gsap.to(img, panTarget);
    // Keep ink (if still faintly there) locked to same transform — already faded

    return () => {
      tl.kill();
      panTweenRef.current?.kill();
    };
  }, [plate.src, plate.pan, imgReady]);

  return (
    <div
      ref={frameRef}
      className="relative w-full max-w-[640px] mx-auto lg:ml-auto aspect-[5/4] sm:aspect-[4/3] paper-texture rounded-[18px] overflow-hidden paper-edge [transform-style:preserve-3d] p-2.5 sm:p-4 shadow-xl border border-grid-strong/50 bg-[#f3ecdc]"
    >
      {/* Fine architectural grid under plate */}
      <div className="absolute inset-0 bg-blueprint-xs opacity-[0.35] pointer-events-none z-10" />

      <div
        ref={glowRef}
        className="absolute inset-0 bg-[#c8632b]/12 opacity-0 pointer-events-none z-[16] mix-blend-multiply"
      />

      <CornerMark className="top-2 left-2 z-30" />
      <CornerMark className="top-2 right-2 rotate-90 z-30" />
      <CornerMark className="bottom-2 left-2 -rotate-90 z-30" />
      <CornerMark className="bottom-2 right-2 rotate-180 z-30" />

      {/* Title block */}
      <div className="absolute top-3 left-3 right-3 sm:left-4 sm:right-4 flex items-center justify-between z-30 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#fcfaf2]/93 border border-grid-strong/80 backdrop-blur-md shadow-sm gap-2">
        <span className="text-[8px] sm:text-[10px] tracking-[0.2em] font-bold text-ink uppercase shrink-0">
          {plate.plate}
        </span>
        <span className="hidden sm:inline text-[8px] sm:text-[9px] tracking-[0.18em] font-bold text-ink-2 uppercase truncate">
          Plan technique · PRISE
        </span>
        <span className="text-[8px] sm:text-[10px] tracking-[0.18em] font-bold text-ink uppercase shrink-0">
          {plate.scale}
        </span>
      </div>

      {/* Drawing surface */}
      <div
        ref={imgWrapRef}
        className="absolute inset-0 top-10 bottom-10 left-2 right-2 sm:left-3 sm:right-3 overflow-hidden rounded-md bg-[#ebe2ce]"
      >
        {/* Full-color plate */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          key={`color-${plate.src}`}
          src={plate.src}
          alt={plate.subject}
          className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none will-change-transform"
          draggable={false}
          onLoad={() => setImgReady(true)}
        />

        {/* Ink / line-art pass (same asset, filtered) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={inkRef}
          key={`ink-${plate.src}`}
          src={plate.src}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none will-change-transform"
          draggable={false}
        />

        {/* Soft vignette while plotting */}
        <div
          ref={vignetteRef}
          className="absolute inset-0 pointer-events-none z-[12] opacity-50"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(40,28,12,0.35) 100%)",
          }}
        />

        {/* Plotter laser edge */}
        <div
          ref={sweepRef}
          className="absolute top-0 bottom-0 w-[2px] z-20 pointer-events-none opacity-0"
          style={{
            left: 0,
            background:
              "linear-gradient(to bottom, transparent, #ff8a65 15%, #ffb088 50%, #ff8a65 85%, transparent)",
            boxShadow: "0 0 18px #ff8a65, 0 0 4px #ffccaa",
          }}
        />

        {/* Plotter pen head */}
        <div
          ref={penRef}
          className="absolute z-30 pointer-events-none opacity-0 -translate-x-1/2 -translate-y-1/2"
          style={{ left: 0, top: "42%" }}
          aria-hidden
        >
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff8a65] shadow-[0_0_14px_#ff8a65,0_0_3px_#fff]" />
            <div className="absolute -inset-1 rounded-full border border-[#ff8a65]/50" />
          </div>
        </div>

        {/* Loading skeleton until decode */}
        {!imgReady && (
          <div className="absolute inset-0 z-[5] bg-[#ebe2ce] flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-ink/15 border-t-ink/50 animate-spin" />
          </div>
        )}
      </div>

      {/* Civil plate dots */}
      {active === "civil" && (
        <div className="absolute bottom-11 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5">
          {CIVIL_PLATES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Plan civil ${i + 1}`}
              onClick={() => setCivilIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === civilIndex % CIVIL_PLATES.length
                  ? "w-5 bg-hot"
                  : "w-1.5 bg-ink/25 hover:bg-ink/45"
              )}
            />
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="absolute left-3 right-3 sm:left-4 sm:right-4 bottom-2.5 sm:bottom-3 flex items-center justify-between z-30 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#fcfaf2]/93 border border-grid-strong/80 backdrop-blur-md shadow-sm gap-2">
        <span className="text-[8px] sm:text-[10px] tracking-[0.14em] font-bold text-ink uppercase truncate">
          {plate.subject}
        </span>
        <span className="text-[8px] sm:text-[10px] tracking-[0.14em] font-bold text-ink-2 uppercase font-mono shrink-0">
          {plate.date}
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
