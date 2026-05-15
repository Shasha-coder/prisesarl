"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";
import type { TKey } from "@/i18n/dictionary";

const NAV_LINKS: { href: string; key: TKey }[] = [
  { href: "#services",   key: "nav.services" },
  { href: "#methode",    key: "nav.methode" },
  { href: "#projets",    key: "nav.projets" },
  { href: "#pourquoi",   key: "nav.pourquoi" },
  { href: "#formations", key: "nav.formations" },
];

export function Navbar() {
  const { t, lang, setLang } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
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
        <div className="max-w-[1280px] mx-auto px-5 sm:px-7 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-[36px] h-[36px] rounded-lg bg-ink shadow-sm relative grid place-items-center transition-transform group-hover:scale-105 overflow-hidden">
              {/* Custom mark — stylized "P" as a blueprint nib */}
              <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 6 4 L 6 20 M 6 4 L 14 4 Q 19 4 19 9 Q 19 14 14 14 L 6 14" className="text-paper" />
                <circle cx="6" cy="20" r="1.4" fill="currentColor" className="text-hot" />
              </svg>
            </div>
            <div>
              <span className="block text-[10px] font-medium text-mute tracking-[0.18em] uppercase leading-none mb-0.5">
                PRISE Sarl
              </span>
              <span className="block font-bold tracking-[0.04em] text-[17px] leading-[1.2] text-ink">
                Engineering
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative py-1.5 text-ink-2 hover:text-ink transition-colors group"
              >
                {t(item.key)}
                <span className="absolute left-0 right-0 bottom-0 h-px bg-ink scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:origin-left" />
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-0.5 text-xs font-semibold tracking-[0.08em] text-mute mr-2">
              <button
                onClick={() => setLang("fr")}
                className={cn(
                  "px-2 py-1.5 rounded transition-colors",
                  lang === "fr" ? "bg-ink/5 text-ink" : "hover:bg-ink/5"
                )}
              >
                FR
              </button>
              <span className="opacity-40 px-1">/</span>
              <button
                onClick={() => setLang("en")}
                className={cn(
                  "px-2 py-1.5 rounded transition-colors",
                  lang === "en" ? "bg-ink/5 text-ink" : "hover:bg-ink/5"
                )}
              >
                EN
              </button>
            </div>
            <Link
              href="#devis"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-hot text-white font-semibold text-sm tracking-[0.01em] shadow-[0_8px_24px_-6px_rgba(43,183,220,0.55)] hover:bg-hot-2 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-8px_rgba(43,183,220,0.65)] transition-all duration-300"
            >
              {t("nav.devis")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <button
            className="lg:hidden p-2 text-ink"
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
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
          aria-label="Fermer le menu"
        >
          <X className="w-8 h-8" />
        </button>
        <div className="mt-20 flex flex-col gap-2">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-3xl font-serif font-semibold py-3 border-b border-white/10 hover:text-hot transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {t(item.key)}
            </Link>
          ))}
          <Link
            href="#devis"
            onClick={() => setMenuOpen(false)}
            className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-hot text-white font-semibold text-base"
          >
            {t("nav.devis")} <ArrowRight className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-1 text-xs font-semibold tracking-[0.08em] text-paper/60 mt-8">
            <button onClick={() => setLang("fr")} className={cn("px-3 py-2 rounded", lang === "fr" ? "bg-white/10 text-paper" : "")}>FR</button>
            <span className="opacity-30 px-1">/</span>
            <button onClick={() => setLang("en")} className={cn("px-3 py-2 rounded", lang === "en" ? "bg-white/10 text-paper" : "")}>EN</button>
          </div>
        </div>
      </div>
    </>
  );
}
