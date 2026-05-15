"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const DOMAINS_DATA = [
  {
    id: "01",
    title: "Génie Civil & Bâtiment",
    desc: "Construction d'infrastructures durables, bâtiments commerciaux et industriels adaptés au climat et aux contraintes locales.",
    chips: ["Fondations", "Gros Œuvre", "Finitions"],
    colSpan: "col-span-1 md:col-span-5",
    icon: (
      <svg viewBox="0 0 100 100" className="w-full h-full stroke-ink stroke-[1.3] fill-none stroke-linecap-round stroke-linejoin-round" style={{ strokeDasharray: 600, strokeDashoffset: 600 }}>
        <polyline points="10,90 10,50 50,20 90,50 90,90 10,90"/>
        <rect x="40" y="60" width="20" height="30"/>
        <line x1="25" y1="50" x2="35" y2="50"/>
        <line x1="65" y1="50" x2="75" y2="50"/>
      </svg>
    )
  },
  {
    id: "02",
    title: "Télécommunications",
    desc: "Déploiement de réseaux fibrés, installation de pylônes et maintenance d'infrastructures de télécommunication à travers le pays.",
    chips: ["Fibre Optique", "Pylônes 4G/5G", "VSAT"],
    colSpan: "col-span-1 md:col-span-4",
    icon: (
      <svg viewBox="0 0 100 100" className="w-full h-full stroke-ink stroke-[1.3] fill-none stroke-linecap-round stroke-linejoin-round" style={{ strokeDasharray: 600, strokeDashoffset: 600 }}>
        <line x1="50" y1="90" x2="50" y2="10"/>
        <line x1="40" y1="30" x2="60" y2="30"/>
        <line x1="30" y1="60" x2="70" y2="60"/>
        <polyline points="50,10 40,30 50,60 60,30 50,10"/>
        <circle cx="50" cy="10" r="3" className="fill-hot stroke-none" />
      </svg>
    )
  },
  {
    id: "03",
    title: "Énergie",
    desc: "Solutions d'électrification rurale et urbaine, champs solaires et hybridation de groupes électrogènes.",
    chips: ["Solaire", "Hybride", "MT/BT"],
    colSpan: "col-span-1 md:col-span-3",
    icon: (
      <svg viewBox="0 0 100 100" className="w-full h-full stroke-ink stroke-[1.3] fill-none stroke-linecap-round stroke-linejoin-round" style={{ strokeDasharray: 600, strokeDashoffset: 600 }}>
        <rect x="20" y="30" width="60" height="40" transform="skewX(-20)"/>
        <line x1="40" y1="30" x2="40" y2="70" transform="skewX(-20)"/>
        <line x1="60" y1="30" x2="60" y2="70" transform="skewX(-20)"/>
        <circle cx="20" cy="20" r="10" className="stroke-gold"/>
      </svg>
    )
  },
  {
    id: "04",
    title: "Logistique",
    desc: "Transport lourd, manutention de matériaux de construction et gestion de flotte pour les chantiers isolés.",
    chips: ["Transport lourd", "Manutention", "Flotte"],
    colSpan: "col-span-1 md:col-span-4",
    icon: (
      <svg viewBox="0 0 100 100" className="w-full h-full stroke-ink stroke-[1.3] fill-none stroke-linecap-round stroke-linejoin-round" style={{ strokeDasharray: 600, strokeDashoffset: 600 }}>
        <rect x="10" y="40" width="50" height="30"/>
        <polyline points="60,40 80,40 90,55 90,70 60,70"/>
        <circle cx="30" cy="70" r="6"/>
        <circle cx="75" cy="70" r="6"/>
      </svg>
    )
  },
  {
    id: "05",
    title: "Formations Professionnelles",
    desc: "Transfert de compétences et accréditations. Nous formons la prochaine génération de techniciens et d'ingénieurs congolais aux standards internationaux.",
    chips: ["ISO 21001", "Techniciens", "Ingénierie", "Sécurité"],
    colSpan: "col-span-1 md:col-span-8",
    icon: (
      <svg viewBox="0 0 100 100" className="w-full h-full stroke-ink stroke-[1.3] fill-none stroke-linecap-round stroke-linejoin-round" style={{ strokeDasharray: 600, strokeDashoffset: 600 }}>
        <polyline points="50,20 20,35 50,50 80,35 50,20"/>
        <line x1="50" y1="50" x2="50" y2="70"/>
        <polyline points="35,42 35,60"/>
        <line x1="80" y1="35" x2="80" y2="55"/>
      </svg>
    )
  }
];

export function Domains() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Stagger entrance of the domain cards
      gsap.fromTo(
        cardsRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="services" className="py-[120px] bg-surface relative">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-7">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-[60px] items-end mb-[60px]">
          <div>
            <div className="inline-flex items-center gap-2.5 text-[11px] font-bold tracking-[0.32em] uppercase text-hot mb-4">
              <span className="inline-grid place-items-center w-6 h-6 rounded-full bg-hot text-white text-[10px] tracking-normal">02</span>
              Nos domaines
            </div>
            <h2 className="font-serif font-semibold text-[clamp(32px,4.5vw,56px)] leading-[1.04] tracking-[-0.02em] text-ink">
              Cinq métiers,<br/>une seule équipe<br/>
              <em className="text-ink-2 italic">de bout en bout.</em>
            </h2>
          </div>
          <div>
            <p className="text-[17px] text-ink-2 max-w-[520px] leading-[1.65]">
              Du dimensionnement à la mise en service, PRISE intègre l&apos;ensemble de la chaîne : études techniques, construction, télécommunications, énergie, logistique chantier et formation des équipes locales. Un interlocuteur, une responsabilité.
            </p>
          </div>
        </div>

        {/* Domains Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-[18px]">
          {DOMAINS_DATA.map((domain, index) => (
            <div
              key={domain.id}
              ref={el => { cardsRef.current[index] = el }}
              className={cn(
                "group relative bg-white rounded-xl p-[30px_28px_26px] overflow-hidden border border-ink/5 flex flex-col min-h-[340px] transition-all duration-500 hover:-translate-y-1 hover:shadow-md cursor-pointer",
                domain.colSpan
              )}
            >
              {/* Blueprint Hover Background */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-blueprint-sm mix-blend-multiply opacity-40" />

              <span className="font-serif text-sm font-medium tracking-[0.04em] text-mute">
                {domain.id}
              </span>
              
              <h3 className="font-serif font-semibold text-[28px] leading-[1.1] tracking-[-0.01em] text-ink mt-1.5 mb-3.5 relative z-10">
                {domain.title}
              </h3>
              
              <p className="text-[14.5px] text-ink-2 leading-[1.6] flex-grow relative z-10">
                {domain.desc}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-4.5 relative z-10">
                {domain.chips.map(chip => (
                  <span key={chip} className="text-[11.5px] font-medium text-ink-2 px-2.5 py-1 rounded-full bg-ink/5">
                    {chip}
                  </span>
                ))}
              </div>

              <div className="inline-flex items-center gap-2 mt-4.5 font-semibold text-[13px] text-ink border-b border-ink pb-0.5 self-start group-hover:gap-3.5 transition-all relative z-10">
                En savoir plus <ArrowRight className="w-3.5 h-3.5" />
              </div>

              {/* Animated Blueprint Icon */}
              <div className="absolute right-[18px] top-[18px] w-[88px] h-[88px] opacity-85 domain-icon-wrap">
                {domain.icon}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
