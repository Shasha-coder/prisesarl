"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/I18nProvider";

/**
 * Atlas — RDC project map.
 *
 * A stylized blueprint outline of the Democratic Republic of the Congo with
 * city pins anchored to real projects. Filtering by domain pulses the
 * matching pins and traces connection lines between them — proof of reach.
 *
 * SVG viewBox is 1000x780. Coordinates are hand-tuned to read as DRC, not
 * to be cartographically perfect.
 */

type Domain = "civil" | "telecom" | "energy" | "logistics" | "training";
type Project = {
  id: string;
  city: string;
  region: string;
  domain: Domain;
  title: string;
  year: string;
  x: number;
  y: number;
};

const PROJECTS: Project[] = [
  { id: "p1", city: "Kinshasa",    region: "Kinshasa",   domain: "civil",     title: "Siège commercial · 4 600 m²", year: "2024", x: 175, y: 470 },
  { id: "p2", city: "Matadi",      region: "Kongo-Cent.", domain: "logistics", title: "Plateforme logistique port",  year: "2023", x: 95,  y: 510 },
  { id: "p3", city: "Boma",        region: "Kongo-Cent.", domain: "telecom",   title: "Pylône autoportant 36 m",      year: "2024", x: 60,  y: 540 },
  { id: "p4", city: "Mbandaka",    region: "Équateur",   domain: "energy",    title: "Champ solaire hybride 180 kWc", year: "2025", x: 290, y: 290 },
  { id: "p5", city: "Kisangani",   region: "Tshopo",     domain: "civil",     title: "Réhabilitation école technique", year: "2023", x: 530, y: 320 },
  { id: "p6", city: "Goma",        region: "N-Kivu",     domain: "telecom",   title: "5 pylônes + fibre métro",        year: "2024", x: 770, y: 410 },
  { id: "p7", city: "Bukavu",      region: "S-Kivu",     domain: "training",  title: "Formation HSE · 220 stagiaires", year: "2024", x: 770, y: 470 },
  { id: "p8", city: "Bunia",       region: "Ituri",      domain: "logistics", title: "Convois miniers 6 mois",          year: "2023", x: 805, y: 320 },
  { id: "p9", city: "Lubumbashi",  region: "Haut-Kat.",  domain: "energy",    title: "Centrale solaire 420 kWc",        year: "2025", x: 670, y: 660 },
  { id: "p10", city: "Mbuji-Mayi", region: "Kasaï-Or.",  domain: "civil",     title: "Hangar industriel 2 200 m²",     year: "2024", x: 510, y: 540 },
  { id: "p11", city: "Kananga",    region: "Kasaï-Cent", domain: "training",  title: "Centre de formation BTP",         year: "2025", x: 440, y: 560 },
  { id: "p12", city: "Kolwezi",    region: "Lualaba",    domain: "telecom",   title: "Audit structurel pylônes mine",   year: "2024", x: 620, y: 670 },
];

const FILTERS_FR: { id: Domain | "all"; label: string }[] = [
  { id: "all",       label: "Tous les projets" },
  { id: "civil",     label: "Génie Civil" },
  { id: "telecom",   label: "Télécoms" },
  { id: "energy",    label: "Énergie" },
  { id: "logistics", label: "Logistique" },
  { id: "training",  label: "Formations" },
];

const DOMAIN_COLOR: Record<Domain, string> = {
  civil:     "#2BB7DC",
  telecom:   "#f5b400",
  energy:    "#c8632b",
  logistics: "#14315c",
  training:  "#8FD2CF",
};

// Hand-drawn DRC outline (approx). Not cartographic; recognisable.
const DRC_OUTLINE =
  "M 50 500 L 75 540 L 110 545 L 150 530 L 195 540 L 240 555 L 270 590 L 310 615 L 360 640 L 410 660 L 470 685 L 520 705 L 580 700 L 640 685 L 690 660 L 720 640 L 745 605 L 755 555 L 760 510 L 810 470 L 830 410 L 825 360 L 805 320 L 770 290 L 730 285 L 690 305 L 640 290 L 590 270 L 540 255 L 500 230 L 470 200 L 460 160 L 480 130 L 510 115 L 540 105 L 555 80 L 530 60 L 495 55 L 460 70 L 425 80 L 390 85 L 350 80 L 310 75 L 270 80 L 230 95 L 195 115 L 160 130 L 130 155 L 105 190 L 85 230 L 70 280 L 60 330 L 55 380 L 50 430 Z";

