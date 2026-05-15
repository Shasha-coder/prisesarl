"use client";

import { forwardRef, useEffect, useRef, useImperativeHandle } from "react";
import gsap from "gsap";

/**
 * AgentLauncher — the bottom-right button that opens Ernest.
 *
 * It's *not* a generic chat bubble. Layers, from outside in:
 *   1. A breathing cyan halo (radial gradient, infinite).
 *   2. An outer ring with four compass tick marks that slowly rotates,
 *      faster on hover.
 *   3. A drawn-in inner ring with a north-pointing arrow that sweeps.
 *   4. A small face silhouette in the centre — a stylised draftsman's
 *      head — that gently breathes.
 *   5. A "live" dot at the top-right that pulses (suggesting the agent
 *      is on duty), and an inner cyan dot at the bottom-right tracking
 *      audio energy when voice mode is open.
 *
 * The whole thing is inline SVG animated with GSAP — no Rive file, no
 * raster image, ~3 KB on the wire.
 */

export interface AgentLauncherHandle {
  /** Briefly pulse the launcher (call when Ernest wants attention). */
  ping: () => void;
}

interface Props {
  onClick: () => void;
  hidden?: boolean;
  ariaLabel?: string;
}

export const AgentLauncher = forwardRef<AgentLauncherHandle, Props>(
  function AgentLauncher({ onClick, hidden, ariaLabel = "Ouvrir Ernest" }, ref) {
    const rootRef = useRef<HTMLButtonElement>(null);
    const outerRingRef = useRef<SVGGElement>(null);
    const innerArrowRef = useRef<SVGGElement>(null);
    const faceRef = useRef<SVGGElement>(null);
    const haloRef = useRef<SVGCircleElement>(null);
    const pulseRef = useRef<SVGCircleElement>(null);
    const liveDotRef = useRef<SVGCircleElement>(null);

    useImperativeHandle(ref, () => ({
      ping: () => {
        if (!rootRef.current) return;
        gsap.fromTo(
          rootRef.current,
          { scale: 1 },
          { scale: 1.18, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" }
        );
      },
    }));

    useEffect(() => {
      const outerRing = outerRingRef.current;
      const innerArrow = innerArrowRef.current;
      const face = faceRef.current;
      const halo = haloRef.current;
      const pulse = pulseRef.current;
      const liveDot = liveDotRef.current;

      if (!outerRing || !innerArrow || !face || !halo || !pulse || !liveDot) return;

      // Continuous rotations
      const tweens: gsap.core.Tween[] = [];

      tweens.push(
        gsap.to(outerRing, {
          rotation: 360,
          transformOrigin: "32px 32px",
          duration: 22,
          ease: "none",
          repeat: -1,
        })
      );
      tweens.push(
        gsap.to(innerArrow, {
          rotation: -360,
          transformOrigin: "32px 32px",
          duration: 9,
          ease: "none",
          repeat: -1,
        })
      );

      // Halo breathe
      tweens.push(
        gsap.to(halo, {
          attr: { r: 30 },
          opacity: 0.15,
          duration: 1.8,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        })
      );

      // Outer pulse ring — expands and fades, restarts every 2.6s
      gsap.set(pulse, { attr: { r: 22 }, opacity: 0.55 });
      const pulseTl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });
      pulseTl.to(pulse, {
        attr: { r: 38 },
        opacity: 0,
        duration: 2.2,
        ease: "power2.out",
      });
      tweens.push(pulseTl as unknown as gsap.core.Tween);

      // Face subtle breathe
      tweens.push(
        gsap.to(face, {
          scale: 1.04,
          transformOrigin: "32px 34px",
          duration: 2.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        })
      );

      // Live dot blink
      tweens.push(
        gsap.to(liveDot, {
          opacity: 0.3,
          duration: 1.1,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        })
      );

      // Hover acceleration
      const root = rootRef.current;
      let hoverTween: gsap.core.Tween | null = null;
      const onEnter = () => {
        hoverTween = gsap.to(outerRing, {
          timeScale: 3,
          duration: 0.4,
        });
        gsap.to(rootRef.current, { scale: 1.08, duration: 0.3, ease: "power3.out" });
      };
      const onLeave = () => {
        hoverTween?.kill();
        gsap.to(outerRing, { timeScale: 1, duration: 0.6 });
        gsap.to(rootRef.current, { scale: 1, duration: 0.3, ease: "power3.out" });
      };
      root?.addEventListener("mouseenter", onEnter);
      root?.addEventListener("mouseleave", onLeave);

      return () => {
        tweens.forEach((tw) => tw.kill());
        root?.removeEventListener("mouseenter", onEnter);
        root?.removeEventListener("mouseleave", onLeave);
      };
    }, []);

    return (
      <button
        ref={rootRef}
        onClick={onClick}
        aria-label={ariaLabel}
        className={`fixed right-[22px] bottom-[90px] z-[55] w-[64px] h-[64px] rounded-full transition-opacity duration-300 ${
          hidden ? "opacity-0 pointer-events-none scale-90" : ""
        }`}
        style={{
          background:
            "radial-gradient(circle at 30% 25%, #1f4480 0%, #0a2240 55%, #061533 100%)",
          boxShadow:
            "0 14px 38px -10px rgba(43,183,220,0.55), inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 -8px 16px rgba(0,0,0,0.35)",
        }}
      >
        <svg viewBox="0 0 64 64" className="absolute inset-0 w-full h-full">
          <defs>
            <radialGradient id="agentHalo" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="rgba(43,183,220,0.55)" />
              <stop offset="100%" stopColor="rgba(43,183,220,0)" />
            </radialGradient>
            <linearGradient id="agentFace" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbeacb" />
              <stop offset="100%" stopColor="#d6b88a" />
            </linearGradient>
          </defs>

          {/* Halo */}
          <circle ref={haloRef} cx="32" cy="32" r="22" fill="url(#agentHalo)" />

          {/* Outer expanding pulse */}
          <circle ref={pulseRef} cx="32" cy="32" r="22" fill="none" stroke="#2BB7DC" strokeWidth="1" />

          {/* Outer rotating ring with tick marks */}
          <g ref={outerRingRef}>
            <circle cx="32" cy="32" r="24" fill="none" stroke="rgba(246,241,230,0.18)" strokeWidth="0.6" strokeDasharray="2 3" />
            {/* Compass ticks */}
            <line x1="32" y1="6"  x2="32" y2="10" stroke="#f5b400" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="58" y1="32" x2="54" y2="32" stroke="rgba(246,241,230,0.4)" strokeWidth="0.9" strokeLinecap="round" />
            <line x1="32" y1="58" x2="32" y2="54" stroke="rgba(246,241,230,0.4)" strokeWidth="0.9" strokeLinecap="round" />
            <line x1="6"  y1="32" x2="10" y2="32" stroke="rgba(246,241,230,0.4)" strokeWidth="0.9" strokeLinecap="round" />
            {/* Tiny dot near north tick */}
            <circle cx="32" cy="6" r="1.2" fill="#f5b400" />
          </g>

          {/* Inner counter-rotating arrow (compass needle) */}
          <g ref={innerArrowRef}>
            <circle cx="32" cy="32" r="17" fill="none" stroke="rgba(246,241,230,0.22)" strokeWidth="0.7" />
            <path d="M 32 16 L 35 32 L 32 30 L 29 32 Z" fill="#2BB7DC" />
            <path d="M 32 48 L 35 32 L 32 34 L 29 32 Z" fill="rgba(246,241,230,0.45)" />
          </g>

          {/* Centre face silhouette */}
          <g ref={faceRef}>
            <circle cx="32" cy="32" r="11" fill="url(#agentFace)" stroke="rgba(10,34,64,0.55)" strokeWidth="0.5" />
            <circle cx="29.5" cy="30" r="1" fill="#0a2240" />
            <circle cx="34.5" cy="30" r="1" fill="#0a2240" />
            <path d="M 28 36 Q 32 38.5 36 36" fill="none" stroke="#0a2240" strokeWidth="0.9" strokeLinecap="round" />
          </g>

          {/* Live dot — top-right */}
          <circle ref={liveDotRef} cx="50" cy="14" r="3" fill="#f5b400" stroke="#0a2240" strokeWidth="1" />
        </svg>
      </button>
    );
  }
);
