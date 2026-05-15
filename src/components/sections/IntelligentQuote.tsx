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
      spotlightRef.current.style.background = `radial-gradient(circle 380px at ${x}px ${y}px, rgba(245,180,0,0.10), transparent 60%)`;
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
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [step]);

  const handleNext = () => {
    if (step === 1) {
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setStep(prev => prev + 1);
      }, 1500);
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
      
      <div className="absolute inset-0 bg-blueprint-dark pointer-events-none opacity-50" />
      
      <div className="max-w-[1240px] mx-auto px-5 sm:px-7 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <div className="inline-flex items-center gap-2.5 text-[11px] font-bold tracking-[0.32em] uppercase text-gold mb-4">
              <span className="inline-grid place-items-center w-6 h-6 rounded-full bg-gold text-ink text-[10px] tracking-normal font-bold">AI</span>
              {t("quote.eyebrow")}
            </div>
            <h2 className="font-serif font-semibold text-[clamp(34px,4.5vw,52px)] leading-[1.05] tracking-[-0.02em] text-paper mb-5">
              {t("quote.title")}
            </h2>
            <p className="text-base text-paper/70 max-w-[440px] leading-[1.7] mb-8">
              {t("quote.lede")}
            </p>
            
            <div className="flex flex-col gap-3.5">
              {STEPS.map((s, i) => (
                <div key={s.id} className={cn(
                  "flex items-center gap-3.5 text-[13px] transition-colors duration-300",
                  step > i ? "text-paper/50" : step === i ? "text-gold" : "text-paper/30"
                )}>
                  <div className={cn(
                    "w-[26px] h-[26px] rounded-full grid place-items-center border text-[11px] font-semibold transition-all duration-300",
                    step > i ? "bg-hot border-hot text-white" : step === i ? "bg-gold border-gold text-ink" : "border-white/20"
                  )}>
                    {step > i ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  {s.question}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white text-ink rounded-2xl p-9 shadow-xl relative overflow-hidden">
            {/* Progress Bar */}
            <div className="h-1 bg-ink/5 rounded-full mb-6 overflow-hidden">
              <div 
                className="h-full bg-hot transition-all duration-500 ease-out rounded-full"
                style={{ width: progressWidth }}
              />
            </div>

            <div className="text-[11px] tracking-[0.18em] uppercase text-mute font-semibold mb-2">
              Étape 0{step + 1}
            </div>
            <h3 className="font-serif text-2xl font-semibold leading-[1.2] mb-6">
              {STEPS[step].question}
            </h3>

            <div ref={cardRef} className="min-h-[220px]">
              {step === 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {DOMAIN_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setFormData({ ...formData, domain: opt.id });
                        setTimeout(handleNext, 300);
                      }}
                      className={cn(
                        "text-left p-4 rounded-xl border transition-all duration-200 flex flex-col gap-1.5 focus:outline-none focus:ring-2 focus:ring-hot focus:border-transparent hover:-translate-y-0.5",
                        formData.domain === opt.id 
                          ? "bg-ink border-ink text-paper" 
                          : "bg-surface border-transparent hover:bg-white hover:border-ink hover:shadow-sm"
                      )}
                    >
                      <strong className={cn("text-sm font-semibold", formData.domain === opt.id ? "text-paper" : "text-ink")}>{opt.label}</strong>
                      <span className={cn("text-xs", formData.domain === opt.id ? "text-paper/70" : "text-mute")}>{opt.desc}</span>
                    </button>
                  ))}
                </div>
              )}

              {step === 1 && (
                <div className="flex flex-col gap-4">
                  {isAnalyzing ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-4 text-ink-2">
                      <Loader2 className="w-8 h-8 animate-spin text-hot" />
                      <p className="text-sm font-medium animate-pulse">L&apos;IA analyse vos spécifications...</p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-surface border border-ink/5 rounded-xl p-3 flex gap-3 text-sm text-ink-2 mb-2">
                        <Bot className="w-5 h-5 text-hot shrink-0" />
                        <p>D&apos;après votre choix en <strong>{DOMAIN_OPTIONS.find(d => d.id === formData.domain)?.label}</strong>, précisez la localisation, la taille estimée ou les délais souhaités.</p>
                      </div>
                      <textarea 
                        value={formData.details}
                        onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                        placeholder="Ex: Construction d'un hangar de 500m² à Lubumbashi d'ici la fin de l'année..."
                        className="w-full min-h-[120px] p-4 rounded-xl bg-surface border border-transparent focus:bg-white focus:border-ink outline-none resize-y transition-colors text-sm"
                        autoFocus
                      />
                    </>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-3">
                  <input 
                    type="text" 
                    placeholder="Nom complet ou Société" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-4 rounded-xl bg-surface border border-transparent focus:bg-white focus:border-ink outline-none transition-colors text-sm"
                    autoFocus
                  />
                  <input 
                    type="email" 
                    placeholder="Adresse email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-4 rounded-xl bg-surface border border-transparent focus:bg-white focus:border-ink outline-none transition-colors text-sm"
                  />
                </div>
              )}

              {step === 3 && (
                <div className="text-center py-6">
                  <div className="w-[72px] h-[72px] rounded-full bg-ink mx-auto mb-5 grid place-items-center shadow-[0_16px_32px_-10px_rgba(10,34,64,0.4)]">
                    <CheckCircle2 className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="font-serif text-[26px] font-semibold mb-2">Dossier reçu !</h3>
                  <p className="text-sm text-ink-2 mb-6">Nos ingénieurs examinent votre demande et vous recontacteront sous 24h avec une estimation détaillée.</p>
                  <button 
                    onClick={() => { setStep(0); setFormData({ domain: "", details: "", email: "", name: "" }); }}
                    className="text-sm font-semibold text-ink border-b border-ink pb-0.5"
                  >
                    Nouvelle demande
                  </button>
                </div>
              )}
            </div>

            {/* Controls */}
            {step > 0 && step < 3 && !isAnalyzing && (
              <div className="flex justify-between items-center mt-6">
                <button 
                  onClick={handlePrev}
                  className="text-[13px] text-mute font-medium flex items-center gap-1.5 hover:text-ink transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Retour
                </button>
                <button 
                  onClick={handleNext}
                  disabled={
                    (step === 1 && formData.details.length < 5) || 
                    (step === 2 && (!formData.email || !formData.name))
                  }
                  className="bg-ink text-paper px-6 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-ink-2 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:pointer-events-none"
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
