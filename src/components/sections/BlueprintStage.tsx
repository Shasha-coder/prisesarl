"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

/**
 * BlueprintStage — real technical drawings that construct themselves.
 *
 * Each domain is a multi-layer SVG (axes → structure → details → dimensions →
 * annotations). GSAP draws strokes in construction order with a laser pen
 * that rides the draw progress — not a JPEG wipe.
 */

type DomainId = "civil" | "telecom" | "energy" | "logistics" | "training";

interface Props {
  active: DomainId;
}

const DOMAIN_META: Record<
  DomainId,
  { plate: string; subject: string; scale: string; date: string }
> = {
  civil: {
    plate: "P-01 / CIV",
    subject: "Bâtiment R+3 · Coupe AA",
    scale: "1 : 200",
    date: "DR. 04·12·25",
  },
  telecom: {
    plate: "P-02 / TEL",
    subject: "Pylône autoportant · 42 m",
    scale: "1 : 150",
    date: "DR. 11·12·25",
  },
  energy: {
    plate: "P-03 / ENE",
    subject: "Centrale solaire · 220 kWc",
    scale: "1 : 120",
    date: "DR. 18·12·25",
  },
  logistics: {
    plate: "P-04 / LOG",
    subject: "Convoi chantier · 8×4 + remorque",
    scale: "1 : 90",
    date: "DR. 02·01·26",
  },
  training: {
    plate: "P-05 / FOR",
    subject: "Centre de formation · Niveau 1",
    scale: "1 : 100",
    date: "DR. 09·01·26",
  },
};

