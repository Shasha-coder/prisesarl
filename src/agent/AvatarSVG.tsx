"use client";

import { cn } from "@/lib/utils";

interface Props {
  audioLevel: number;
  active: boolean;
  className?: string;
}

/**
 * AvatarSVG — A world-class Siri/Apple-style glowing Blue/Indigo Sphere.
 * Renders a quantum blue radial-gradient sphere with premium breathing animations and deep glowing shadows.
 */
export function AvatarSVG({ audioLevel, active, className }: Props) {
  // Smoothly damp visual scaling for subtle, professional breathing
  const scale = 1 + Math.min(audioLevel, 1) * 0.15;
  const shadowBlur = 25 + Math.min(audioLevel, 1) * 25;

  return (
    <div className={cn("relative flex flex-col items-center justify-center p-6 w-full h-full", className)}>
      <svg
        viewBox="0 0 300 240"
        className="w-full max-w-[280px] h-auto aspect-square overflow-visible"
      >
        <defs>
          {/* Siri-style premium blue/cyan-to-indigo 3D sphere gradient */}
          <radialGradient id="siriBlueGrad" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="35%" stopColor="#0088ff" />
            <stop offset="75%" stopColor="#0b0b5e" />
            <stop offset="100%" stopColor="#020220" />
          </radialGradient>

          {/* Premium soft glowing indigo aura drop shadow */}
          <filter id="indigoAuraShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow
              dx="0"
              dy="10"
              stdDeviation={shadowBlur / 2}
              floodColor="#0088ff"
              floodOpacity={active ? "0.45" : "0.22"}
            />
          </filter>
        </defs>

        {/* Outer subtle technical calibration calibration ring */}
        <circle
          cx="150"
          cy="120"
          r="95"
          fill="none"
          stroke="rgba(0, 136, 255, 0.08)"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
        <circle
          cx="150"
          cy="120"
          r="72"
          fill="none"
          stroke="rgba(0, 136, 255, 0.04)"
          strokeWidth="0.8"
        />

        {/* Siri Quantum Blue Sphere */}
        <g 
          className="transition-transform duration-100 ease-out origin-center"
          style={{ transform: `scale(${scale})` }}
        >
          <circle
            cx="150"
            cy="120"
            r="56"
            fill="url(#siriBlueGrad)"
            filter="url(#indigoAuraShadow)"
          />
        </g>
      </svg>
    </div>
  );
}
