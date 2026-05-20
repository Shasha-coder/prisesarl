"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/I18nProvider";

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

const DOMAIN_COLOR: Record<Domain, string> = {
  civil:     "#00d4ff",
  telecom:   "#f5b400",
  energy:    "#ef4444",
  logistics: "#a855f7",
  training:  "#10b981",
};

// Hand-drawn DRC outline approx bounds.
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
      <div className="absolute inset-0 bg-blueprint-dark opacity-40 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_30%_20%,rgba(0,212,255,0.12),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(245,180,0,0.06),transparent_55%)]" />

      <div className="max-w-[1280px] mx-auto px-5 sm:px-7 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-6 md:gap-16 items-end mb-12">
          <div>
            <div className="inline-flex items-center gap-2.5 text-[11px] font-bold tracking-[0.32em] uppercase text-[#f5b400] mb-4">
              <span className="inline-grid place-items-center w-6 h-6 rounded-full bg-[#f5b400] text-ink text-[10px] tracking-normal font-bold">MAP</span>
              {t("atlas.eyebrow")}
            </div>
            <h2 className="font-serif font-semibold text-[clamp(34px,5vw,60px)] leading-[1.02] tracking-[-0.025em] text-cyan-50">
              {t("atlas.title")}
            </h2>
          </div>
          <p className="text-[16px] text-cyan-100/70 leading-[1.7] max-w-[480px] md:text-right md:ml-auto">
            {t("atlas.lede")}
          </p>
        </div>

        {/* Tactical filter toggles */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "px-4 py-2 rounded-full text-[12px] font-bold tracking-[0.06em] uppercase transition-all border font-mono duration-200 clickable",
              filter === "all"
                ? "bg-[#00d4ff] text-slate-950 border-cyan-400 shadow-[0_0_12px_rgba(0,212,255,0.4)]"
                : "bg-slate-950/40 border-cyan-500/20 text-cyan-200 hover:border-cyan-400 hover:text-cyan-50"
            )}
          >
            {t("atlas.filter.all")}
          </button>
          
          {(["civil", "telecom", "energy", "logistics", "training"] as Domain[]).map((dom) => {
            const labels: Record<Domain, string> = {
              civil: "Génie Civil",
              telecom: "Télécoms",
              energy: "Énergie",
              logistics: "Logistique",
              training: "Formations",
            };
            return (
              <button
                key={dom}
                onClick={() => setFilter(dom)}
                className={cn(
                  "px-4 py-2 rounded-full text-[12px] font-bold tracking-[0.06em] uppercase transition-all border font-mono duration-200 clickable flex items-center gap-2",
                  filter === dom
                    ? "bg-[#00d4ff] text-slate-950 border-cyan-400 shadow-[0_0_12px_rgba(0,212,255,0.4)]"
                    : "bg-slate-950/40 border-cyan-500/20 text-cyan-200 hover:border-cyan-400 hover:text-cyan-50"
                )}
              >
                {labels[dom]}
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ 
                    background: DOMAIN_COLOR[dom],
                    boxShadow: `0 0 6px ${DOMAIN_COLOR[dom]}`
                  }}
                />
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-10">
          
          {/* Tactical map display plate */}
          <div className="relative aspect-[1000/780] glass-hud border border-cyan-500/25 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,212,255,0.05)]">
            <div className="absolute inset-0 bg-blueprint-dark opacity-55 pointer-events-none" />
            <div className="radar-scan-line" />

            {/* Tactical GPS Readouts */}
            <div className="absolute top-3.5 left-4 text-[8px] tracking-[0.28em] uppercase text-cyan-400/50 font-mono z-10">
              RDC // COMMAND.GRID_ATLAS-01
            </div>
            <div className="absolute top-3.5 right-4 text-[8px] tracking-[0.28em] uppercase text-[#f5b400]/70 font-mono z-10 animate-pulse">
              CALIBRATION: ACTIVE // SCALE ~ 1:6,000,000
            </div>

            <svg viewBox="0 0 1000 780" className="w-full h-full">
              <defs>
                <pattern id="tacticalHatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(0,212,255,0.06)" strokeWidth="0.5" />
                </pattern>
                <radialGradient id="hologramGlow" cx="0.5" cy="0.5" r="0.55">
                  <stop offset="0%" stopColor="rgba(0,212,255,0.18)" />
                  <stop offset="100%" stopColor="rgba(0,212,255,0)" />
                </radialGradient>
              </defs>

              {/* Holographic blueprint hatching */}
              <rect x="0" y="0" width="1000" height="780" fill="url(#tacticalHatch)" />

              {/* Tactical landmass aura glow */}
              <path d={DRC_OUTLINE} fill="url(#hologramGlow)" />

              {/* Pulsing blueprint contour border */}
              <path
                ref={outlineRef}
                d={DRC_OUTLINE}
                fill="none"
                stroke="rgba(0,212,255,0.6)"
                strokeWidth="1.5"
                strokeLinejoin="round"
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_rgba(0,212,255,0.4)]"
              />

              {/* Calibration blueprint coordinates lines grid */}
              <g stroke="rgba(0,212,255,0.05)" strokeWidth="0.5">
                {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((x) => (
                  <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="780" />
                ))}
                {[100, 200, 300, 400, 500, 600, 700].map((y) => (
                  <line key={`h-${y}`} x1="0" y1={y} x2="1000" y2={y} />
                ))}
              </g>

              {/* Kinshasa tactical crosshairs marker */}
              <g transform="translate(175, 470)" className="animate-spin" style={{ transformOrigin: "center", animationDuration: "12s" }}>
                <line x1="-15" y1="0" x2="15" y2="0" stroke="rgba(245,180,0,0.6)" strokeWidth="0.8" />
                <line x1="0" y1="-15" x2="0" y2="15" stroke="rgba(245,180,0,0.6)" strokeWidth="0.8" />
                <circle r="4" fill="none" stroke="rgba(245,180,0,0.6)" strokeWidth="0.8" strokeDasharray="2 2" />
              </g>

              {/* Animated fiber optical connection routing */}
              <g ref={linesRef}>
                {connectionLines.map((line) => (
                  <line
                    key={line.key}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke={filter !== "all" ? DOMAIN_COLOR[filter as Domain] : "#00d4ff"}
                    strokeWidth="1.2"
                    strokeDasharray="6 4"
                    className="animate-[dash_20s_linear_infinite]"
                  />
                ))}
              </g>

              {/* Telemetry Project Node Pins */}
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
                      <circle r="16" fill={color} opacity="0.25" className="pin-ring origin-center animate-ping" style={{ animationDuration: "3s" }} />
                    )}
                    <circle r="6" fill={color} className="drop-shadow-[0_0_6px_rgba(0,212,255,0.6)]" />
                    <circle r="2.2" fill="#fff" />
                    <text
                      x="0"
                      y="-18"
                      fontSize="9"
                      letterSpacing="1.5"
                      fontFamily="var(--font-mono, monospace)"
                      fill={active ? "rgba(0,212,255,0.95)" : "rgba(255,255,255,0.3)"}
                      textAnchor="middle"
                      className="font-bold"
                      style={{ transition: "all 0.3s ease" }}
                    >
                      {p.city.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Floating tactical Hover Telemetry Box */}
            <HoverPanel project={hover ? PROJECTS.find((p) => p.id === hover) : undefined} />
          </div>

          {/* Right column — record indexing log list */}
          <div className="flex flex-col gap-2.5 max-h-[600px] overflow-y-auto pr-2 custom-scroll agent-transcript-scroll">
            {visibleProjects.map((p) => (
              <div
                key={p.id}
                onMouseEnter={() => setHover(p.id)}
                onMouseLeave={() => setHover(null)}
                className={cn(
                  "group p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 clickable",
                  hover === p.id
                    ? "bg-slate-900/80 border-[#00d4ff] shadow-[0_0_15px_rgba(0,212,255,0.15)]"
                    : "bg-slate-950/40 border-cyan-500/15 hover:bg-slate-900/40 hover:border-cyan-500/30"
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[9px] tracking-[0.22em] uppercase font-mono text-cyan-400/60 font-semibold">
                    REG: {p.region} // YR: {p.year}
                  </span>
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse"
                    style={{ 
                      background: DOMAIN_COLOR[p.domain],
                      boxShadow: `0 0 6px ${DOMAIN_COLOR[p.domain]}`
                    }}
                  />
                </div>
                <h4 className="font-serif text-[17px] text-cyan-100 font-semibold leading-tight mt-1">{p.city}</h4>
                <p className="text-[12.5px] text-cyan-200/60 leading-[1.5]">{p.title}</p>
              </div>
            ))}
            {visibleProjects.length === 0 && (
              <p className="text-cyan-400/40 text-xs font-mono tracking-wider py-4">[SYSTEM: NO_PROJECTS_FOUND]</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function HoverPanel({ project }: { project?: Project }) {
  if (!project) return null;
  return (
    <div className="absolute bottom-4 left-4 right-4 max-w-[420px] glass-hud-chat border border-cyan-500/30 text-cyan-50 rounded-xl p-4.5 shadow-2xl pointer-events-none anim-fadeRise">
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-[8px] tracking-[0.26em] uppercase font-mono text-[#f5b400] font-bold">
          [TARGET_FOCUS // DATA_LOCKED]
        </span>
        <span className="text-[8.5px] font-mono text-cyan-400/60">
          SYS // YR_{project.year}
        </span>
      </div>
      <h4 className="font-serif text-[20px] text-cyan-50 font-bold leading-tight">{project.city} // {project.region.toUpperCase()}</h4>
      <p className="text-[12.5px] text-cyan-100/70 mt-1.5 leading-relaxed">{project.title}</p>
    </div>
  );
}