export function BlueprintStage({ active }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const svgHostRef = useRef<HTMLDivElement>(null);
  const penRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const host = svgHostRef.current;
    if (!host) return;

    tlRef.current?.kill();

    const svg = host.querySelector<SVGSVGElement>(`svg[data-domain="${active}"]`);
    if (!svg) return;

    // Hide sibling drawings
    host.querySelectorAll<SVGSVGElement>("svg[data-domain]").forEach((el) => {
      gsap.set(el, { opacity: el === svg ? 1 : 0, visibility: el === svg ? "visible" : "hidden" });
    });

    const layers = Array.from(svg.querySelectorAll<SVGGElement>("[data-layer]")).sort(
      (a, b) => Number(a.dataset.layer) - Number(b.dataset.layer)
    );

    // Prep every drawable path/line/rect/circle/polyline/polygon/text
    const allDrawables: SVGElement[] = [];
    layers.forEach((layer) => {
      layer.querySelectorAll<SVGElement>("path, line, polyline, polygon, rect, circle, ellipse").forEach((el) => {
        allDrawables.push(el);
        prepareStroke(el);
      });
      layer.querySelectorAll<SVGElement>("text, [data-fill]").forEach((el) => {
        gsap.set(el, { opacity: 0 });
      });
    });

    const pen = penRef.current;
    const glow = glowRef.current;
    if (pen) gsap.set(pen, { opacity: 1, top: "8%", left: "12%" });
    if (glow) gsap.set(glow, { opacity: 0.12 });

    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: () => {
        if (pen) gsap.to(pen, { opacity: 0, duration: 0.35 });
        if (glow) gsap.to(glow, { opacity: 0, duration: 0.45 });
      },
    });
    tlRef.current = tl;

    // Soft paper flash as sheet is "loaded"
    tl.fromTo(
      svg,
      { opacity: 0.35 },
      { opacity: 1, duration: 0.25, ease: "power1.out" }
    );

    layers.forEach((layer, layerIndex) => {
      const strokes = Array.from(
        layer.querySelectorAll<SVGElement>("path, line, polyline, polygon, rect, circle, ellipse")
      );
      const labels = Array.from(layer.querySelectorAll<SVGElement>("text, [data-fill]"));
      const speed = layerIndex === 0 ? 0.55 : layerIndex === 1 ? 0.7 : 0.45;
      const stagger = layerIndex <= 1 ? 0.07 : 0.05;

      strokes.forEach((el, i) => {
        const len = getLength(el);
        const dur = Math.min(1.15, Math.max(0.28, (len / 420) * speed + 0.2));

        tl.to(
          el,
          {
            strokeDashoffset: 0,
            duration: dur,
            ease: "power2.inOut",
            onStart: () => movePenTo(el, pen, host),
            onUpdate: function () {
              // Keep pen near mid-progress of current stroke
              if (this.progress() > 0.15 && this.progress() < 0.95) {
                movePenTo(el, pen, host, this.progress());
              }
            },
          },
          i === 0 ? (layerIndex === 0 ? "+=0.05" : "+=0.08") : `-=${dur * (1 - stagger)}`
        );
      });

      if (labels.length) {
        tl.to(
          labels,
          { opacity: 1, duration: 0.35, stagger: 0.04, ease: "power2.out" },
          "-=0.15"
        );
      }
    });

    // Final dimension tick / hot accent pulse on annotation dots
    const accents = svg.querySelectorAll<SVGElement>("[data-accent]");
    if (accents.length) {
      tl.fromTo(
        accents,
        { opacity: 0, scale: 0.4, transformOrigin: "center" },
        { opacity: 1, scale: 1, duration: 0.4, stagger: 0.06, ease: "back.out(1.8)" },
        "-=0.2"
      );
    }

    return () => {
      tl.kill();
    };
  }, [active]);

  return (
    <div
      ref={stageRef}
      className="relative aspect-square w-full max-w-[560px] sm:max-w-[600px] mx-auto lg:ml-auto paper-texture rounded-[18px] overflow-hidden paper-edge [transform-style:preserve-3d] p-3 sm:p-5 shadow-xl border border-grid-strong/50 bg-[#f7f3e8]"
    >
      <div className="absolute inset-0 bg-blueprint-xs opacity-[0.45] pointer-events-none z-10" />

      <div
        ref={glowRef}
        className="absolute inset-0 bg-[#2BB7DC]/10 opacity-0 pointer-events-none z-[15]"
      />

      <CornerMark className="top-2 left-2 z-20" />
      <CornerMark className="top-2 right-2 rotate-90 z-20" />
      <CornerMark className="bottom-2 left-2 -rotate-90 z-20" />
      <CornerMark className="bottom-2 right-2 rotate-180 z-20" />

      {/* Title block */}
      <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between z-20 px-3 py-1.5 rounded-full bg-[#fcfaf2]/92 border border-grid-strong/80 backdrop-blur-md shadow-sm">
        <span className="text-[9px] sm:text-[10px] tracking-[0.24em] font-bold text-ink uppercase">
          {DOMAIN_META[active].plate}
        </span>
        <span className="hidden sm:inline text-[8px] sm:text-[9.5px] tracking-[0.2em] font-bold text-ink-2 uppercase">
          Tracé technique
        </span>
        <span className="text-[9px] sm:text-[10px] tracking-[0.24em] font-bold text-ink uppercase">
          ECHELLE {DOMAIN_META[active].scale}
        </span>
      </div>

      {/* Plotter pen */}
      <div
        ref={penRef}
        className="absolute z-30 pointer-events-none opacity-0 -translate-x-1/2 -translate-y-1/2"
        style={{ top: "20%", left: "20%" }}
        aria-hidden
      >
        <div className="relative">
          <div className="w-3 h-3 rounded-full bg-[#ff8a65] shadow-[0_0_16px_#ff8a65,0_0_4px_#ff8a65]" />
          <div className="absolute inset-0 rounded-full bg-[#ff8a65]/40 animate-ping" />
        </div>
      </div>

      {/* Drawing surface */}
      <div
        ref={svgHostRef}
        className="absolute inset-0 w-full h-full pt-12 pb-11 px-3 sm:px-5"
      >
        <CivilDrawing active={active === "civil"} />
        <TelecomDrawing active={active === "telecom"} />
        <EnergyDrawing active={active === "energy"} />
        <LogisticsDrawing active={active === "logistics"} />
        <TrainingDrawing active={active === "training"} />
      </div>

      {/* Legend */}
      <div className="absolute left-4 right-4 bottom-3 flex items-center justify-between z-20 px-3 py-1.5 rounded-full bg-[#fcfaf2]/92 border border-grid-strong/80 backdrop-blur-md shadow-sm">
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

/* ── stroke helpers ─────────────────────────────────────────────── */

function prepareStroke(el: SVGElement) {
  const len = getLength(el);
  // Prefer stroke drawing even if element has a fill — engineering look
  const tag = el.tagName.toLowerCase();
  if (tag === "rect" || tag === "circle" || tag === "ellipse" || tag === "polygon") {
    const fill = el.getAttribute("fill");
    if (fill && fill !== "none") {
      el.setAttribute("data-had-fill", fill);
      // Keep fill transparent until path is drawn; labels use data-fill separately
      if (!el.hasAttribute("data-keep-fill")) {
        el.setAttribute("fill", "none");
      }
    }
  }
  el.style.strokeDasharray = String(len);
  el.style.strokeDashoffset = String(len);
}

function getLength(el: SVGElement): number {
  try {
    if (el instanceof SVGGeometryElement && typeof el.getTotalLength === "function") {
      const l = el.getTotalLength();
      if (l > 0) return l;
    }
  } catch {
    /* fall through */
  }
  // Approximate for elements without getTotalLength in some browsers
  const box = (el as SVGGraphicsElement).getBBox?.();
  if (box) return Math.max(40, (box.width + box.height) * 2);
  return 120;
}

function movePenTo(
  el: SVGElement,
  pen: HTMLDivElement | null,
  host: HTMLDivElement | null,
  progress = 0.5
) {
  if (!pen || !host) return;
  try {
    const hostBox = host.getBoundingClientRect();
    let x = 0.5;
    let y = 0.5;

    if (el instanceof SVGGeometryElement && typeof el.getPointAtLength === "function") {
      const len = el.getTotalLength();
      const pt = el.getPointAtLength(Math.max(0, Math.min(len, len * progress)));
      const ctm = el.getScreenCTM();
      if (ctm) {
        const p = new DOMPoint(pt.x, pt.y).matrixTransform(ctm);
        x = (p.x - hostBox.left) / hostBox.width;
        y = (p.y - hostBox.top) / hostBox.height;
      }
    } else {
      const box = (el as SVGGraphicsElement).getBoundingClientRect();
      x = (box.left + box.width * progress - hostBox.left) / hostBox.width;
      y = (box.top + box.height * 0.5 - hostBox.top) / hostBox.height;
    }

    gsap.to(pen, {
      left: `${Math.min(94, Math.max(6, x * 100))}%`,
      top: `${Math.min(92, Math.max(8, y * 100))}%`,
      duration: 0.18,
      ease: "power2.out",
      overwrite: "auto",
    });
  } catch {
    /* ignore pen tracking errors */
  }
}

/* ── drawings ───────────────────────────────────────────────────── */

const svgBase =
  "absolute inset-0 w-full h-full text-ink overflow-visible";

function CivilDrawing({ active }: { active: boolean }) {
  return (
    <svg
      data-domain="civil"
      viewBox="0 0 400 400"
      className={cn(svgBase, !active && "pointer-events-none")}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={!active}
    >
      {/* L0 — survey axes + ground */}
      <g data-layer="0" className="text-ink/35" strokeWidth="1">
        <line x1="36" y1="340" x2="364" y2="340" />
        <line x1="48" y1="48" x2="48" y2="348" />
        <line x1="36" y1="340" x2="36" y2="352" />
        <line x1="364" y1="340" x2="364" y2="352" />
        {/* grid ticks */}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={i} x1={48 + i * 40} y1="340" x2={48 + i * 40} y2="346" />
        ))}
      </g>

      {/* L1 — foundation + structure skeleton */}
      <g data-layer="1" strokeWidth="1.7">
        {/* footing */}
        <path d="M 90 340 L 90 318 L 310 318 L 310 340" />
        <path d="M 100 318 L 100 308 L 300 308 L 300 318" />
        {/* columns */}
        <line x1="110" y1="308" x2="110" y2="118" />
        <line x1="200" y1="308" x2="200" y2="100" />
        <line x1="290" y1="308" x2="290" y2="118" />
        {/* floor slabs R+0 → R+3 */}
        <line x1="100" y1="268" x2="300" y2="268" />
        <line x1="100" y1="218" x2="300" y2="218" />
        <line x1="100" y1="168" x2="300" y2="168" />
        <line x1="100" y1="118" x2="300" y2="118" />
        {/* roof */}
        <path d="M 88 118 L 200 72 L 312 118" />
        <line x1="200" y1="72" x2="200" y2="100" />
      </g>

      {/* L2 — openings, stairs, facade detail */}
      <g data-layer="2" strokeWidth="1.25" className="text-ink-2">
        {/* windows per floor */}
        {[268, 218, 168].map((y) => (
          <g key={y}>
            <rect x="128" y={y - 36} width="28" height="28" />
            <rect x="186" y={y - 36} width="28" height="28" />
            <rect x="244" y={y - 36} width="28" height="28" />
            <line x1="142" y1={y - 36} x2="142" y2={y - 8} />
            <line x1="200" y1={y - 36} x2="200" y2={y - 8} />
            <line x1="258" y1={y - 36} x2="258" y2={y - 8} />
            <line x1="128" y1={y - 22} x2="156" y2={y - 22} />
            <line x1="186" y1={y - 22} x2="214" y2={y - 22} />
            <line x1="244" y1={y - 22} x2="272" y2={y - 22} />
          </g>
        ))}
        {/* ground door */}
        <rect x="186" y="278" width="28" height="30" />
        <circle cx="208" cy="294" r="1.5" fill="currentColor" stroke="none" data-keep-fill />
        {/* stair indication */}
        <path d="M 300 308 L 320 308 L 320 268 L 300 268" className="text-ink/50" />
        <path d="M 304 300 L 316 300 M 304 292 L 316 292 M 304 284 L 316 284 M 304 276 L 316 276" />
        {/* roof tiles suggestion */}
        <path d="M 120 112 L 200 80 L 280 112" className="text-hot" strokeWidth="1.1" />
      </g>

      {/* L3 — dimensions + annotations */}
      <g data-layer="3" strokeWidth="1" className="text-ink/70">
        {/* height dim left */}
        <line x1="72" y1="340" x2="72" y2="118" />
        <line x1="68" y1="340" x2="76" y2="340" />
        <line x1="68" y1="118" x2="76" y2="118" />
        <line x1="68" y1="268" x2="76" y2="268" />
        <line x1="68" y1="218" x2="76" y2="218" />
        <line x1="68" y1="168" x2="76" y2="168" />
        {/* width dim bottom */}
        <line x1="100" y1="360" x2="300" y2="360" />
        <line x1="100" y1="356" x2="100" y2="364" />
        <line x1="300" y1="356" x2="300" y2="364" />

        <text x="58" y="235" fontSize="9" fontFamily="ui-monospace, monospace" fill="currentColor" stroke="none" transform="rotate(-90 58 235)">
          H = 12.40 m
        </text>
        <text x="175" y="376" fontSize="9" fontFamily="ui-monospace, monospace" fill="currentColor" stroke="none">
          L = 18.00 m
        </text>
        <text x="208" y="64" fontSize="10" fontFamily="ui-monospace, monospace" fill="currentColor" stroke="none">
          R+3
        </text>
        <text x="318" y="290" fontSize="8" fontFamily="ui-monospace, monospace" fill="currentColor" stroke="none">
          ESC.
        </text>

        {/* section cut mark */}
        <circle cx="200" cy="200" r="4" className="text-hot" data-accent strokeWidth="1.5" />
        <circle cx="110" cy="200" r="3" className="text-hot" data-accent />
        <circle cx="290" cy="200" r="3" className="text-hot" data-accent />
      </g>
    </svg>
  );
}

