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
      preserveAspectRatio="xMidYMid meet"
      className={className}
      role="img"
      aria-label="Ernest, présence vocale"
    >
      <defs>
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

      {/* Outer expanding pulse */}
      <circle ref={pulseRef} cx="120" cy="120" r="56" fill="none" stroke="#2BB7DC" strokeWidth="0.9" />

      {/* Soft core glow */}
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
