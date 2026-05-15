"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Calendar, Clock, GraduationCap, Users } from "lucide-react";
import Link from "next/link";
import { useT } from "@/i18n/I18nProvider";

/**
 * Formations — preview of the professional training catalog.
 *
 * Four featured courses surfaced from the broader catalog. Each card is
 * stamped like a certificate corner with seal, ribbon and code.
 */

const COURSES = [
  {
    code: "GC-101",
    field: "Génie Civil",
    title: "Lecture de plans & implantation chantier",
    duration: "5 jours",
    capacity: "12 stagiaires",
    nextSession: "11 mars 2026",
    level: "Niveau 1",
    color: "#2BB7DC",
  },
  {
    code: "TC-202",
    field: "Télécoms",
    title: "Audit structurel des pylônes existants",
    duration: "3 jours",
    capacity: "8 stagiaires",
    nextSession: "24 mars 2026",
    level: "Niveau 2",
    color: "#f5b400",
  },
  {
    code: "EN-201",
    field: "Énergie",
    title: "Dimensionnement solaire & hybride",
    duration: "4 jours",
    capacity: "10 stagiaires",
    nextSession: "8 avril 2026",
    level: "Niveau 2",
    color: "#c8632b",
  },
  {
    code: "HS-101",
    field: "HSE / Qualité",
    title: "Sécurité chantier & analyse de risques",
    duration: "2 jours",
    capacity: "20 stagiaires",
    nextSession: "22 avril 2026",
    level: "Niveau 1",
    color: "#14315c",
  },
];

export function Formations() {
  const t = useT();
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRefs.current,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="formations" className="relative py-[140px] bg-paper bg-paper-grain overflow-hidden">
      <div className="absolute inset-0 bg-blueprint mask-fade-b opacity-50 pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-5 sm:px-7 relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-6 md:gap-[60px] items-end mb-[60px]">
          <div>
            <div className="inline-flex items-center gap-2.5 text-[11px] font-bold tracking-[0.32em] uppercase text-hot mb-4">
              <span className="inline-grid place-items-center w-6 h-6 rounded-full bg-hot text-white text-[10px] tracking-normal">06</span>
              {t("formations.eyebrow")}
            </div>
            <h2 className="font-serif font-semibold text-[clamp(34px,4.5vw,56px)] leading-[1.04] tracking-[-0.02em] text-ink">
              {t("formations.title")}
            </h2>
          </div>
          <p className="text-[16px] text-ink-2 max-w-[520px] md:ml-auto md:text-right leading-[1.7]">
            {t("formations.lede")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {COURSES.map((c, i) => (
            <div
              key={c.code}
              ref={(el) => { if (el) cardRefs.current[i] = el; }}
              className="group relative bg-white rounded-2xl p-6 border border-ink/5 overflow-hidden flex flex-col gap-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-500"
            >
              {/* Corner color tab */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ background: c.color }}
              />
              {/* Seal (top-right) */}
              <div className="absolute top-4 right-4 grid place-items-center">
                <svg viewBox="0 0 40 40" className="w-10 h-10 opacity-90">
                  <circle cx="20" cy="20" r="18" fill="none" stroke={c.color} strokeWidth="1" strokeDasharray="1 2" />
                  <circle cx="20" cy="20" r="13" fill={c.color} fillOpacity="0.08" stroke={c.color} strokeWidth="0.8" />
                  <text x="20" y="23" fontSize="7.5" letterSpacing="0.5" fontFamily="var(--font-mono, monospace)" textAnchor="middle" fill={c.color} fontWeight="700">
                    {c.code}
                  </text>
                </svg>
              </div>

              <div className="mt-2">
                <span className="text-[10.5px] tracking-[0.22em] uppercase font-semibold text-mute">
                  {c.field}
                </span>
                <h3 className="font-serif text-[20px] font-semibold leading-[1.2] text-ink mt-2 pr-12">
                  {c.title}
                </h3>
              </div>

              <ul className="flex flex-col gap-2 text-[13px] text-ink-2 mt-auto">
                <li className="flex items-center gap-2.5">
                  <Clock className="w-3.5 h-3.5 text-mute" />
                  {c.duration}
                </li>
                <li className="flex items-center gap-2.5">
                  <Users className="w-3.5 h-3.5 text-mute" />
                  {c.capacity}
                </li>
                <li className="flex items-center gap-2.5">
                  <Calendar className="w-3.5 h-3.5 text-mute" />
                  Session : {c.nextSession}
                </li>
                <li className="flex items-center gap-2.5">
                  <GraduationCap className="w-3.5 h-3.5 text-mute" />
                  {c.level}
                </li>
              </ul>

              <Link
                href="#"
                className="inline-flex items-center gap-1.5 font-semibold text-[13px] text-ink border-b border-ink/40 pb-0.5 self-start mt-2 group-hover:gap-2.5 transition-all"
              >
                {t("formations.enroll")} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-ink-2">
            Plus de 24 modules disponibles · Sessions en intra-entreprise sur demande
          </p>
          <Link
            href="#"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-ink text-paper font-semibold text-sm hover:bg-ink-2 hover:-translate-y-0.5 transition-all"
          >
            {t("formations.catalog")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