function TelecomDrawing({ active }: { active: boolean }) {
  return (
    <svg
      data-domain="telecom"
      viewBox="0 0 400 400"
      className={cn(svgBase, !active && "pointer-events-none")}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={!active}
    >
      <g data-layer="0" className="text-ink/35" strokeWidth="1">
        <line x1="40" y1="350" x2="360" y2="350" />
        <line x1="50" y1="50" x2="50" y2="355" />
      </g>

      <g data-layer="1" strokeWidth="1.7">
        {/* base pad */}
        <path d="M 140 350 L 140 330 L 260 330 L 260 350" />
        {/* tower legs */}
        <line x1="160" y1="330" x2="185" y2="70" />
        <line x1="240" y1="330" x2="215" y2="70" />
        {/* lattice cross braces */}
        {[310, 270, 230, 190, 150, 110].map((y, i) => {
          const t = (330 - y) / 260;
          const left = 160 + (185 - 160) * ((330 - y) / 260);
          const right = 240 + (215 - 240) * ((330 - y) / 260);
          return (
            <g key={y}>
              <line x1={left} y1={y} x2={right} y2={y} />
              {i % 2 === 0 ? (
                <line x1={left} y1={y} x2={right} y2={y - 40} />
              ) : (
                <line x1={right} y1={y} x2={left} y2={y - 40} />
              )}
            </g>
          );
        })}
        {/* top mast */}
        <line x1="200" y1="70" x2="200" y2="42" />
      </g>

      <g data-layer="2" strokeWidth="1.3" className="text-ink-2">
        {/* antenna panels */}
        <rect x="168" y="88" width="20" height="28" />
        <rect x="212" y="88" width="20" height="28" />
        <rect x="172" y="148" width="18" height="24" />
        <rect x="210" y="148" width="18" height="24" />
        {/* dish */}
        <path d="M 230 200 Q 255 210 250 235" className="text-hot" strokeWidth="1.6" />
        <line x1="220" y1="210" x2="232" y2="218" />
        {/* signal arcs */}
        <path d="M 200 42 Q 230 30 248 48" className="text-hot" strokeWidth="1.2" />
        <path d="M 200 42 Q 240 18 268 42" className="text-hot" strokeWidth="1.1" />
        <path d="M 200 42 Q 170 30 152 48" className="text-hot" strokeWidth="1.2" />
        <path d="M 200 42 Q 160 18 132 42" className="text-hot" strokeWidth="1.1" />
      </g>

      <g data-layer="3" strokeWidth="1" className="text-ink/70">
        <line x1="120" y1="350" x2="120" y2="42" />
        <line x1="116" y1="350" x2="124" y2="350" />
        <line x1="116" y1="42" x2="124" y2="42" />
        <text x="98" y="200" fontSize="9" fontFamily="ui-monospace, monospace" fill="currentColor" stroke="none" transform="rotate(-90 98 200)">
          H = 42.00 m
        </text>
        <text x="250" y="340" fontSize="9" fontFamily="ui-monospace, monospace" fill="currentColor" stroke="none">
          BASE 4.80 m
        </text>
        <circle cx="200" cy="42" r="3.5" className="text-hot" data-accent fill="currentColor" stroke="none" data-keep-fill />
      </g>
    </svg>
  );
}

