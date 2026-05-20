"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

/**
 * CustomCursor — A highly premium cybernetic drafting reticle.
 *
 * Morphs dynamically when hovering over clickable elements:
 *   - Normal: A delicate target dot + mechanical compass tick ring.
 *   - Hovering: Expands, colors change to bright cyan, crosshairs draw in,
 *     coordinates lock and read status like "SYS.LOCK / TARGET: CLICK".
 */
export default function CustomCursor() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const coordRef = useRef<HTMLDivElement>(null);
  const [hoverState, setHoverState] = useState<"idle" | "lock">("idle");
  const [targetLabel, setTargetLabel] = useState("");

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.documentElement.classList.add("has-cursor");
    if (wrapRef.current) wrapRef.current.style.display = "contents";

    let cursorActive = true;

    const onMouseMove = (e: MouseEvent) => {
      if (!cursorActive) return;
      const { clientX, clientY } = e;

      // 1. Precise dot tracking
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%)`;
      }

      // 2. Lagged outer ring tracking (with GSAP for fluid elastic lag)
      if (ringRef.current) {
        gsap.to(ringRef.current, {
          x: clientX,
          y: clientY,
          duration: 0.18,
          ease: "power2.out",
        });
      }

      // 3. Telemetry coordinate box tracking
      if (coordRef.current) {
        gsap.to(coordRef.current, {
          x: clientX + 22,
          y: clientY + 22,
          duration: 0.12,
          ease: "power3.out",
        });
      }
    };

    // Hover listeners to morph the target
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isClickable =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.getAttribute("role") === "button" ||
        target.classList.contains("clickable") ||
        target.classList.contains("domain-card");

      if (isClickable) {
        setHoverState("lock");
        
        // Grab custom label or action type
        const text = target.textContent?.trim() || "";
        const label = text.length > 0 && text.length < 20 
          ? `LOCK: ${text.toUpperCase()}` 
          : "SYS.LOCK // TARGET: ACTIVATE";
        setTargetLabel(label);

        // Holographic snap scale + continuous spin
        if (ringRef.current) {
          gsap.to(ringRef.current, {
            scale: 1.6,
            borderColor: "rgba(0, 212, 255, 0.85)",
            rotate: 180,
            borderWidth: "1.5px",
            duration: 0.3,
            ease: "back.out(2)",
          });
          
          // Outer drop-shadow pulse on elements
          gsap.to(ringRef.current, {
            boxShadow: "0 0 16px rgba(0, 212, 255, 0.4)",
            duration: 0.2
          });
        }
        
        if (dotRef.current) {
          gsap.to(dotRef.current, {
            scale: 2.2,
            backgroundColor: "#00d4ff",
            boxShadow: "0 0 12px #00d4ff",
            duration: 0.2,
          });
        }

        if (coordRef.current) {
          gsap.to(coordRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.25,
            ease: "power2.out"
          });
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isClickable =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.getAttribute("role") === "button" ||
        target.classList.contains("clickable") ||
        target.classList.contains("domain-card");

      if (isClickable) {
        setHoverState("idle");
        
        if (ringRef.current) {
          gsap.to(ringRef.current, {
            scale: 1,
            borderColor: "rgba(255, 255, 255, 0.4)",
            rotate: 0,
            borderWidth: "1px",
            boxShadow: "none",
            duration: 0.35,
            ease: "power2.out",
          });
        }
        
        if (dotRef.current) {
          gsap.to(dotRef.current, {
            scale: 1,
            backgroundColor: "#ffffff",
            boxShadow: "none",
            duration: 0.3,
          });
        }

        if (coordRef.current) {
          gsap.to(coordRef.current, {
            opacity: 0,
            scale: 0.85,
            duration: 0.2,
          });
        }
      }
    };

    const onHide = () => {
      cursorActive = false;
      if (wrapRef.current) wrapRef.current.style.visibility = "hidden";
    };
    const onShow = () => {
      cursorActive = true;
      if (wrapRef.current) wrapRef.current.style.visibility = "visible";
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("mouseleave", onHide);
    document.addEventListener("mouseenter", onShow);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("mouseleave", onHide);
      document.removeEventListener("mouseenter", onShow);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div ref={wrapRef} style={{ display: "none" }}>
      {/* Target core dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-white pointer-events-none z-[9999] mix-blend-difference will-change-transform"
        style={{ transform: "translate(-50%, -50%)" }}
      />
      
      {/* High-tech targeting reticle with compass ticks */}
      <div
        ref={ringRef}
        className={cn(
          "fixed top-0 left-0 w-10 h-10 border border-white/40 rounded-full pointer-events-none z-[9999] mix-blend-difference will-change-transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
        )}
      >
        {/* Fine crosshairs that show up during targets */}
        <div className={cn(
          "absolute w-full h-[0.5px] bg-[#00d4ff]/40 transition-opacity duration-300 pointer-events-none",
          hoverState === "lock" ? "opacity-100" : "opacity-0"
        )} />
        <div className={cn(
          "absolute h-full w-[0.5px] bg-[#00d4ff]/40 transition-opacity duration-300 pointer-events-none",
          hoverState === "lock" ? "opacity-100" : "opacity-0"
        )} />
      </div>

      {/* Cyber coordinates indicator readout */}
      <div
        ref={coordRef}
        className={cn(
          "fixed top-0 left-0 pointer-events-none z-[9999] whitespace-nowrap opacity-0 scale-90",
          "font-mono text-[8.5px] font-semibold tracking-[0.2em] text-[#00d4ff] bg-slate-950/90",
          "px-2.5 py-1.5 border border-[#00d4ff]/25 rounded-[3px] shadow-[0_0_12px_rgba(0,212,255,0.2)]"
        )}
      >
        {targetLabel}
      </div>
    </div>
  );
}
