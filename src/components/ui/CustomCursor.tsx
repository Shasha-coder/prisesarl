"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

export default function CustomCursor() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const coordRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.documentElement.classList.add("has-cursor");
    if (wrapRef.current) wrapRef.current.style.display = "contents";

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%)`;
      }

      if (ringRef.current) {
        gsap.to(ringRef.current, {
          x: clientX,
          y: clientY,
          duration: 0.15,
          ease: "power2.out",
        });
      }

      if (coordRef.current) {
        coordRef.current.textContent = `X ${clientX} · Y ${clientY}`;
        gsap.to(coordRef.current, {
          x: clientX + 20,
          y: clientY + 20,
          duration: 0.15,
          ease: "power2.out",
        });
      }
    };

    const onHide = () => {
      if (wrapRef.current) wrapRef.current.style.visibility = "hidden";
    };
    const onShow = () => {
      if (wrapRef.current) wrapRef.current.style.visibility = "visible";
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onHide);
    document.addEventListener("mouseenter", onShow);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onHide);
      document.removeEventListener("mouseenter", onShow);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div ref={wrapRef} style={{ display: "none" }}>
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
      />
    </div>
  );
}