function EnergyDrawing({ active }: { active: boolean }) {
  return (
    <svg
      data-domain="energy"
      viewBox="0 0 400 400"
      className={cn(svgBase, !active && "pointer-events-none")}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={!active}
    >
      <g data-layer="0" className="text-ink/35" strokeWidth="1">
        <line x1="36" y1="320" x2="364" y2="320" />
        <line x1="48" y1="60" x2="48" y2="330" />
      </g>

      <g data-layer="1" strokeWidth="1.6">
        {/* ground mounts */}
        <line x1="70" y1="320" x2="90" y2="250" />
        <line x1="160" y1="320" x2="170" y2="250" />
        <line x1="230" y1="320" x2="250" y2="250" />
        <line x1="320" y1="320" x2="330" y2="250" />
        {/* panel frames (isometric-ish) */}
        <path d="M 70 250 L 150 230 L 170 280 L 90 300 Z" />
        <path d="M 180 250 L 260 230 L 280 280 L 200 300 Z" />
        <path d="M 290 250 L 350 235 L 360 275 L 300 290 Z" />
      </g>

      <g data-layer="2" strokeWidth="1.15" className="text-ink-2">
        {/* cell grid panel 1 */}
        {[0, 1, 2].map((r) =>
          [0, 1, 2, 3].map((c) => (
            <path
              key={`p1-${r}-${c}`}
              d={`M ${78 + c * 18} ${252 + r * 14} L ${92 + c * 18} ${248 + r * 14} L ${96 + c * 18} ${260 + r * 14} L ${82 + c * 18} ${264 + r * 14} Z`}
            />
          ))
        )}
        {/* cell grid panel 2 */}
        {[0, 1, 2].map((r) =>
          [0, 1, 2, 3].map((c) => (
            <path
              key={`p2-${r}-${c}`}
              d={`M ${188 + c * 18} ${252 + r * 14} L ${202 + c * 18} ${248 + r * 14} L ${206 + c * 18} ${260 + r * 14} L ${192 + c * 18} ${264 + r * 14} Z`}
            />
          ))
        )}
        {/* inverter box + cable */}
        <rect x="175" y="310" width="50" height="22" />
        <line x1="200" y1="310" x2="200" y2="290" className="text-hot" />
        <path d="M 200 290 L 230 270" className="text-hot" />
        {/* sun */}
        <circle cx="320" cy="90" r="22" className="text-gold" strokeWidth="1.5" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
          const r1 = 28;
          const r2 = 38;
          const a = (deg * Math.PI) / 180;
          return (
            <line
              key={deg}
              x1={320 + Math.cos(a) * r1}
              y1={90 + Math.sin(a) * r1}
              x2={320 + Math.cos(a) * r2}
              y2={90 + Math.sin(a) * r2}
              className="text-gold"
              strokeWidth="1.3"
            />
          );
        })}
      </g>

      <g data-layer="3" strokeWidth="1" className="text-ink/70">
        <text x="70" y="350" fontSize="9" fontFamily="ui-monospace, monospace" fill="currentColor" stroke="none">
          220 kWc · 3 STRINGS
        </text>
        <text x="175" y="305" fontSize="8" fontFamily="ui-monospace, monospace" fill="currentColor" stroke="none">
          ONDULEUR
        </text>
        <circle cx="200" cy="290" r="3" className="text-hot" data-accent fill="currentColor" stroke="none" data-keep-fill />
      </g>
    </svg>
  );
}

