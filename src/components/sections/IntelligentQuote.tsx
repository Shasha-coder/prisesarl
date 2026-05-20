"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bot, CheckCircle2, ChevronLeft, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/I18nProvider";

const STEPS = [
  { id: "domain", question: "Dans quel domaine se situe votre besoin ?" },
  { id: "details", question: "Pouvez-vous décrire brièvement votre projet ?" },
  { id: "contact", question: "Comment pouvons-nous vous recontacter ?" },
  { id: "done", question: "Demande envoyée avec succès" }
];

const DOMAIN_OPTIONS = [
  { id: "civ", label: "Génie Civil", desc: "Construction, Bâtiment" },
  { id: "tel", label: "Télécoms", desc: "Pylônes, Fibre" },
  { id: "ene", label: "Énergie", desc: "Solaire, Électrification" },
  { id: "log", label: "Logistique", desc: "Transport lourd" },
];

export function IntelligentQuote() {
  const t = useT();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ domain: "", details: "", email: "", name: "" });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // The AI agent can pre-select a domain via custom event
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      const opt = DOMAIN_OPTIONS.find((d) => d.id === detail || d.id === detail.slice(0, 3));
      if (opt) setFormData((s) => ({ ...s, domain: opt.id }));
    };
    window.addEventListener("prise:devis-preselect", handler);
    return () => window.removeEventListener("prise:devis-preselect", handler);
  }, []);
  
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current || !spotlightRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spotlightRef.current.style.background = `radial-gradient(circle 380px at ${x}px ${y}px, rgba(0,212,255,0.08), transparent 60%)`;
      spotlightRef.current.style.opacity = "1";
    };

    const s = sectionRef.current;
    s?.addEventListener("mousemove", handleMouseMove);

    return () => s?.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, scale: 0.96, y: 12 },
        { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: "power2.out" }
      );
    }
  }, [step]);

  const handleNext = () => {
    if (step === 1) {
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setStep(prev => prev + 1);
      }, 1800);
    } else if (step < STEPS.length - 1) {
      setStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(prev => prev - 1);
  };

  const progressWidth = `${((step + 1) / STEPS.length) * 100}%`;

  return (
    <section 
      ref={sectionRef} 
      id="devis" 
      className="relative py-[120px] bg-ink text-paper overflow-hidden"
    >
      {/* Spotlight overlay */}
      <div 
        ref={spotlightRef}
        className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 z-[1]"
      />
      
      <div className="absolute inset-0 bg-blueprint-dark pointer-events-none opacity-30" />
      
      <div className="max-w-[1240px] mx-auto px-5 sm:px-7 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-16 items-center">
          
          <div>
            <div className="inline-flex items-center gap-2.5 text-[11px] font-bold tracking-[0.32em] uppercase text-[#f5b400] mb-4">
              <span className="inline-grid place-items-center w-6 h-6 rounded-full bg-[#f5b400] text-ink text-[9px] tracking-normal font-bold">AI</span>
              {t("quote.eyebrow")}
            </div>
            <h2 className="font-serif font-semibold text-[clamp(34px,4.5vw,52px)] leading-[1.05] tracking-[-0.02em] text-paper mb-5">
              {t("quote.title")}
            </h2>
            <p className="text-base text-paper/70 max-w-[440px] leading-[1.7] mb-8">
              {t("quote.lede")}
            </p>
            
            {/* Step markers side panel */}
            <div className="flex flex-col gap-4">
              {STEPS.map((s, i) => (
                <div key={s.id} className={cn(
                  "flex items-center gap-4 text-[13px] font-semibold transition-colors duration-300 font-mono",
                  step > i ? "text-paper/40" : step === i ? "text-[#00d4ff] text-neon-cyan" : "text-paper/20"
                )}>
                  <div className={cn(
                    "w-[28px] h-[28px] rounded-full grid place-items-center border text-[11px] font-bold transition-all duration-300",
                    step > i 
                      ? "bg-[#f5b400] border-[#f5b400] text-slate-950 shadow-[0_0_12px_rgba(245,180,0,0.45)]" 
                      : step === i 
                      ? "bg-transparent border-[#00d4ff] text-[#00d4ff] shadow-[0_0_12px_rgba(0,212,255,0.3)]" 
                      : "border-white/10"
                  )}>
                    {step > i ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className="tracking-[0.06em]">{s.question}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Card Chassis */}
          <div className="glass-hud text-cyan-100 rounded-2xl p-9 shadow-[0_0_50px_rgba(0,212,255,0.1)] relative overflow-hidden">
            
            {/* Ambient scanning lines inside card */}
            <div className="radar-scan-line" />

            {/* Top Telemetry */}
            <div className="flex justify-between items-center text-[7.5px] font-mono tracking-[0.24em] text-cyan-400/40 mb-6">
              <span>TERMINAL // DEVIS_ONLINE_CH2</span>
              <span>RDC // CONGO.HQ</span>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-cyan-500/10 rounded-full mb-6 overflow-hidden relative">
              <div 
                className="h-full bg-gradient-to-r from-[#00d4ff] to-[#f5b400] transition-all duration-500 ease-out rounded-full shadow-[0_0_8px_#00d4ff]"
                style={{ width: progressWidth }}
              />
            </div>

            <div className="text-[10px] font-mono tracking-[0.22em] uppercase text-[#f5b400] font-semibold mb-2">
              SECTION_0{step + 1} // ACTIVE
            </div>
            <h3 className="font-serif text-2xl font-semibold leading-[1.25] text-cyan-50 mb-6">
              {STEPS[step].question}
            </h3>

            {/* Dynamic steps viewport */}
            <div ref={cardRef} className="min-h-[220px]">
              
              {step === 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DOMAIN_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setFormData({ ...formData, domain: opt.id });
                        setTimeout(handleNext, 450);
                      }}
                      className={cn(
                        "text-left p-4 rounded-xl border transition-all duration-300 flex flex-col gap-1.5 focus:outline-none focus:ring-1 focus:ring-[#00d4ff] hover:-translate-y-0.5 clickable",
                        formData.domain === opt.id 
                          ? "bg-[#00d4ff] border-transparent text-slate-950 shadow-[0_0_20px_rgba(0,212,255,0.4)]" 
                          : "bg-slate-950/40 border-cyan-500/20 text-cyan-100 hover:bg-slate-900/60 hover:border-cyan-400"
                      )}
                    >
                      <strong className={cn("text-[14.5px] font-bold tracking-tight", formData.domain === opt.id ? "text-slate-950" : "text-cyan-50")}>
                        {opt.label}
                      </strong>
                      <span className={cn("text-[11.5px] font-mono leading-none", formData.domain === opt.id ? "text-slate-950/80" : "text-cyan-400/60")}>
                        {opt.desc}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {step === 1 && (
                <div className="flex flex-col gap-4">
                  {isAnalyzing ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-4 text-cyan-300">
                      <Loader2 className="w-8 h-8 animate-spin text-[#00d4ff] shadow-inner" />
                      <div className="flex flex-col items-center gap-1.5">
                        <p className="text-sm font-semibold tracking-wider font-mono animate-pulse">L&apos;IA ANALYSE VOS SPÉCIFICATIONS...</p>
                        <p className="text-[9px] font-mono text-cyan-400/40">GENIE // CIVIL // CONVEYOR ESTIMATES</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="glass-hud-chat border border-cyan-500/25 rounded-xl p-3 flex gap-3 text-xs leading-[1.6] text-cyan-200 mb-2">
                        <Bot className="w-5 h-5 text-[#f5b400] shrink-0" />
                        <p>D&apos;après votre choix en <strong>{DOMAIN_OPTIONS.find(d => d.id === formData.domain)?.label}</strong>, précisez la localisation, la taille estimée ou les délais souhaités.</p>
                      </div>
                      <textarea 
                        value={formData.details}
                        onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                        placeholder="Ex: Construction d'un hangar de 500m² à Lubumbashi d'ici la fin de l'année..."
                        className="w-full min-h-[120px] p-4 rounded-xl bg-slate-950/40 border border-cyan-500/25 text-cyan-50 focus:border-[#00d4ff] focus:ring-1 focus:ring-[#00d4ff] outline-none resize-none text-[13.5px]"
                        autoFocus
                      />
                    </>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-3.5">
                  <input 
                    type="text" 
                    placeholder="Nom complet ou Société" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-4 rounded-xl bg-slate-950/40 border border-cyan-500/25 text-cyan-50 focus:border-[#00d4ff] focus:ring-1 focus:ring-[#00d4ff] outline-none transition-colors text-[13.5px]"
                    autoFocus
                  />
                  <input 
                    type="email" 
                    placeholder="Adresse email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-4 rounded-xl bg-slate-950/40 border border-cyan-500/25 text-cyan-50 focus:border-[#00d4ff] focus:ring-1 focus:ring-[#00d4ff] outline-none transition-colors text-[13.5px]"
                  />
                </div>
              )}

              {step === 3 && (
                <div className="text-center py-6">
                  <div className="w-[76px] h-[76px] rounded-full bg-[#f5b400]/10 border border-[#f5b400]/40 mx-auto mb-5 grid place-items-center shadow-[0_0_30px_rgba(245,180,0,0.15)] relative">
                    {/* Ring Sweep */}
                    <span className="absolute inset-0 rounded-full border border-[#f5b400]/30 scale-125 animate-ping" />
                    <CheckCircle2 className="w-9 h-9 text-[#f5b400]" />
                  </div>
                  <h3 className="font-serif text-[28px] font-semibold text-cyan-50 mb-2">Dossier reçu !</h3>
                  <p className="text-[13.5px] text-cyan-200/70 max-w-[380px] mx-auto leading-relaxed mb-6">Nos ingénieurs examinent votre demande et vous recontacteront sous 24h avec une estimation détaillée.</p>
                  <button 
                    onClick={() => { setStep(0); setFormData({ domain: "", details: "", email: "", name: "" }); }}
                    className="text-xs font-mono font-bold text-[#f5b400] border-b border-[#f5b400]/30 hover:border-[#f5b400] pb-0.5 tracking-[0.16em] uppercase transition-colors"
                  >
                    Nouvelle demande // RESET
                  </button>
                </div>
              )}
            </div>

            {/* Controls */}
            {step > 0 && step < 3 && !isAnalyzing && (
              <div className="flex justify-between items-center mt-6 border-t border-cyan-500/15 pt-5">
                <button 
                  onClick={handlePrev}
                  className="text-[12.5px] font-mono tracking-[0.08em] uppercase text-cyan-400/60 flex items-center gap-1.5 hover:text-cyan-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Retour
                </button>
                <button 
                  onClick={handleNext}
                  disabled={
                    (step === 1 && formData.details.length < 5) || 
                    (step === 2 && (!formData.email || !formData.name))
                  }
                  className="bg-[#00d4ff] text-slate-950 px-6 py-2.5 rounded-full text-xs font-bold font-mono tracking-[0.08em] uppercase flex items-center gap-2 hover:scale-[1.03] transition-all shadow-[0_0_15px_rgba(0,212,255,0.4)] disabled:opacity-30 disabled:pointer-events-none"
                >
                  {step === 2 ? "Envoyer le dossier" : "Continuer"} <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
