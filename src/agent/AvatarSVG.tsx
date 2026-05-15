"use client";

import { useEffect, useRef } from "react";

/**
 * AvatarSVG — abstract presence visualizer used when the 3D GLB can't load.
 *
 * Replaces the previous cartoon face with a sophisticated audio-reactive
 * "voice canvas" that belongs in the same visual world as the rest of
 * the engineering site: a circular core inside concentric orbital arcs,
 * surrounded by a radial frequency-bar halo and four blueprint dimension
 * callouts. Reads as "AI presence" rather than "fake person".
 *
 * Everything reacts to:
 *   • audio level — core scale, halo bar heights, particle radius
 *   • active flag — orbital speed, brightness
 */

interface Props {
  audioLevel: number;
  active: boolean;
  className?: string;
}

const BAR_COUNT = 48; // bars around the perimeter

export function AvatarSVG({ audioLevel, active, className }: Props) {
  const audioRef = useRef(audioLevel);
  const activeRef = useRef(active);
  useEffect(() => { audioRef.current = audioLevel; });
  useEffect(() => { activeRef.current = active; });

  const coreRef = useRef<SVGCircleElement>(null);
  const innerRingRef = useRef<SVGCircleElement>(null);
  const orbit1Ref = useRef<SVGGElement>(null);
  const orbit2Ref = useRef<SVGGElement>(null);
  const orbit3Ref = useRef<SVGGElement>(null);
  const haloBarsRef = useRef<SVGGElement>(null);
  const pulseRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let raf = 0;
    let smoothed = 0;
    let t0 = performance.now();
    let pulseStart = t0;

    // Pre-compute deterministic phases per bar so render is pure.
    const phases = Array.from({ length: BAR_COUNT }, (_, i) =>
      0.35 + 0.65 * Math.abs(Math.sin(i * 0.81 + 0.6))
    );

    const tick = (now: number) => {
      const dt = Math.max((now - t0) / 1000, 1 / 60);
      t0 = now;
      smoothed = smoothed * 0.78 + audioRef.current * 0.22;
      const level = Math.max(0, Math.min(1, smoothed));
      const intensity = activeRef.current ? 1 : 0.45;

      // Core — pulse with audio
      if (coreRef.current) {
        const r = 18 + level * 8 * intensity;
        coreRef.current.setAttribute("r", String(r));
      }
      if (innerRingRef.current) {
        const r = 32 + level * 4;
        innerRingRef.current.setAttribute("r", String(r));
        innerRingRef.current.setAttribute("opacity", String(0.55 + level * 0.35));
      }

      // Orbit rotations (manual rotation to keep frame-rate independence)
      const speed1 = (0.06 + level * 0.18) * intensity;
      const speed2 = (0.09 + level * 0.22) * intensity;
      const speed3 = (0.04 + level * 0.12) * intensity;
      if (orbit1Ref.current) {
        const prev = parseFloat(orbit1Ref.current.dataset.rot || "0");
        const next = prev + speed1 * dt * 60;
        orbit1Ref.current.dataset.rot = String(next);
        orbit1Ref.current.setAttribute("transform", `rotate(${next} 120 120)`);
      }
      if (orbit2Ref.current) {
        const prev = parseFloat(orbit2Ref.current.dataset.rot || "0");
        const next = prev - speed2 * dt * 60;
        orbit2Ref.current.dataset.rot = String(next);
        orbit2Ref.current.setAttribute("transform", `rotate(${next} 120 120)`);
      }
      if (orbit3Ref.current) {
        const prev = parseFloat(orbit3Ref.current.dataset.rot || "0");
        const next = prev + speed3 * dt * 60;
        orbit3Ref.current.dataset.rot = String(next);
        orbit3Ref.current.setAttribute("transform", `rotate(${next} 120 120)`);
      }

      // Halo bars — vary length per bar
      if (haloBarsRef.current) {
        const children = haloBarsRef.current.children;
        for (let i = 0; i < children.length; i++) {
          const el = children[i] as SVGLineElement;
          const phase = phases[i];
          const dyn = level * 18 * phase * intensity + 2;
          // Bar starts at outer-radius and grows outward
          const r1 = 96;
          const r2 = 96 + dyn;
          const angle = (i / BAR_COUNT) * Math.PI * 2;
          const x1 = 120 + Math.cos(angle) * r1;
          const y1 = 120 + Math.sin(angle) * r1;
          const x2 = 120 + Math.cos(angle) * r2;
          const y2 = 120 + Math.sin(angle) * r2;
          el.setAttribute("x1", x1.toFixed(2));
          el.setAttribute("y1", y1.toFixed(2));
          el.setAttribute("x2", x2.toFixed(2));
          el.setAttribute("y2", y2.toFixed(2));
        }
      }

      // Outer pulse ring — every 2.4 s expand + fade
      if (pulseRef.current) {
        const elapsed = (now - pulseStart) / 1000;
        if (elapsed > 2.4) pulseStart = now;
        const tp = (elapsed % 2.4) / 2.4;
        const r = 60 + tp * 60;
        const op = (1 - tp) * 0.5;
        pulseRef.current.setAttribute("r", String(r));
        pulseRef.current.setAttribute("opacity", String(op));
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, []);

  const bars = Array.from({ length: BAR_COUNT });

  return (
    <svg
      viewBox="0 0 240 240"
      className={className}
      role="img"
      aria-label="Ernest, présence vocale"
    >
      <defs>
        <radialGradient id="presenceBg" cx="0.5" cy="0.5" r="0.55">
          <stop offset="0%" stopColor="#102648" />
          <stop offset="60%" stopColor="#0a2240" />
          <stop offset="100%" stopColor="#061533" />
        </radialGradient>
        <radialGradient id="presenceCore" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0%" stopColor="#bff0ff" />
          <stop offset="55%" stopColor="#4FC8E2" />
          <stop offset="100%" stopColor="#2BB7DC" />
        </radialGradient>
        <linearGradient id="orbitStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(43,183,220,0.0)" />
          <stop offset="50%" stopColor="rgba(43,183,220,0.85)" />
          <stop offset="100%" stopColor="rgba(43,183,220,0.0)" />
        </linearGradient>
        <linearGradient id="orbitStrokeGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(245,180,0,0.0)" />
          <stop offset="50%" stopColor="rgba(245,180,0,0.75)" />
          <stop offset="100%" stopColor="rgba(245,180,0,0.0)" />
        </linearGradient>
        <filter id="coreGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect x="0" y="0" width="240" height="240" fill="url(#presenceBg)" />
      {/* Faint blueprint grid */}
      <g stroke="rgba(246,241,230,0.04)" strokeWidth="0.4">
        {[20, 60, 100, 140, 180, 220].map((p) => (
          <g key={p}>
            <line x1={p} y1="0" x2={p} y2="240" />
            <line x1="0" y1={p} x2="240" y2={p} />
          </g>
        ))}
      </g>

      {/* Corner blueprint marks */}
      <g stroke="rgba(246,241,230,0.4)" strokeWidth="0.7" fill="none">
        <path d="M 10 18 L 18 18 L 18 10" />
        <path d="M 230 18 L 222 18 L 222 10" />
        <path d="M 10 222 L 18 222 L 18 230" />
        <path d="M 230 222 L 222 222 L 222 230" />
      </g>

      {/* Dimension callouts */}
      <g fontFamily="var(--font-mono, monospace)" fontSize="6.5" letterSpacing="1.6" fill="rgba(246,241,230,0.55)">
        <text x="14" y="14">ERN-01</text>
        <text x="226" y="14" textAnchor="end">LIVE</text>
        <text x="14" y="232">CH·01</text>
        <text x="226" y="232" textAnchor="end">PRISE·SARL</text>
      </g>

      {/* Outer expanding pulse */}
      <circle ref={pulseRef} cx="120" cy="120" r="60" fill="none" stroke="#2BB7DC" strokeWidth="0.9" />

      {/* Halo frequency bars */}
      <g ref={haloBarsRef} stroke="#2BB7DC" strokeWidth="1.4" strokeLinecap="round">
        {bars.map((_, i) => {
          const angle = (i / BAR_COUNT) * Math.PI * 2;
          const x = 120 + Math.cos(angle) * 96;
          const y = 120 + Math.sin(angle) * 96;
          return <line key={i} x1={x} y1={y} x2={x} y2={y} />;
        })}
      </g>

      {/* Orbit 3 — outermost gold dashed */}
      <g ref={orbit3Ref}>
        <circle cx="120" cy="120" r="78" fill="none" stroke="url(#orbitStrokeGold)" strokeWidth="0.8" strokeDasharray="2 6" />
        <circle cx="198" cy="120" r="2.2" fill="#f5b400" />
      </g>

      {/* Orbit 2 — middle solid cyan */}
      <g ref={orbit2Ref}>
        <circle cx="120" cy="120" r="64" fill="none" stroke="url(#orbitStroke)" strokeWidth="1.2" />
        <circle cx="184" cy="120" r="3" fill="#4FC8E2" />
      </g>

      {/* Inner ring (pulses with audio) */}
      <circle ref={innerRingRef} cx="120" cy="120" r="32" fill="none" stroke="rgba(191,240,255,0.6)" strokeWidth="0.6" />

      {/* Orbit 1 — innermost with small ticks */}
      <g ref={orbit1Ref}>
        <circle cx="120" cy="120" r="44" fill="none" stroke="rgba(246,241,230,0.18)" strokeWidth="0.5" strokeDasharray="1 4" />
        <line x1="120" y1="76" x2="120" y2="80" stroke="#f5b400" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="120" y1="164" x2="120" y2="160" stroke="rgba(246,241,230,0.5)" strokeWidth="1.1" strokeLinecap="round" />
        <line x1="76" y1="120" x2="80" y2="120" stroke="rgba(246,241,230,0.5)" strokeWidth="1.1" strokeLinecap="round" />
        <line x1="164" y1="120" x2="160" y2="120" stroke="rgba(246,241,230,0.5)" strokeWidth="1.1" strokeLinecap="round" />
      </g>

      {/* Core */}
      <circle ref={coreRef} cx="120" cy="120" r="18" fill="url(#presenceCore)" filter="url(#coreGlow)" />
      <circle cx="115" cy="115" r="3.5" fill="rgba(255,255,255,0.85)" />
    </svg>
  );
}
