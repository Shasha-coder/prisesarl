"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * BlueprintStage — the Hero's living drawing surface.
 *
 * Each domain has its own technical-drawing scene composed of inline SVG paths.
 * On domain change, the new scene fades in and its strokes self-draw in order,
 * the same way a draftsman would lay it down on paper.
 */

type DomainId = "civil" | "telecom" | "energy" | "logistics" | "training";

interface Props {
  active: DomainId;
}

const DOMAIN_META: Record<DomainId, { plate: string; subject: string; scale: string; date: string }> = {
  civil:     { plate: "P-01 / CIV", subject: "Bâtiment R+3 · Coupe AA",       scale: "1 : 200", date: "DR. 04·12·25" },
  telecom:   { plate: "P-02 / TEL", subject: "Pylône autoportant · 42 m",      scale: "1 : 150", date: "DR. 11·12·25" },
  energy:    { plate: "P-03 / ENE", subject: "Centrale solaire · 220 kWc",     scale: "1 : 120", date: "DR. 18·12·25" },
  logistics: { plate: "P-04 / LOG", subject: "Convoi chantier · 8×4 + remorque", scale: "1 : 90",  date: "DR. 02·01·26" },
  training:  { plate: "P-05 / FOR", subject: "Centre de formation · Niveau 1",  scale: "1 : 100", date: "DR. 09·01·26" },
};

const COMMON_PATH_STROKE = "stroke-ink";

