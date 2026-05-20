"use client";

import { forwardRef, useEffect, useRef, useImperativeHandle } from "react";
import gsap from "gsap";

/**
 * AgentLauncher — Redesigned Cyber-Compass Button.
 *
 * Layers and elements designed to WOW at first glance:
 *   1. Breathing holographic halo backing (radial cyan neon).
 *   2. Expandable glassmorphic compass ring that accelerates on hover.
 *   3. Golden "LIVE" dot tracking duty status with a subtle radar sweeping ring.
 *   4. Elegant technical markings (`ERN-01`, compass ticks).
 */

export interface AgentLauncherHandle {
  /** Briefly pulse the launcher (attention grabber) */
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
          { 
            scale: 1.25, 
            duration: 0.22, 
            yoyo: true, 
            repeat: 1, 
            ease: "elastic.out(1.2, 0.4)",
            boxShadow: "0 0 40px rgba(43,183,220,0.85)"
          }
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

      const tweens: gsap.core.Tween[] = [];

      // Continuous rotation - opposite directions for cybernetic mechanical feel
      tweens.push(
        gsap.to(outerRing, {
          rotation: 360,
          transformOrigin: "32px 32px",
          duration: 18,
          ease: "none",
          repeat: -1,
        })
      );
      tweens.push(
        gsap.to(innerArrow, {
          rotation: -360,
          transformOrigin: "32px 32px",
          duration: 8,
          ease: "none",
          repeat: -1,
        })
      );

      // Cybernetic glow breath
      tweens.push(
        gsap.to(halo, {
          attr: { r: 29 },
          opacity: 0.28,
          duration: 1.6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        })
      );

      // Expanding radar wave
      gsap.set(pulse, { attr: { r: 22 }, opacity: 0.7 });
      const pulseTl = gsap.timeline({ repeat: -1, repeatDelay: 0.2 });
      pulseTl.to(pulse, {
        attr: { r: 42 },
        opacity: 0,
        duration: 1.8,
        ease: "power2.out",
      });
      tweens.push(pulseTl as unknown as gsap.core.Tween);

      // Centre face subtle depth breathing
      tweens.push(
        gsap.to(face, {
          scale: 1.08,
          transformOrigin: "32px 32px",
          duration: 2.0,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        })
      );

      // Live status dot quick neon flicker
      tweens.push(
        gsap.to(liveDot, {
          opacity: 0.4,
          duration: 0.8,
          ease: "rough({template: none.out, strength: 1, points: 20, taper: none, randomize: true, clamp: true})",
          yoyo: true,
          repeat: -1,
        })
      );

      // Ultra-premium magnetic acceleration hover triggers
      const root = rootRef.current;
      let hoverTween: gsap.core.Tween | null = null;
      
      const onEnter = () => {
        hoverTween = gsap.to(outerRing, {
          timeScale: 4.5,
          duration: 0.4,
          ease: "power2.out",
        });
        gsap.to(innerArrow, {
          timeScale: 3.0,
          duration: 0.4,
          ease: "power2.out",
        });
        gsap.to(rootRef.current, { 
          scale: 1.12, 
          duration: 0.35, 
          ease: "back.out(1.7)",
          boxShadow: "0 20px 45px rgba(43,183,220,0.65), inset 0 0 15px rgba(43,183,220,0.5)"
        });
      };
      
      const onLeave = () => {
        hoverTween?.kill();
        gsap.to(outerRing, { timeScale: 1, duration: 0.8, ease: "power2.out" });
        gsap.to(innerArrow, { timeScale: 1, duration: 0.8, ease: "power2.out" });
        gsap.to(rootRef.current, { 
          scale: 1, 
          duration: 0.4, 
          ease: "power3.out",
          boxShadow: "0 10px 30px -5px rgba(43,183,220,0.45), inset 0 0 0px rgba(43,183,220,0)"
        });
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
            "radial-gradient(circle at 35% 30%, #061e3d 0%, #030a14 70%, #010408 100%)",
          border: "1px solid rgba(43, 183, 220, 0.4)",
          boxShadow:
            "0 10px 30px -5px rgba(43,183,220,0.45), inset 0 2px 4px rgba(255,255,255,0.06), inset 0 -6px 12px rgba(0,0,0,0.5)",
        }}
      >
        <svg viewBox="0 0 64 64" className="absolute inset-0 w-full h-full">
          <defs>
            <radialGradient id="cyberHalo" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="rgba(43,183,220,0.7)" />
              <stop offset="60%" stopColor="rgba(43,183,220,0.15)" />
              <stop offset="100%" stopColor="rgba(43,183,220,0)" />
            </radialGradient>
            
            <radialGradient id="cyberCore" cx="0.5" cy="0.4" r="0.5">
              <stop offset="0%" stopColor="#d2f7ff" />
              <stop offset="60%" stopColor="#00d4ff" />
              <stop offset="100%" stopColor="#0a466b" />
            </radialGradient>

            <filter id="launcherGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Glowing Aura Backup */}
          <circle ref={haloRef} cx="32" cy="32" r="22" fill="url(#cyberHalo)" />

          {/* Sweeping Radar Rings */}
          <circle ref={pulseRef} cx="32" cy="32" r="22" fill="none" stroke="#00d4ff" strokeWidth="1.2" filter="url(#launcherGlow)" />

          {/* Rotating Dotted Compass Ticks */}
          <g ref={outerRingRef}>
            <circle cx="32" cy="32" r="25.5" fill="none" stroke="rgba(0,212,255,0.22)" strokeWidth="0.8" strokeDasharray="2 4" />
            {/* North Indicator Needle */}
            <line x1="32" y1="5" x2="32" y2="9" stroke="#f5b400" strokeWidth="1.5" strokeLinecap="round" filter="url(#launcherGlow)" />
            {/* Compass Axes */}
            <line x1="59" y1="32" x2="55" y2="32" stroke="rgba(0,212,255,0.5)" strokeWidth="0.8" />
            <line x1="32" y1="59" x2="32" y2="55" stroke="rgba(0,212,255,0.5)" strokeWidth="0.8" />
            <line x1="5" y1="32" x2="9" y2="32" stroke="rgba(0,212,255,0.5)" strokeWidth="0.8" />
          </g>

          {/* Counter-rotating Dial */}
          <g ref={innerArrowRef}>
            <circle cx="32" cy="32" r="18" fill="none" stroke="rgba(0,212,255,0.15)" strokeWidth="0.6" />
            {/* Holographic Arrow */}
            <path d="M 32 18 L 35 32 L 32 30 L 29 32 Z" fill="#00d4ff" filter="url(#launcherGlow)" />
            <path d="M 32 46 L 35 32 L 32 34 L 29 32 Z" fill="rgba(255,255,255,0.4)" />
          </g>

          {/* Inner Glowing Core Capsule */}
          <g ref={faceRef}>
            <circle cx="32" cy="32" r="10" fill="url(#cyberCore)" stroke="rgba(3,10,20,0.8)" strokeWidth="0.8" filter="url(#launcherGlow)" />
            {/* Dynamic drafting crosshairs */}
            <line x1="28" y1="32" x2="36" y2="32" stroke="#fff" strokeWidth="0.5" />
            <line x1="32" y1="28" x2="32" y2="36" stroke="#fff" strokeWidth="0.5" />
          </g>

          {/* Glowing Green "ON DUTY" Dot */}
          <circle ref={liveDotRef} cx="49" cy="15" r="3" fill="#f5b400" stroke="#030a14" strokeWidth="1" filter="url(#launcherGlow)" />
        </svg>
      </button>
    );
  }
);

