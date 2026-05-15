"use client";

import { useEffect, useRef } from "react";

/**
 * AvatarSVG — stylized 2D face used when the 3D GLB can't load (DNS,
 * 404, CORS, missing WebGL, reduced-motion preference). It still
 * lipsyncs against the live audio level and follows the cursor.
 *
 * The art style intentionally reads as a designed character, not a low-
 * quality knockoff: monochrome ink lines on warm paper, soft shadows,
 * blueprint-grid backdrop. It belongs next to the rest of the site.
 */
interface Props {
  audioLevel: number;
  active: boolean;
  className?: string;
}

export function AvatarSVG({ audioLevel, active, className }: Props) {
  const mouthRef = useRef<SVGEllipseElement>(null);
  const jawRef   = useRef<SVGPathElement>(null);
  const lidLRef  = useRef<SVGRectElement>(null);
  const lidRRef  = useRef<SVGRectElement>(null);
  const pupilLRef = useRef<SVGCircleElement>(null);
  const pupilRRef = useRef<SVGCircleElement>(null);
  const headRef  = useRef<SVGGElement>(null);

  const audioRef = useRef(audioLevel);
  const activeRef = useRef(active);
  useEffect(() => { audioRef.current = audioLevel; });
  useEffect(() => { activeRef.current = active; });

  useEffect(() => {
    let raf = 0;
    let smoothed = 0;
    let nextBlink = performance.now() + 1500 + Math.random() * 2000;
    let blinkUntil = 0;
    let mouseX = 0;
    let mouseY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);

    const tick = () => {
      const now = performance.now();
      smoothed = smoothed * 0.78 + audioRef.current * 0.22;
      const open = Math.max(0, Math.min(1, smoothed * 2.4));

      // Mouth: scale the ellipse vertically + slide jaw line down
      if (mouthRef.current) {
        mouthRef.current.setAttribute("ry", String(2 + open * 14));
      }
      if (jawRef.current) {
        const dy = 1 + open * 5;
        jawRef.current.setAttribute("transform", `translate(0 ${dy})`);
      }

      // Blink
      if (now > nextBlink && blinkUntil === 0) {
        blinkUntil = now + 110;
      }
      let lid = 0; // 0 open, 1 closed
      if (blinkUntil > 0) {
        const remaining = blinkUntil - now;
        if (remaining > 0) {
          lid = 1 - Math.abs(remaining - 55) / 55;
        } else {
          blinkUntil = 0;
          nextBlink = now + 1600 + Math.random() * 3400;
        }
      }
      const lidH = 14 * lid;
      lidLRef.current?.setAttribute("height", String(lidH));
      lidRRef.current?.setAttribute("height", String(lidH));

      // Pupils — track mouse
      const px = mouseX * 2.5;
      const py = mouseY * 1.8;
      pupilLRef.current?.setAttribute("cx", String(82 + px));
      pupilLRef.current?.setAttribute("cy", String(98 + py));
      pupilRRef.current?.setAttribute("cx", String(138 + px));
      pupilRRef.current?.setAttribute("cy", String(98 + py));

      // Head sway
      if (headRef.current) {
        const t = now / 1000;
        const swayY = mouseX * 4 + Math.sin(t * 0.5) * 1.5;
        const swayX = mouseY * 2 + Math.sin(t * 0.42) * 0.8;
        const breathe = Math.sin(t * (activeRef.current ? 1.8 : 1.2)) * 1.2;
        headRef.current.setAttribute(
          "transform",
          `translate(${swayY} ${swayX + breathe}) rotate(${swayY * 0.15} 110 100)`
        );
      }

      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <svg
      viewBox="0 0 220 220"
      className={className}
      role="img"
      aria-label="Ernest, concierge PRISE"
    >
      <defs>
        <radialGradient id="ernSkin" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0%" stopColor="#fbeacb" />
          <stop offset="100%" stopColor="#d6b88a" />
        </radialGradient>
        <linearGradient id="ernHair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a2240" />
          <stop offset="100%" stopColor="#14315c" />
        </linearGradient>
        <radialGradient id="ernGlow" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0%" stopColor="rgba(43,183,220,0.35)" />
          <stop offset="100%" stopColor="rgba(43,183,220,0)" />
        </radialGradient>
        <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
      </defs>

      {/* ambient glow */}
      <circle cx="110" cy="115" r="100" fill="url(#ernGlow)" />

      <g ref={headRef}>
        {/* Neck */}
        <path d="M 88 178 L 88 198 Q 110 210 132 198 L 132 178 Z" fill="url(#ernSkin)" stroke="#0a2240" strokeWidth="1.2" />
        {/* Collar */}
        <path d="M 78 196 Q 110 220 142 196 L 144 215 L 76 215 Z" fill="#0a2240" />
        <path d="M 102 200 L 110 212 L 118 200" fill="none" stroke="#f6f1e6" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />

        {/* Head shape */}
        <ellipse cx="110" cy="105" rx="52" ry="60" fill="url(#ernSkin)" stroke="#0a2240" strokeWidth="1.4" />

        {/* Hair */}
        <path d="M 58 95 Q 60 55 110 50 Q 160 55 162 95 Q 158 70 110 65 Q 70 70 58 95 Z" fill="url(#ernHair)" />
        <path d="M 58 95 Q 64 75 78 65 Q 70 70 65 90" fill="#14315c" />

        {/* Brow line */}
        <path d="M 70 88 Q 82 82 94 88" fill="none" stroke="#0a2240" strokeWidth="1.8" strokeLinecap="round" filter="url(#softBlur)" />
        <path d="M 126 88 Q 138 82 150 88" fill="none" stroke="#0a2240" strokeWidth="1.8" strokeLinecap="round" filter="url(#softBlur)" />

        {/* Eyes — sclera + pupil + lid */}
        <g>
          <ellipse cx="82" cy="98" rx="9" ry="6" fill="#f6f1e6" stroke="#0a2240" strokeWidth="1" />
          <ellipse cx="138" cy="98" rx="9" ry="6" fill="#f6f1e6" stroke="#0a2240" strokeWidth="1" />
          <circle ref={pupilLRef} cx="82" cy="98" r="3.4" fill="#0a2240" />
          <circle ref={pupilRRef} cx="138" cy="98" r="3.4" fill="#0a2240" />
          {/* Catchlights */}
          <circle cx="84" cy="96" r="1.1" fill="#fff" />
          <circle cx="140" cy="96" r="1.1" fill="#fff" />
          {/* Eyelids — clamp closed during blink */}
          <rect ref={lidLRef} x="72" y="92" width="20" height="0" fill="url(#ernSkin)" rx="3" />
          <rect ref={lidRRef} x="128" y="92" width="20" height="0" fill="url(#ernSkin)" rx="3" />
        </g>

        {/* Nose */}
        <path d="M 110 100 L 106 122 Q 110 125 114 122" fill="none" stroke="#0a2240" strokeWidth="1.2" strokeLinecap="round" />

        {/* Mouth — ellipse stretched by audio, jaw shadow line */}
        <ellipse
          ref={mouthRef}
          cx="110"
          cy="140"
          rx="14"
          ry="2"
          fill="#5d2a1e"
          stroke="#0a2240"
          strokeWidth="1"
        />
        {/* Lip highlight */}
        <path d="M 96 140 Q 110 132 124 140" fill="none" stroke="#0a2240" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M 96 142 Q 110 148 124 142" fill="none" stroke="#0a2240" strokeWidth="1.4" strokeLinecap="round" />
        <path ref={jawRef} d="M 92 152 Q 110 158 128 152" fill="none" stroke="#0a2240" strokeWidth="0.8" strokeOpacity="0.4" strokeLinecap="round" />

        {/* Cheek dabs */}
        <ellipse cx="76" cy="128" rx="6" ry="3.5" fill="#e8a48b" opacity="0.45" />
        <ellipse cx="144" cy="128" rx="6" ry="3.5" fill="#e8a48b" opacity="0.45" />

        {/* Ears */}
        <path d="M 58 110 Q 52 118 58 130 Q 64 124 62 116 Z" fill="url(#ernSkin)" stroke="#0a2240" strokeWidth="1" />
        <path d="M 162 110 Q 168 118 162 130 Q 156 124 158 116 Z" fill="url(#ernSkin)" stroke="#0a2240" strokeWidth="1" />
      </g>
    </svg>
  );
}
