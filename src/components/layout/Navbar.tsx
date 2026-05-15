"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)]",
          scrolled
            ? "py-3 bg-white/85 backdrop-blur-md saturate-[180%] border-b border-ink/5 shadow-sm"
            : "py-5 bg-transparent"
        )}
      >
        <div className="max-w-[1240px] mx-auto px-5 sm:px-7 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-[34px] h-[34px] rounded-lg bg-ink shadow-sm relative grid place-items-center transition-transform group-hover:scale-105">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-paper">
                <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M2 15h10" />
                <path d="m9 18 3-3-3-3" />
              </svg>
            </div>
            <div>
              <span className="block text-[10px] font-medium text-mute tracking-[0.18em] uppercase leading-none mb-0.5">PRISE Sarl</span>
              <span className="block font-bold tracking-[0.04em] text-[17px] leading-[1.2] text-ink">Engineering</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            {["Services", "Projets", "Formations", "À propos"].map((item) => (
              <Link 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="relative py-1.5 text-ink-2 hover:text-ink transition-colors group"
              >
                {item}
                <span className="absolute left-0 right-0 bottom-0 h-px bg-ink scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:origin-left" />
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-0.5 text-xs font-semibold tracking-[0.08em] text-mute mr-2">
              <button className="px-2 py-1.5 rounded bg-ink/5 text-ink transition-colors">FR</button>
              <span className="opacity-40 px-1">/</span>
              <button className="px-2 py-1.5 rounded hover:bg-ink/5 transition-colors">EN</button>
            </div>
            <Link 
              href="#contact" 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-hot text-white font-semibold text-sm tracking-[0.01em] shadow-[0_8px_24px_-6px_rgba(43,183,220,0.55)] hover:bg-hot-2 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-8px_rgba(43,183,220,0.65)] transition-all duration-300"
            >
              Demander un devis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <button 
            className="lg:hidden p-2 text-ink"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div 
        className={cn(
          "fixed inset-0 z-[60] bg-ink text-paper flex flex-col p-8 transition-transform duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)]",
          menuOpen ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <button 
          className="absolute top-6 right-6 p-2 text-paper hover:text-hot transition-colors"
          onClick={() => setMenuOpen(false)}
        >
          <X className="w-8 h-8" />
        </button>
        <div className="mt-16 flex flex-col gap-2">
          {["Services", "Projets", "Formations", "À propos", "Contact"].map((item) => (
            <Link 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-3xl font-serif font-semibold py-4 border-b border-white/10"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