export function Atlas() {
  const t = useT();
  const sectionRef = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<Domain | "all">("all");
  const [hover, setHover] = useState<string | null>(null);

  const pinsRef = useRef<Record<string, SVGGElement | null>>({});
  const linesRef = useRef<SVGGElement>(null);
  const outlineRef = useRef<SVGPathElement>(null);

  // Initial outline draw-on
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const path = outlineRef.current;
    if (!path) return;

    const len = path.getTotalLength();
    path.style.strokeDasharray = String(len);
    path.style.strokeDashoffset = String(len);

    const tween = gsap.to(path, {
      strokeDashoffset: 0,
      duration: 2.4,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
      },
    });

    return () => {
      tween.kill();
    };
  }, []);

  // Filter changes — animate matching pins and re-draw connection lines.
  useEffect(() => {
    PROJECTS.forEach((p) => {
      const el = pinsRef.current[p.id];
      if (!el) return;
      const active = filter === "all" || filter === p.domain;
      gsap.to(el, {
        scale: active ? 1 : 0.55,
        opacity: active ? 1 : 0.18,
        duration: 0.45,
        ease: "power3.out",
        transformOrigin: "center",
      });
    });

    const linesEl = linesRef.current;
    if (linesEl) {
      const lines = linesEl.querySelectorAll<SVGLineElement>("line");
      lines.forEach((line) => {
        const len = Math.hypot(
          Number(line.getAttribute("x2")) - Number(line.getAttribute("x1")),
          Number(line.getAttribute("y2")) - Number(line.getAttribute("y1"))
        );
        gsap.fromTo(
          line,
          { strokeDasharray: `${len}`, strokeDashoffset: len, opacity: 0 },
          { strokeDashoffset: 0, opacity: 0.55, duration: 1.0, ease: "power2.out" }
        );
      });
    }
  }, [filter]);

  const visibleProjects = useMemo(
    () => (filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.domain === filter)),
    [filter]
  );

  // Connection lines only when filtered to a single domain.
  const connectionLines = useMemo(() => {
    if (filter === "all") return [];
    const pts = visibleProjects;
    const lines: { x1: number; y1: number; x2: number; y2: number; key: string }[] = [];
    for (let i = 0; i < pts.length - 1; i++) {
      lines.push({ x1: pts[i].x, y1: pts[i].y, x2: pts[i + 1].x, y2: pts[i + 1].y, key: `${pts[i].id}-${pts[i + 1].id}` });
    }
    return lines;
  }, [filter, visibleProjects]);

  return (
    <section
      ref={sectionRef}
      id="projets"
      className="relative py-[140px] bg-ink text-paper overflow-hidden"
    >
      <div className="absolute inset-0 bg-blueprint-dark opacity-50 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_30%_20%,rgba(43,183,220,0.18),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(245,180,0,0.10),transparent_55%)]" />

      <div className="max-w-[1280px] mx-auto px-5 sm:px-7 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-6 md:gap-16 items-end mb-12">
          <div>
            <div className="inline-flex items-center gap-2.5 text-[11px] font-bold tracking-[0.32em] uppercase text-gold mb-4">
              <span className="inline-grid place-items-center w-6 h-6 rounded-full bg-gold text-ink text-[10px] tracking-normal">04</span>
              {t("atlas.eyebrow")}
            </div>
            <h2 className="font-serif font-semibold text-[clamp(34px,5vw,60px)] leading-[1.02] tracking-[-0.025em]">
              {t("atlas.title")}
            </h2>
          </div>
          <p className="text-[16px] text-paper/70 leading-[1.7] max-w-[480px] md:text-right md:ml-auto">
            {t("atlas.lede")}
          </p>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-10">
          {FILTERS_FR.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "px-4 py-2 rounded-full text-[12px] font-semibold tracking-[0.04em] transition-all border",
                filter === f.id
                  ? "bg-paper text-ink border-paper"
                  : "bg-transparent text-paper/70 border-white/15 hover:border-white/40 hover:text-paper"
              )}
            >
              {f.id === "all" ? t("atlas.filter.all") : f.label}
              {f.id !== "all" && (
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full ml-2 align-middle"
                  style={{ background: DOMAIN_COLOR[f.id as Domain] }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-10">
          {/* The Map */}
          <div className="relative aspect-[1000/780] bg-ink-2/40 rounded-2xl border border-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-blueprint-dark opacity-60 pointer-events-none" />

            {/* Map plate frame */}
            <div className="absolute top-3 left-4 text-[10px] tracking-[0.28em] uppercase text-paper/60 font-mono z-10">
              RDC · ATLAS-01
            </div>
            <div className="absolute top-3 right-4 text-[10px] tracking-[0.28em] uppercase text-paper/60 font-mono z-10">
              Échelle ≈ 1 / 6 000 000
            </div>

            <svg viewBox="0 0 1000 780" className="w-full h-full">
              {/* Hatched ocean / outside fill via clipPath */}
              <defs>
                <pattern id="atlasHatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" />
                </pattern>
                <radialGradient id="landGlow" cx="0.5" cy="0.5" r="0.55">
                  <stop offset="0%" stopColor="rgba(43,183,220,0.18)" />
                  <stop offset="100%" stopColor="rgba(43,183,220,0)" />
                </radialGradient>
              </defs>

              {/* Background hatch */}
              <rect x="0" y="0" width="1000" height="780" fill="url(#atlasHatch)" />

              {/* Country fill glow */}
              <path d={DRC_OUTLINE} fill="url(#landGlow)" />

              {/* Country outline (draws on scroll) */}
              <path
                ref={outlineRef}
                d={DRC_OUTLINE}
                fill="none"
                stroke="rgba(246,241,230,0.7)"
                strokeWidth="1.4"
                strokeLinejoin="round"
                strokeLinecap="round"
              />

              {/* Lat/long crosshair grid (light) */}
              <g stroke="rgba(255,255,255,0.06)" strokeWidth="0.5">
                {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((x) => (
                  <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="780" />
                ))}
                {[100, 200, 300, 400, 500, 600, 700].map((y) => (
                  <line key={`h-${y}`} x1="0" y1={y} x2="1000" y2={y} />
                ))}
              </g>

              {/* Capital marker — Kinshasa cross */}
              <g transform="translate(175, 470)">
                <line x1="-12" y1="0" x2="12" y2="0" stroke="rgba(245,180,0,0.5)" strokeWidth="0.8" />
                <line x1="0" y1="-12" x2="0" y2="12" stroke="rgba(245,180,0,0.5)" strokeWidth="0.8" />
              </g>

              {/* Connection lines */}
              <g ref={linesRef}>
                {connectionLines.map((line) => (
                  <line
                    key={line.key}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke={filter !== "all" ? DOMAIN_COLOR[filter as Domain] : "#fff"}
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                ))}
              </g>

              {/* Pins */}
              {PROJECTS.map((p) => {
                const active = filter === "all" || filter === p.domain;
                const color = DOMAIN_COLOR[p.domain];
                return (
                  <g
                    key={p.id}
                    ref={(el) => { pinsRef.current[p.id] = el; }}
                    transform={`translate(${p.x}, ${p.y})`}
                    onMouseEnter={() => setHover(p.id)}
                    onMouseLeave={() => setHover(null)}
                    style={{ cursor: "pointer" }}
                  >
                    {active && (
                      <circle r="14" fill={color} opacity="0.18" className="pin-ring origin-center" />
                    )}
                    <circle r="6" fill={color} />
                    <circle r="2.4" fill="#fff" />
                    <text
                      x="0"
                      y="-16"
                      fontSize="10"
                      letterSpacing="1"
                      fontFamily="var(--font-mono, monospace)"
                      fill="rgba(246,241,230,0.9)"
                      textAnchor="middle"
                      style={{ opacity: active ? 1 : 0.3, transition: "opacity 0.4s ease" }}
                    >
                      {p.city.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover detail panel */}
            <HoverPanel project={hover ? PROJECTS.find((p) => p.id === hover) : undefined} />
          </div>

          {/* Right column — project list */}
          <div className="flex flex-col gap-2.5 max-h-[600px] overflow-y-auto pr-1 custom-scroll">
            {visibleProjects.map((p) => (
              <div
                key={p.id}
                onMouseEnter={() => setHover(p.id)}
                onMouseLeave={() => setHover(null)}
                className={cn(
                  "group p-4 rounded-xl border transition-all cursor-pointer",
                  hover === p.id
                    ? "bg-white/8 border-white/20"
                    : "bg-white/[0.03] border-white/8 hover:bg-white/6 hover:border-white/15"
                )}
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <span className="text-[11px] tracking-[0.18em] uppercase font-mono text-paper/55">
                    {p.region} · {p.year}
                  </span>
                  <span
                    className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                    style={{ background: DOMAIN_COLOR[p.domain] }}
                  />
                </div>
                <h4 className="font-serif text-[18px] text-paper leading-tight mb-1">{p.city}</h4>
                <p className="text-[13px] text-paper/65 leading-[1.5]">{p.title}</p>
              </div>
            ))}
            {visibleProjects.length === 0 && (
              <p className="text-paper/50 text-sm">Aucun projet à afficher.</p>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.04); }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.18); border-radius: 6px; }
      `}</style>
    </section>
  );
}

function HoverPanel({ project }: { project?: Project }) {
  if (!project) return null;
  return (
    <div className="absolute bottom-4 left-4 right-4 max-w-[440px] bg-paper text-ink rounded-xl p-4 shadow-lg anim-fadeRise pointer-events-none">
      <div className="flex items-start justify-between gap-3 mb-1">
        <span className="text-[10px] tracking-[0.22em] uppercase font-mono text-mute">
          {project.region} · {project.year}
        </span>
        <span className="w-2 h-2 rounded-full mt-1" style={{ background: "currentColor" }} />
      </div>
      <h4 className="font-serif text-[22px] leading-tight">{project.city}</h4>
      <p className="text-[13px] text-ink-2 mt-1">{project.title}</p>
    </div>
  );
}
