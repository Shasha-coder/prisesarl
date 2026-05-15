"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const coordRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Only initialize on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;
    
    document.documentElement.classList.add("has-cursor");
    setIsVisible(true);

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      
      // Instant update for dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%)`;
      }
      
      // Smooth update for ring using GSAP
      if (ringRef.current) {
        gsap.to(ringRef.current, {
          x: clientX,
          y: clientY,
          duration: 0.15,
          ease: "power2.out",
        });
      }

      // Update coordinates text
      setCoords({ x: clientX, y: clientY });
      if (coordRef.current) {
        gsap.to(coordRef.current, {
          x: clientX + 20,
          y: clientY + 20,
          duration: 0.15,
          ease: "power2.out",
        });
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <div 
        ref={dotRef} 
        className="cursor-dot fixed top-0 left-0 w-2 h-2 rounded-full bg-white pointer-events-none z-[9999] mix-blend-difference will-change-transform"
      />
      <div 
        ref={ringRef} 
        className="cursor-ring fixed top-0 left-0 w-9 h-9 border-[1.4px] border-white rounded-full pointer-events-none z-[9999] mix-blend-difference will-change-transform -translate-x-1/2 -translate-y-1/2"
      />
      <div 
        ref={coordRef}
        className={cn(
          "cursor-coord fixed top-0 left-0 pointer-events-none z-[9999] whitespace-nowrap",
          "font-sans text-[9.5px] font-semibold tracking-[0.18em] text-ink bg-paper",
          "px-2 py-1 border border-grid-strong rounded-[3px] opacity-0 transition-opacity duration-200"
        )}
      >
        X {coords.x} · Y {coords.y}
      </div>
    </>
  );
}