function LogisticsDrawing({ active }: { active: boolean }) {
  return (
    <svg
      data-domain="logistics"
      viewBox="0 0 400 400"
      className={cn(svgBase, !active && "pointer-events-none")}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={!active}
    >
      <g data-layer="0" className="text-ink/35" strokeWidth="1">
        <line x1="30" y1="300" x2="370" y2="300" />
        {/* dashed road marks */}
        {[60, 110, 160, 210, 260, 310].map((x) => (
          <line key={x} x1={x} y1="312" x2={x + 24} y2="312" strokeDasharray="4 6" />
        ))}
      </g>

      <g data-layer="1" strokeWidth="1.7">
        {/* trailer bed */}
        <rect x="48" y="210" width="180" height="70" />
        {/* cab */}
        <path d="M 228 280 L 228 230 L 260 230 L 290 255 L 290 280 Z" />
        <rect x="248" y="238" width="28" height="22" />
        {/* chassis */}
        <line x1="48" y1="280" x2="290" y2="280" />
      </g>

      <g data-layer="2" strokeWidth="1.3" className="text-ink-2">
        {/* cargo crates */}
        <rect x="60" y="188" width="48" height="22" />
        <rect x="116" y="178" width="52" height="32" />
        <rect x="176" y="188" width="40" height="22" />
        {/* wheels */}
        <circle cx="90" cy="300" r="16" />
        <circle cx="90" cy="300" r="7" />
        <circle cx="160" cy="300" r="16" />
        <circle cx="160" cy="300" r="7" />
        <circle cx="250" cy="300" r="16" />
        <circle cx="250" cy="300" r="7" />
        {/* crane boom hint */}
        <line x1="200" y1="210" x2="200" y2="140" className="text-hot" strokeWidth="1.6" />
        <line x1="200" y1="140" x2="270" y2="160" className="text-hot" strokeWidth="1.6" />
        <line x1="270" y1="160" x2="270" y2="200" className="text-hot" strokeWidth="1.2" strokeDasharray="3 3" />
        <path d="M 260 200 L 280 200 L 270 215 Z" className="text-hot" />
      </g>

      <g data-layer="3" strokeWidth="1" className="text-ink/70">
        <line x1="48" y1="340" x2="290" y2="340" />
        <line x1="48" y1="336" x2="48" y2="344" />
        <line x1="290" y1="336" x2="290" y2="344" />
        <text x="140" y="358" fontSize="9" fontFamily="ui-monospace, monospace" fill="currentColor" stroke="none">
          L = 12.40 m
        </text>
        <text x="55" y="200" fontSize="8" fontFamily="ui-monospace, monospace" fill="currentColor" stroke="none">
          8×4 + REMORQUE
        </text>
        <circle cx="200" cy="140" r="3.5" className="text-hot" data-accent fill="currentColor" stroke="none" data-keep-fill />
      </g>
    </svg>
  );
}

