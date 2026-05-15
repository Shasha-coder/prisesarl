"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const DOMAINS = [
  "Génie Civil & Bâtiment",
  "Télécommunications",
  "Électricité & Énergie",
  "Transport & Logistique",
  "Formations",
];

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeDomain, setActiveDomain] = useState(0);

  useEffect(() => {
    // 3D Parallax tilt effect on mousemove
    const container = containerRef.current;
    const stage = stageRef.current;
    if (!container || !stage || window.matchMedia("(pointer: coarse)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20; // max rotation 10deg
      const y = (e.clientY / innerHeight - 0.5) * -20;
      
      gsap.to(stage, {
        rotationY: x,
        rotationX: y,
        transformPerspective: 1400,
        ease: "power2.out",
        duration: 0.5,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(stage, {
        rotationY: 0,
        rotationX: 0,
        ease: "power2.out",
        duration: 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    // Initial entrance animation
    const words = textRef.current?.querySelectorAll(".word");
    if (words) {
      gsap.fromTo(
        words,
        { opacity: 0, y: 40, rotateX: -20 },
        { 
          opacity: 1, 
          y: 0, 
          rotateX: 0, 
          duration: 0.9, 
          stagger: 0.08, 
          ease: "power3.out",
          delay: 0.2
        }
      );
    }
  }, []);

  useEffect(() => {
    // Domain auto-cycler
    const interval = setInterval(() => {
      setActiveDomain((prev) => (prev + 1) % DOMAINS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen bg-paper pt-[120px] pb-[60px] overflow-hidden flex items-center bg-blueprint mask-radial"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply bg-[radial-gradient(circle_at_12%_18%,rgba(0,0,0,0.05),transparent_40%),radial-gradient(circle_at_92%_86%,rgba(0,0,0,0.06),transparent_40%)]" />

      <div className="max-w-[1240px] mx-auto px-5 sm:px-7 w-full grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center relative z-10">
        
        {/* Left Copy */}
        <div>
          <div className="inline-flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.22em] uppercase text-ink-2 mb-6 px-3.5 py-1.5 border border-grid-strong rounded-full bg-white/40">
            <span className="w-1.5 h-1.5 rounded-full bg-hot shadow-[0_0_0_4px_rgba(43,183,220,0.18)] animate-pulse" />
            Kinshasa · RDC
          </div>

          <h1 ref={textRef} className="font-serif font-semibold text-[clamp(40px,6.4vw,84px)] leading-[1.02] tracking-[-0.025em] text-ink mb-7">
            <span className="word inline-block origin-bottom-left">Construire</span><br/>
            <span className="word inline-block origin-bottom-left">l'avenir,</span><br/>
            <span className="word inline-block origin-bottom-left">une</span> <span className="word inline-block origin-bottom-left">fondation</span> <span className="word inline-block origin-bottom-left">à</span> <span className="word inline-block origin-bottom-left">la</span> <span className="word inline-block origin-bottom-left">fois.</span>
          </h1>

          <p className="text-lg text-ink-2 max-w-[520px] mb-9 leading-[1.6]">
            PRISE Sarl conçoit, bâtit et opère les infrastructures qui connectent et alimentent l'Afrique centrale — du génie civil aux télécommunications.
          </p>

          <div className="flex flex-wrap gap-3.5 mb-11">
            <Link 
              href="#devis" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-hot text-white font-semibold text-sm tracking-[0.01em] shadow-[0_8px_24px_-6px_rgba(43,183,220,0.55)] hover:bg-hot-2 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-8px_rgba(43,183,220,0.65)] transition-all duration-300"
            >
              Demander un devis <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="#services" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-transparent text-ink font-semibold text-sm tracking-[0.01em] border border-grid-strong hover:bg-ink hover:text-paper hover:border-ink transition-all duration-300"
            >
              Découvrir nos services
            </Link>
          </div>

          <div className="flex flex-wrap gap-8 items-center text-ink-2">
            {[
              { num: "12+", label: "années d'expertise" },
              { num: "5", label: "domaines intégrés" },
              { num: "120+", label: "projets livrés" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col">
                <strong className="font-serif text-3xl text-ink leading-none">{stat.num}</strong>
                <span className="text-[11px] tracking-[0.18em] uppercase text-mute mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Stage (Blueprint 3D) */}
        <div 
          ref={stageRef}
          className="relative aspect-square max-w-[560px] mx-auto lg:ml-auto w-full bg-gradient-to-br from-[#fdf8eb] to-[#ece4d2] rounded-[22px] overflow-hidden shadow-[inset_0_0_0_1px_rgba(10,34,64,0.12),0_30px_80px_-20px_rgba(10,34,64,0.32)] [transform-style:preserve-3d] transition-transform duration-500"
        >
          {/* Grid Background */}
          <div className="absolute inset-0 bg-blueprint-sm pointer-events-none" />

          {/* Corners */}
          <span className="absolute top-3.5 left-4.5 text-[9.5px] tracking-[0.18em] font-semibold text-ink-2 uppercase opacity-65 [transform:translateZ(60px)]">PRISE / Plate 01</span>
          <span className="absolute top-3.5 right-4.5 text-[9.5px] tracking-[0.18em] font-semibold text-ink-2 uppercase opacity-65 [transform:translateZ(60px)] text-right">SCALE 1 : 200</span>
          
          {/* Blueprint Animation Placeholder (Normally Rive Canvas goes here) */}
          <div className="absolute inset-0 grid place-items-center [transform:translateZ(40px)]">
            <div className="w-[60%] h-[60%] border-2 border-ink border-dashed rounded-lg flex items-center justify-center relative overflow-hidden bg-white/20 backdrop-blur-sm">
              {/* Animated drawing lines effect mockup */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-ink animate-[slideRight_2s_ease-in-out_infinite]" />
              <div className="absolute bottom-0 right-0 w-full h-[2px] bg-ink animate-[slideLeft_2s_ease-in-out_infinite]" />
              <div className="absolute top-0 left-0 w-[2px] h-full bg-ink animate-[slideDown_2s_ease-in-out_infinite]" />
              <div className="absolute bottom-0 right-0 w-[2px] h-full bg-ink animate-[slideUp_2s_ease-in-out_infinite]" />
              
              <span className="text-ink font-serif text-2xl font-semibold opacity-50 text-center px-4">
                {DOMAINS[activeDomain]}<br/>
                <span className="text-[10px] tracking-widest font-sans uppercase mt-2 block">Rive Animation Canvas</span>
              </span>
            </div>
          </div>

          {/* Domain Switcher */}
          <div className="absolute left-1/2 bottom-5 -translate-x-1/2 flex gap-2 bg-ink p-2 rounded-full shadow-md z-10 [transform:translateZ(80px)]">
            {DOMAINS.map((_, i) => (
              <button 
                key={i}
                onClick={() => setActiveDomain(i)}
                className={cn(
                  "w-8 h-8 rounded-full grid place-items-center text-[11px] font-semibold tracking-[0.05em] transition-all",
                  activeDomain === i ? "bg-hot text-white" : "text-white/55 hover:text-white hover:-translate-y-px"
                )}
              >
                0{i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Blueprint Subject Ticker */}
      <div className="absolute bottom-6 left-0 right-0 text-center text-[11px] font-semibold tracking-[0.32em] uppercase text-ink-2 z-[3]">
        <span>Plan en cours · </span>
        <span className="text-ink border-b border-ink pb-0.5 transition-all">{DOMAINS[activeDomain]}</span>
      </div>
    </section>
  );
}