export function BlueprintStage({ active }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const civilRef = useRef<SVGGElement | null>(null);
  const telecomRef = useRef<SVGGElement | null>(null);
  const energyRef = useRef<SVGGElement | null>(null);
  const logisticsRef = useRef<SVGGElement | null>(null);
  const trainingRef = useRef<SVGGElement | null>(null);

  // Animate active scene on mount + every change.
  useEffect(() => {
    const sceneEl =
      active === "civil" ? civilRef.current :
      active === "telecom" ? telecomRef.current :
      active === "energy" ? energyRef.current :
      active === "logistics" ? logisticsRef.current :
      trainingRef.current;
    if (!sceneEl) return;

    const paths = sceneEl.querySelectorAll<SVGGeometryElement>("[data-draw]");
    const labels = sceneEl.querySelectorAll<SVGElement>("[data-label]");

    paths.forEach((p) => {
      try {
        const len = p.getTotalLength();
        p.style.strokeDasharray = String(len);
        p.style.strokeDashoffset = String(len);
      } catch {
        /* circles/rects without getTotalLength: leave them */
      }
    });

    gsap.set(labels, { opacity: 0, y: 4 });

    const tl = gsap.timeline();
    tl.to(paths, {
      strokeDashoffset: 0,
      duration: 1.4,
      ease: "power2.inOut",
      stagger: { amount: 1.2, from: "start" },
    });
    tl.to(
      labels,
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        stagger: 0.08,
        ease: "power2.out",
      },
      "-=0.8"
    );

    return () => {
      tl.kill();
    };
  }, [active]);

  const meta = DOMAIN_META[active];

  return (
    <div
      ref={stageRef}
      className="relative aspect-square w-full max-w-[600px] mx-auto lg:ml-auto paper-texture rounded-[18px] overflow-hidden paper-edge [transform-style:preserve-3d]"
    >
      {/* Fine grid */}
      <div className="absolute inset-0 bg-blueprint-xs opacity-[0.55] pointer-events-none" />

      {/* Corner crops (drawing pins / registration marks) */}
      <CornerMark className="top-2 left-2" />
      <CornerMark className="top-2 right-2 rotate-90" />
      <CornerMark className="bottom-2 left-2 -rotate-90" />
      <CornerMark className="bottom-2 right-2 rotate-180" />

      {/* Title cartouche */}
      <div className="absolute top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[9px] tracking-[0.28em] uppercase text-ink-2 font-semibold bg-paper/60 border border-grid-strong px-3 py-1 rounded-full backdrop-blur-sm">
        <span className="w-1 h-1 rounded-full bg-rust" />
        Architectural Working Drawing
      </div>

      {/* Plate number + scale */}
      <span className="absolute top-3.5 left-4 text-[9.5px] tracking-[0.24em] font-semibold text-ink-2 uppercase">
        PRISE / {meta.plate}
      </span>
      <span className="absolute top-3.5 right-4 text-[9.5px] tracking-[0.24em] font-semibold text-ink-2 uppercase">
        Échelle {meta.scale}
      </span>

      {/* Drawing canvas (SVG keeps all 5 scenes; only active is shown) */}
      <svg
        viewBox="0 0 600 600"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Frame */}
        <rect
          x="38" y="58" width="524" height="484"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
          className="text-ink/30"
          strokeDasharray="3 3"
        />

        {/* CIVIL — building cross-section */}
        <g ref={civilRef} className={COMMON_PATH_STROKE} style={{ display: active === "civil" ? "block" : "none" }}>
          {/* Foundation */}
          <path data-draw d="M 110 470 L 490 470 L 490 500 L 110 500 Z" fill="none" stroke="currentColor" strokeWidth="2" />
          <path data-draw d="M 130 500 L 130 530 M 470 500 L 470 530 M 200 500 L 200 525 M 300 500 L 300 525 M 400 500 L 400 525" stroke="currentColor" strokeWidth="1" />
          {/* Floors */}
          <path data-draw d="M 110 470 L 110 200 L 490 200 L 490 470" fill="none" stroke="currentColor" strokeWidth="2" />
          <path data-draw d="M 110 380 L 490 380" stroke="currentColor" strokeWidth="1.2" />
          <path data-draw d="M 110 290 L 490 290" stroke="currentColor" strokeWidth="1.2" />
          {/* Roof */}
          <path data-draw d="M 90 200 L 300 100 L 510 200" fill="none" stroke="currentColor" strokeWidth="2" />
          <path data-draw d="M 110 200 L 300 130 L 490 200" stroke="currentColor" strokeWidth="0.8" />
          {/* Windows per floor */}
          <path data-draw d="M 150 320 L 195 320 L 195 360 L 150 360 Z M 240 320 L 285 320 L 285 360 L 240 360 Z M 330 320 L 375 320 L 375 360 L 330 360 Z M 420 320 L 465 320 L 465 360 L 420 360 Z" fill="none" stroke="currentColor" strokeWidth="1.1" />
          <path data-draw d="M 150 410 L 195 410 L 195 450 L 150 450 Z M 240 410 L 285 410 L 285 450 L 240 450 Z M 330 410 L 375 410 L 375 450 L 330 450 Z M 420 410 L 465 410 L 465 450 L 420 450 Z" fill="none" stroke="currentColor" strokeWidth="1.1" />
          {/* Door */}
          <path data-draw d="M 270 470 L 270 410 Q 270 395 285 395 L 315 395 Q 330 395 330 410 L 330 470" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path data-draw d="M 290 215 L 290 270 L 310 270 L 310 215" fill="none" stroke="currentColor" strokeWidth="1.1" />
          {/* Dimension lines */}
          <path data-draw d="M 90 545 L 510 545 M 90 540 L 90 550 M 510 540 L 510 550" stroke="currentColor" strokeWidth="1" />
          <path data-draw d="M 65 100 L 65 500 M 60 100 L 70 100 M 60 500 L 70 500" stroke="currentColor" strokeWidth="1" />
          {/* Labels */}
          <Label x={300} y={540} anchor="middle">14,40 m</Label>
          <Label x={45} y={300} rotate={-90} anchor="middle">12,80 m</Label>
          <Label x={520} y={172} anchor="start">R+3</Label>
          <Label x={520} y={250} anchor="start">N+2</Label>
          <Label x={520} y={345} anchor="start">N+1</Label>
          <Label x={520} y={435} anchor="start">RDC</Label>
          <Callout x1={195} y1={340} x2={130} y2={300} text="Menuiserie alu" textX={130} textY={290} />
          <Callout x1={300} y1={120} x2={400} y2={70} text="Toiture 4 pans" textX={400} textY={60} />
        </g>

        {/* TELECOM — telecom tower */}
        <g ref={telecomRef} className={COMMON_PATH_STROKE} style={{ display: active === "telecom" ? "block" : "none" }}>
          {/* Base pad */}
          <path data-draw d="M 200 510 L 400 510 L 400 530 L 200 530 Z" fill="none" stroke="currentColor" strokeWidth="2" />
          {/* Outer tower (tapered) */}
          <path data-draw d="M 220 510 L 290 110" fill="none" stroke="currentColor" strokeWidth="2" />
          <path data-draw d="M 380 510 L 310 110" fill="none" stroke="currentColor" strokeWidth="2" />
          {/* Horizontal braces */}
          <path data-draw d="M 230 470 L 370 470 M 240 410 L 360 410 M 250 350 L 350 350 M 258 290 L 342 290 M 266 230 L 334 230 M 272 170 L 328 170" stroke="currentColor" strokeWidth="1.1" />
          {/* X bracing */}
          <path data-draw d="M 230 470 L 360 410 M 370 470 L 240 410 M 250 350 L 342 290 M 350 350 L 258 290 M 272 170 L 328 230 M 328 170 L 272 230 M 266 230 L 334 290 M 334 230 L 266 290 M 240 410 L 350 350 M 360 410 L 250 350" stroke="currentColor" strokeWidth="0.7" />
          {/* Antennas */}
          <path data-draw d="M 290 110 L 290 60 M 310 110 L 310 60 M 300 60 L 300 35" stroke="currentColor" strokeWidth="1.4" />
          <path data-draw d="M 270 90 L 270 50 M 330 90 L 330 50" stroke="currentColor" strokeWidth="1.1" />
          <circle cx="300" cy="32" r="3" fill="currentColor" />
          {/* Signal waves */}
          <path data-draw d="M 360 90 Q 410 90 430 130 M 380 110 Q 415 110 425 140 M 240 90 Q 190 90 170 130 M 220 110 Q 185 110 175 140" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" />
          {/* Foundation depth */}
          <path data-draw d="M 230 530 L 230 555 L 370 555 L 370 530" fill="none" stroke="currentColor" strokeWidth="1" />
          {/* Dimension */}
          <path data-draw d="M 145 35 L 145 510 M 140 35 L 150 35 M 140 510 L 150 510" stroke="currentColor" strokeWidth="1" />
          <Label x={130} y={270} rotate={-90} anchor="middle">42,00 m</Label>
          <Label x={300} y={555} anchor="middle">PYLÔNE TYPE A</Label>
          <Callout x1={300} y1={35} x2={420} y2={60} text="Tête d'antenne" textX={420} textY={50} />
          <Callout x1={260} y1={290} x2={170} y2={260} text="Panneaux 4G/5G" textX={170} textY={250} />
          <Callout x1={350} y1={470} x2={460} y2={500} text="Cabinet RBS" textX={460} textY={490} />
        </g>

        {/* ENERGY — solar field cross-section */}
        <g ref={energyRef} className={COMMON_PATH_STROKE} style={{ display: active === "energy" ? "block" : "none" }}>
          {/* Ground */}
          <path data-draw d="M 60 470 L 540 470" stroke="currentColor" strokeWidth="2" />
          <path data-draw d="M 60 478 L 78 470 M 90 478 L 108 470 M 120 478 L 138 470 M 150 478 L 168 470 M 180 478 L 198 470 M 210 478 L 228 470 M 240 478 L 258 470 M 270 478 L 288 470 M 300 478 L 318 470 M 330 478 L 348 470 M 360 478 L 378 470 M 390 478 L 408 470 M 420 478 L 438 470 M 450 478 L 468 470 M 480 478 L 498 470 M 510 478 L 528 470" stroke="currentColor" strokeWidth="0.8" />
          {/* Panels — 4 rows angled */}
          {[0, 1, 2, 3].map((i) => (
            <g key={`panel-${i}`}>
              <path data-draw d={`M ${90 + i * 120} 410 L ${190 + i * 120} 360`} stroke="currentColor" strokeWidth="2.2" />
              {/* Panel cell lines */}
              <path data-draw d={`M ${110 + i * 120} 400 L ${175 + i * 120} 367`} stroke="currentColor" strokeWidth="0.6" />
              <path data-draw d={`M ${130 + i * 120} 390 L ${165 + i * 120} 372`} stroke="currentColor" strokeWidth="0.6" />
              {/* Supports */}
              <path data-draw d={`M ${110 + i * 120} 400 L ${110 + i * 120} 465 M ${170 + i * 120} 370 L ${170 + i * 120} 465`} stroke="currentColor" strokeWidth="1.2" />
            </g>
          ))}
          {/* Sun rays */}
          <circle data-draw cx="450" cy="130" r="38" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path data-draw d="M 450 60 L 450 75 M 450 185 L 450 200 M 380 130 L 395 130 M 505 130 L 520 130 M 402 82 L 412 92 M 488 82 L 478 92 M 402 178 L 412 168 M 488 178 L 478 168" stroke="currentColor" strokeWidth="1.4" />
          {/* Combiner box / inverter */}
          <path data-draw d="M 80 380 L 80 460 L 50 460 L 50 380 Z" fill="none" stroke="currentColor" strokeWidth="1.3" />
          <path data-draw d="M 50 410 L 80 410 M 50 430 L 80 430" stroke="currentColor" strokeWidth="0.8" />
          {/* Cable run */}
          <path data-draw d="M 80 440 Q 110 460 130 460 L 480 460" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          {/* Pole */}
          <path data-draw d="M 510 460 L 510 320 M 500 320 L 540 320 M 510 320 L 510 290 L 530 290" fill="none" stroke="currentColor" strokeWidth="1.6" />
          {/* Annotations */}
          <Label x={300} y={510} anchor="middle">CHAMP SOLAIRE · 220 kWc</Label>
          <Callout x1={140} y1={385} x2={70} y2={345} text="Onduleur 60 kW" textX={70} textY={335} />
          <Callout x1={450} y1={170} x2={530} y2={210} text="Irrad. 5,4 kWh/m²/j" textX={530} textY={200} />
          <Callout x1={520} y1={305} x2={480} y2={260} text="Raccord. réseau MT" textX={480} textY={250} />
        </g>

        {/* LOGISTICS — heavy truck profile */}
        <g ref={logisticsRef} className={COMMON_PATH_STROKE} style={{ display: active === "logistics" ? "block" : "none" }}>
          {/* Ground line */}
          <path data-draw d="M 40 470 L 560 470" stroke="currentColor" strokeWidth="2" />
          {/* Cab */}
          <path data-draw d="M 380 470 L 380 290 L 420 290 L 450 250 L 510 250 L 530 290 L 540 290 L 540 470" fill="none" stroke="currentColor" strokeWidth="2" />
          {/* Cab window */}
          <path data-draw d="M 425 295 L 450 263 L 503 263 L 522 290 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path data-draw d="M 465 263 L 465 295" stroke="currentColor" strokeWidth="0.8" />
          {/* Grille + headlight */}
          <path data-draw d="M 540 350 L 555 350 L 555 410 L 540 410 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle data-draw cx="547" cy="330" r="5" fill="none" stroke="currentColor" strokeWidth="1" />
          {/* Trailer */}
          <path data-draw d="M 50 470 L 50 280 L 380 280 L 380 470" fill="none" stroke="currentColor" strokeWidth="2" />
          <path data-draw d="M 50 320 L 380 320" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" />
          {/* Cargo hint — cylinders/pipes */}
          <path data-draw d="M 80 380 L 80 460 M 110 380 L 110 460 M 140 380 L 140 460 M 170 380 L 170 460 M 200 380 L 200 460 M 230 380 L 230 460 M 260 380 L 260 460 M 290 380 L 290 460 M 320 380 L 320 460 M 350 380 L 350 460" stroke="currentColor" strokeWidth="0.7" />
          <path data-draw d="M 65 380 L 365 380" stroke="currentColor" strokeWidth="1" />
          {/* Wheels */}
          <circle data-draw cx="100" cy="470" r="28" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <circle data-draw cx="100" cy="470" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle data-draw cx="180" cy="470" r="28" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <circle data-draw cx="180" cy="470" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle data-draw cx="290" cy="470" r="28" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <circle data-draw cx="290" cy="470" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle data-draw cx="430" cy="470" r="32" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <circle data-draw cx="430" cy="470" r="12" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle data-draw cx="510" cy="470" r="32" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <circle data-draw cx="510" cy="470" r="12" fill="none" stroke="currentColor" strokeWidth="1" />
          {/* Dimension */}
          <path data-draw d="M 50 540 L 555 540 M 50 535 L 50 545 M 555 535 L 555 545" stroke="currentColor" strokeWidth="1" />
          <Label x={300} y={535} anchor="middle">16,80 m</Label>
          <Callout x1={200} y1={300} x2={120} y2={220} text="Charge utile 32 t" textX={120} textY={210} />
          <Callout x1={485} y1={290} x2={550} y2={210} text="Tracteur 8×4" textX={550} textY={200} />
          <Callout x1={290} y1={500} x2={250} y2={560} text="Essieux tridem" textX={250} textY={580} />
        </g>

        {/* TRAINING — classroom plan + certificate */}
        <g ref={trainingRef} className={COMMON_PATH_STROKE} style={{ display: active === "training" ? "block" : "none" }}>
          {/* Room outline */}
          <path data-draw d="M 80 130 L 420 130 L 420 470 L 80 470 Z" fill="none" stroke="currentColor" strokeWidth="2" />
          {/* Door */}
          <path data-draw d="M 80 410 L 80 470" stroke="white" strokeWidth="4" />
          <path data-draw d="M 80 410 A 60 60 0 0 1 140 470" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
          {/* Whiteboard */}
          <path data-draw d="M 110 130 L 110 150 L 390 150 L 390 130" fill="none" stroke="currentColor" strokeWidth="1.4" />
          {/* Instructor desk */}
          <path data-draw d="M 220 175 L 280 175 L 280 200 L 220 200 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
          {/* Student desks — 4×3 */}
          {[0, 1, 2].map((row) =>
            [0, 1, 2, 3].map((col) => (
              <g key={`desk-${row}-${col}`}>
                <path data-draw d={`M ${110 + col * 75} ${250 + row * 65} L ${165 + col * 75} ${250 + row * 65} L ${165 + col * 75} ${280 + row * 65} L ${110 + col * 75} ${280 + row * 65} Z`} fill="none" stroke="currentColor" strokeWidth="1" />
                <circle data-draw cx={137 + col * 75} cy={300 + row * 65} r="5" fill="none" stroke="currentColor" strokeWidth="0.8" />
              </g>
            ))
          )}
          {/* Certificate side panel */}
          <path data-draw d="M 450 180 L 560 180 L 560 360 L 450 360 Z" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path data-draw d="M 470 215 L 540 215 M 470 235 L 540 235 M 470 255 L 530 255" stroke="currentColor" strokeWidth="0.9" />
          <circle data-draw cx="505" cy="305" r="22" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path data-draw d="M 495 305 L 502 314 L 518 295" stroke="currentColor" strokeWidth="1.6" />
          {/* Dim */}
          <path data-draw d="M 80 510 L 420 510 M 80 505 L 80 515 M 420 505 L 420 515" stroke="currentColor" strokeWidth="1" />
          <Label x={250} y={505} anchor="middle">12,00 m</Label>
          <Label x={250} y={165} anchor="middle">TABLEAU</Label>
          <Label x={505} y={200} anchor="middle">CERTIFICAT</Label>
          <Label x={505} y={355} anchor="middle">ISO 21001</Label>
          <Callout x1={250} y1={185} x2={350} y2={120} text="Capacité 12 stagiaires" textX={350} textY={110} />
          <Callout x1={120} y1={440} x2={50} y2={400} text="Accès PMR" textX={50} textY={390} />
        </g>

        {/* North arrow / compass — bottom-left of canvas */}
        <g transform="translate(80,556)" className="text-ink-2">
          <circle r="14" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <path d="M 0 -10 L 4 0 L 0 10 L -4 0 Z" fill="currentColor" />
          <text x="0" y="-18" fontFamily="var(--font-mono, monospace)" fontSize="8" letterSpacing="2" fill="currentColor" textAnchor="middle">N</text>
        </g>

        {/* Wax seal stamp — bottom-right */}
        <g transform="translate(520,560)" opacity="0.85">
          <circle r="22" fill="#a3361f" />
          <circle r="22" fill="none" stroke="#621d10" strokeWidth="1.2" strokeDasharray="2 2" />
          <text y="-2" fontFamily="var(--font-serif, serif)" fontSize="9" fill="#fff5e5" textAnchor="middle" fontStyle="italic">PRISE</text>
          <text y="10" fontFamily="var(--font-sans, sans-serif)" fontSize="6" letterSpacing="2" fill="#fff5e5" textAnchor="middle">SARL · CD</text>
        </g>
      </svg>

      {/* Bottom legend strip */}
      <div className="absolute left-4 right-4 bottom-3 flex items-center justify-between text-[9px] tracking-[0.22em] uppercase text-ink-2 font-semibold">
        <span>{meta.subject}</span>
        <span>{meta.date}</span>
      </div>
    </div>
  );
}

/** Small SVG label with monospace technical feel. */
function Label({
  x,
  y,
  rotate = 0,
  anchor = "start",
  children,
}: {
  x: number;
  y: number;
  rotate?: number;
  anchor?: "start" | "middle" | "end";
  children: React.ReactNode;
}) {
  return (
    <text
      data-label
      x={x}
      y={y}
      fontSize="9"
      letterSpacing="1.5"
      fill="currentColor"
      textAnchor={anchor}
      fontFamily="var(--font-mono, monospace)"
      transform={rotate ? `rotate(${rotate} ${x} ${y})` : undefined}
    >
      {children}
    </text>
  );
}

/** Annotated callout: a leader line + label. */
function Callout({
  x1, y1, x2, y2,
  text,
  textX,
  textY,
}: { x1: number; y1: number; x2: number; y2: number; text: string; textX: number; textY: number }) {
  return (
    <g data-label>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.7" />
      <circle cx={x1} cy={y1} r="1.8" fill="currentColor" />
      <text x={textX} y={textY} fontSize="8.5" letterSpacing="1" fontFamily="var(--font-mono, monospace)" fill="currentColor">
        {text}
      </text>
    </g>
  );
}

function CornerMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`absolute w-5 h-5 text-ink-2 ${className}`}
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