function TrainingDrawing({ active }: { active: boolean }) {
  return (
    <svg
      data-domain="training"
      viewBox="0 0 400 400"
      className={cn(svgBase, !active && "pointer-events-none")}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={!active}
    >
      <g data-layer="0" className="text-ink/35" strokeWidth="1">
        <line x1="40" y1="330" x2="360" y2="330" />
        <line x1="50" y1="60" x2="50" y2="340" />
      </g>

      <g data-layer="1" strokeWidth="1.6">
        {/* building shell */}
        <path d="M 80 330 L 80 150 L 200 100 L 320 150 L 320 330 Z" />
        <line x1="80" y1="150" x2="320" y2="150" />
        <line x1="200" y1="100" x2="200" y2="330" />
      </g>

      <g data-layer="2" strokeWidth="1.25" className="text-ink-2">
        {/* classroom windows left */}
        <rect x="100" y="175" width="36" height="28" />
        <rect x="148" y="175" width="36" height="28" />
        <rect x="100" y="230" width="36" height="28" />
        <rect x="148" y="230" width="36" height="28" />
        {/* right */}
        <rect x="216" y="175" width="36" height="28" />
        <rect x="264" y="175" width="36" height="28" />
        <rect x="216" y="230" width="36" height="28" />
        <rect x="264" y="230" width="36" height="28" />
        {/* entrance */}
        <rect x="180" y="280" width="40" height="50" />
        {/* board / screen inside suggestion */}
        <rect x="110" y="290" width="50" height="28" className="text-hot" />
        <line x1="118" y1="300" x2="152" y2="300" className="text-hot" />
        <line x1="118" y1="308" x2="145" y2="308" className="text-hot" />
        {/* people icon simple */}
        <circle cx="250" cy="300" r="7" />
        <path d="M 238 322 Q 250 310 262 322" />
        <circle cx="275" cy="300" r="7" />
        <path d="M 263 322 Q 275 310 287 322" />
      </g>

      <g data-layer="3" strokeWidth="1" className="text-ink/70">
        <text x="145" y="88" fontSize="10" fontFamily="ui-monospace, monospace" fill="currentColor" stroke="none">
          CENTRE NIVEAU 1
        </text>
        <text x="95" y="355" fontSize="9" fontFamily="ui-monospace, monospace" fill="currentColor" stroke="none">
          4 SALLES · ATELIER · LABO
        </text>
        <circle cx="200" cy="100" r="3.5" className="text-hot" data-accent fill="currentColor" stroke="none" data-keep-fill />
        <circle cx="200" cy="305" r="3" className="text-hot" data-accent />
      </g>
    </svg>
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
