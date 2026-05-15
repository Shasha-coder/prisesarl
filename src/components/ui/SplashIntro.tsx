"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const SESSION_FLAG = "prise.splash.seen";

/**
 * SplashIntro — first-paint cinematic.
 *
 * Draws the PRISE wordmark letter-by-letter on top of a paper backdrop,
 * then sweeps off-screen. Plays once per browser tab (sessionStorage).
 *
 * State-free: we render the splash unconditionally and let the mount
 * effect decide whether to animate it or hide it instantly. This sidesteps
 * React 19's "setState in effect" rule.
 */
export function SplashIntro() {
  const rootRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<SVGSVGElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const word = wordRef.current;
    if (!root || !word) return;

    let seen = false;
    try { seen = !!window.sessionStorage.getItem(SESSION_FLAG); } catch {}

    if (seen) {
      root.style.display = "none";
      return;
    }

    const paths = word.querySelectorAll<SVGPathElement>("path");
    paths.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = String(len);
      p.style.strokeDashoffset = String(len);
    });

    const tl = gsap.timeline({
      onComplete: () => {
        try { window.sessionStorage.setItem(SESSION_FLAG, "1"); } catch {}
        if (root) root.style.display = "none";
      },
    });

    tl.to(paths, {
      strokeDashoffset: 0,
      duration: 1.1,
      ease: "power2.inOut",
      stagger: 0.12,
    });
    tl.to(paths, { fill: "currentColor", duration: 0.35, ease: "power2.out" }, "-=0.25");
    tl.fromTo(
      taglineRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      "-=0.3"
    );
    tl.to({}, { duration: 0.55 });
    tl.to(root, {
      yPercent: -100,
      duration: 0.85,
      ease: "expo.inOut",
    });

    return () => { tl.kill(); };
  }, []);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] grid place-items-center paper-texture overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-blueprint mask-radial opacity-90 pointer-events-none" />

      <div className="relative flex flex-col items-center gap-4 z-10">
        <svg
          ref={wordRef}
          viewBox="0 0 280 88"
          className="w-[clamp(220px,40vw,420px)] h-auto text-ink"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* P */}
          <path d="M 20 80 L 20 12 L 48 12 Q 64 12 64 28 Q 64 44 48 44 L 20 44" />
          {/* R */}
          <path d="M 80 80 L 80 12 L 108 12 Q 124 12 124 26 Q 124 40 108 40 L 80 40 M 108 40 L 126 80" />
          {/* I */}
          <path d="M 142 12 L 142 80 M 134 12 L 150 12 M 134 80 L 150 80" />
          {/* S */}
          <path d="M 196 22 Q 186 12 174 12 Q 160 12 160 24 Q 160 36 178 42 Q 198 48 198 64 Q 198 80 180 80 Q 166 80 158 70" />
          {/* E */}
          <path d="M 252 12 L 218 12 L 218 80 L 254 80 M 218 44 L 246 44" />
        </svg>

        <p
          ref={taglineRef}
          className="font-mono text-[10.5px] tracking-[0.32em] uppercase text-ink-2 opacity-0"
        >
          Engineering · Kinshasa · RDC
        </p>
      </div>
    </div>
  );
}
