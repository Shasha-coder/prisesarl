"use client";

import { useEffect, useRef } from "react";

/**
 * AvatarSVG — clean radial voice spectrum.
 *
 * Stripped-back version: a single circular core that pulses with the
 * live audio level, surrounded by a 56-bar radial frequency halo, on a
 * blueprint backdrop with corner registration marks and dimension
 * callouts. No orbital rings. Reads as a focused voice instrument.
 */

interface Props {
  audioLevel: number;
  active: boolean;
  className?: string;
}

const BAR_COUNT = 56;

export function AvatarSVG({ audioLevel, active, className }: Props) {
  const audioRef = useRef(audioLevel);
  const activeRef = useRef(active);
  useEffect(() => { audioRef.current = audioLevel; });
  useEffect(() => { activeRef.current = active; });

  const coreRef = useRef<SVGCircleElement>(null);
  const coreGlowRef = useRef<SVGCircleElement>(null);
  const haloBarsRef = useRef<SVGGElement>(null);
  const pulseRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let raf = 0;
    let smoothed = 0;
    let pulseStart = performance.now();

    // Pre-computed per-bar phase so render is pure + balanced across the ring.
    const phases = Array.from({ length: BAR_COUNT }, (_, i) =>
      0.35 + 0.65 * Math.abs(Math.sin(i * 0.81 + 0.6))
    );

    const tick = (now: number) => {
      smoothed = smoothed * 0.78 + audioRef.current * 0.22;
      const level = Math.max(0, Math.min(1, smoothed));
      const intensity = activeRef.current ? 1 : 0.4;

      // Core: scale with audio
      if (coreRef.current) {
        const r = 16 + level * 8 * intensity;
        coreRef.current.setAttribute("r", String(r));
      }
      if (coreGlowRef.current) {
        const r = 26 + level * 14;
        coreGlowRef.current.setAttribute("r", String(r));
        coreGlowRef.current.setAttribute("opacity", String(0.4 + level * 0.4));
      }

      // Halo bars
      if (haloBarsRef.current) {
        const children = haloBarsRef.current.children;
        for (let i = 0; i < children.length; i++) {
          const el = children[i] as SVGLineElement;
          const phase = phases[i];
          const dyn = level * 20 * phase * intensity + 2;
          const angle = (i / BAR_COUNT) * Math.PI * 2;
          const r1 = 80;
          const r2 = 80 + dyn;
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

      // Outer pulse ring — every 2.4s
      if (pulseRef.current) {
        const elapsed = (now - pulseStart) / 1000;
        if (elapsed > 2.4) pulseStart = now;
        const tp = (elapsed % 2.4) / 2.4;
        pulseRef.current.setAttribute("r", String(56 + tp * 60));
        pulseRef.current.setAttribute("opacity", String((1 - tp) * 0.45));
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

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
        <radialGradient id="coreGlowGrad" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(43,183,220,0.6)" />
          <stop offset="100%" stopColor="rgba(43,183,220,0)" />
        </radialGradient>
        <filter id="coreBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="b" />
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
      <circle ref={pulseRef} cx="120" cy="120" r="56" fill="none" stroke="#2BB7DC" strokeWidth="0.9" />

      {/* Soft core glow (behind bars) */}
      <circle ref={coreGlowRef} cx="120" cy="120" r="26" fill="url(#coreGlowGrad)" />

      {/* Halo frequency bars */}
      <g ref={haloBarsRef} stroke="#2BB7DC" strokeWidth="1.4" strokeLinecap="round">
        {Array.from({ length: BAR_COUNT }).map((_, i) => {
          const angle = (i / BAR_COUNT) * Math.PI * 2;
          const x = 120 + Math.cos(angle) * 80;
          const y = 120 + Math.sin(angle) * 80;
          return <line key={i} x1={x} y1={y} x2={x} y2={y} />;
        })}
      </g>

      {/* Core */}
      <circle ref={coreRef} cx="120" cy="120" r="16" fill="url(#presenceCore)" filter="url(#coreBlur)" />
      <circle cx="115" cy="115" r="3" fill="rgba(255,255,255,0.9)" />
    </svg>
  );
}
