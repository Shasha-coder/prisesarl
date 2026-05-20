"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Mic, MicOff, Send, X } from "lucide-react";
import { useRealtimeAgent } from "@/agent/useRealtimeAgent";
import { useI18n } from "@/i18n/I18nProvider";
import { AvatarSVG } from "@/agent/AvatarSVG";
import { AgentLauncher } from "@/components/ui/AgentLauncher";

// Defer three.js — load on demand
const Avatar3D = dynamic(() => import("@/agent/Avatar").then((m) => m.Avatar), {
  ssr: false,
  loading: () => <AvatarLoading />,
});

export function AgentDock() {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"voice" | "text">("voice");
  const [text, setText] = useState("");
  const [glbFailed, setGlbFailed] = useState(true); // Force Siri/Apple Bronze Sphere fallback by default for maximum clean styling match
  const scrollRef = useRef<HTMLDivElement>(null);

  const { status, transcript, audioLevel, error, start, stop, sendText } = useRealtimeAgent();

  // Dynamic status details matching the Apple image slot header style
  const statusDetail = 
    status === "connecting" ? "Slot: Synchronizing..." :
    status === "listening"  ? "Slot: Waiting for input..." :
    status === "speaking"   ? "Slot: Analyzing specifications..." :
    status === "error"      ? "Slot: Connection offline" :
    "Slot: 7:00 AM on Wednesday";

  const greenStatusLabel = 
    status === "connecting" ? "MECLIENT CONNECTING" :
    status === "listening"  ? "MECLIENT LISTENING" :
    status === "speaking"   ? "MECLIENT SPEAKING" :
    status === "error"      ? "MECLIENT OFFLINE" :
    "MECLIENT CONNECTED";

  // Sync language requests
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<"fr" | "en">).detail;
      if (detail === "fr" || detail === "en") {
        try { window.localStorage.setItem("prise.lang", detail); } catch {}
        window.dispatchEvent(new CustomEvent("prise:lang", { detail }));
      }
    };
    window.addEventListener("prise:lang-request", handler);
    return () => window.removeEventListener("prise:lang-request", handler);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  return (
    <>
      <AgentLauncher
        onClick={() => { setOpen(true); }}
        hidden={open}
        ariaLabel={t("agent.title")}
      />

      {/* Elegant Apple/Microsoft style voice assistant card */}
      <div
        className={cn(
          "fixed z-[58] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          open
            ? "right-[20px] bottom-[20px] w-[min(410px,calc(100vw-40px))] h-[min(620px,calc(100vh-40px))]"
            : "right-[20px] bottom-[20px] w-[60px] h-[60px] pointer-events-none opacity-0 scale-95"
        )}
      >
        <div className="w-full h-full bg-white text-slate-800 border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.12)] rounded-2xl overflow-hidden flex flex-col relative font-sans">
          
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white relative z-10">
            <div>
              <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-slate-400">
                AI QUALIFICATION ASSISTANT
              </p>
              <h3 className="text-[16px] font-bold text-slate-850 tracking-tight mt-0.5">
                {statusDetail}
              </h3>
            </div>
            <button
              onClick={() => { stop(); setOpen(false); }}
              className="p-1.5 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-800 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Central stage area (White, minimal) */}
          <div className="flex-1 overflow-y-auto flex flex-col bg-white">
            
            {mode === "voice" && (
              <div className="relative w-full flex flex-col items-center justify-center pt-8 pb-5 bg-white border-b border-slate-50 shrink-0">
                
                {/* Mode toggle floating pills */}
                <div className="absolute top-2.5 flex items-center gap-1 bg-slate-100 rounded-full p-1 z-10">
                  <ModePill active={true} onClick={() => setMode("voice")}>
                    {t("agent.mode.voice")}
                  </ModePill>
                  <ModePill active={false} onClick={() => setMode("text")}>
                    {t("agent.mode.text")}
                  </ModePill>
                </div>

                {glbFailed ? (
                  <AvatarSVG
                    audioLevel={audioLevel}
                    active={status === "listening" || status === "speaking"}
                    className="w-full h-[160px]"
                  />
                ) : (
                  <Avatar3D
                    audioLevel={audioLevel}
                    active={status === "listening" || status === "speaking"}
                    className="w-full h-[160px]"
                    onLoadError={() => setGlbFailed(true)}
                  />
                )}

                {/* Minimal 9-bar volume line visualizer (Gray tones, non-flashy) */}
                <VoiceWave level={audioLevel} active={status === "listening" || status === "speaking"} />

                {/* Monospace emerald listening tag */}
                <div className="mt-4 font-mono text-[10.5px] font-bold tracking-wider text-emerald-500 flex items-center gap-2 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {greenStatusLabel}
                </div>
              </div>
            )}

            {mode === "text" && (
              <div className="flex items-center px-5 py-3.5 bg-slate-50 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-1 bg-slate-100 rounded-full p-1">
                  <ModePill active={false} onClick={() => setMode("voice")}>
                    {t("agent.mode.voice")}
                  </ModePill>
                  <ModePill active={true} onClick={() => setMode("text")}>
                    {t("agent.mode.text")}
                  </ModePill>
                </div>
                <span className="ml-auto text-[9.5px] font-mono tracking-[0.16em] uppercase text-slate-400 font-semibold">
                  {lang.toUpperCase()} // SYSTEM
                </span>
              </div>
            )}

            {/* Chat Transcript Area */}
            <div 
              ref={scrollRef} 
              className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-white"
            >
              {transcript.length === 0 && (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-2.5">
                  <span className="font-mono text-[9px] font-bold tracking-[0.16em] text-slate-400 uppercase">
                    AI CONCIERGE
                  </span>
                  <p className="text-[13.5px] leading-[1.6] text-slate-700">{t("agent.welcome")}</p>
                </div>
              )}

              {transcript.map((line, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  {line.role === "user" ? (
                    <div className="ml-auto max-w-[85%] text-[13.5px] leading-[1.6] bg-slate-100 text-slate-800 rounded-2xl rounded-tr-none px-4 py-3 border border-slate-200/50 shadow-sm">
                      {line.text}
                    </div>
                  ) : (
                    <div className="mr-auto max-w-[85%] bg-slate-50 border border-slate-150 rounded-2xl rounded-tl-none px-4 py-3 flex flex-col gap-1.5">
                      <span className="font-mono text-[8.5px] font-bold tracking-[0.16em] text-slate-400 uppercase">
                        AI CONCIERGE
                      </span>
                      <p className="text-[13.5px] leading-[1.6] text-slate-700">{line.text}</p>
                    </div>
                  )}
                </div>
              ))}
              
              {error && (
                <div className="text-[11px] text-rose-500 font-mono bg-rose-50 border border-rose-100 p-2.5 rounded-xl">
                  Error: {error}
                </div>
              )}
            </div>
          </div>

          {/* Quick suggestions area */}
          {!error && (
            <div className="px-5 pt-3 bg-white shrink-0">
              <p className="text-[8.5px] font-bold tracking-[0.16em] text-slate-400 mb-2 font-mono uppercase">
                SUGGESTED REASONS (TEST):
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                <SuggestionPill onClick={() => sendText("Génie Civil")}>Génie Civil</SuggestionPill>
                <SuggestionPill onClick={() => sendText("Télécoms")}>Télécoms</SuggestionPill>
                <SuggestionPill onClick={() => sendText("Énergie")}>Énergie</SuggestionPill>
                <SuggestionPill onClick={() => sendText("Logistique")}>Logistique</SuggestionPill>
                <SuggestionPill onClick={() => sendText("Demande de Devis")}>Devis</SuggestionPill>
                <SuggestionPill onClick={() => sendText("Une requête non reliée")} red={true}>Irrelevant Request</SuggestionPill>
              </div>
            </div>
          )}

           {/* Bottom input area */}
          <div className="border-t border-slate-100 bg-white p-4 flex items-center gap-3 relative z-10 shrink-0">
            {/* Inline CSS micro-animations for professional After Effects feel */}
            <style>{`
              @keyframes voicePulse {
                0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 136, 255, 0.5); }
                70% { transform: scale(1.03); box-shadow: 0 0 0 10px rgba(0, 136, 255, 0); }
                100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 136, 255, 0); }
              }
              .animate-voice-pulse {
                animation: voicePulse 2.2s infinite cubic-bezier(0.16, 1, 0.3, 1);
              }
            `}</style>

            {mode === "voice" ? (
              <div className="flex items-center justify-between w-full gap-3">
                <span className="text-[11.5px] font-mono text-slate-400 tracking-wider uppercase font-semibold">
                  TALK TO ERNEST
                </span>
                {status === "idle" || status === "error" ? (
                  <button
                    onClick={start}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#0088ff] to-[#00f2fe] hover:from-[#0077ee] hover:to-[#00e2ee] text-white text-[13px] font-bold transition-all shadow-md animate-voice-pulse active:scale-95"
                  >
                    <Mic className="w-4 h-4" /> Start Listening
                  </button>
                ) : (
                  <button
                    onClick={stop}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white text-[13px] font-bold hover:bg-black transition-all shadow-md active:scale-95"
                  >
                    <MicOff className="w-4 h-4" /> Stop Listening
                  </button>
                )}
              </div>
            ) : (
              <form
                className="w-full flex items-center gap-2.5"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!text.trim()) return;
                  if (status === "idle") start();
                  sendText(text.trim());
                  setText("");
                }}
              >
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type your appointment reason..."
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-0 text-[13.5px] transition-colors"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-[#ff8a65] text-white font-bold hover:bg-[#d84315] transition-colors disabled:opacity-40 disabled:pointer-events-none text-[13px] flex items-center gap-1.5"
                  disabled={!text.trim()}
                >
                  Send
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function ModePill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-[0.06em] uppercase transition-all duration-200",
        active
          ? "bg-white text-slate-800 shadow-sm"
          : "text-slate-500 hover:text-slate-800"
      )}
    >
      {children}
    </button>
  );
}

function SuggestionPill({ children, onClick, red = false }: { children: React.ReactNode; onClick: () => void; red?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3.5 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap transition-all duration-150 active:scale-95 shrink-0 clickable",
        red 
          ? "border-rose-200 bg-white text-rose-500 hover:bg-rose-50"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-350"
      )}
    >
      {children}
    </button>
  );
}

function AvatarLoading() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-white">
      <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-slate-400 animate-spin" />
    </div>
  );
}

function VoiceWave({ level, active }: { level: number; active: boolean }) {
  // Simple, elegant 9-bar volume line visualizer (Gray tones, Apple style)
  const BAR_COUNT = 9;
  const BAR_PHASES = [0.4, 0.7, 0.5, 0.9, 0.8, 0.9, 0.5, 0.7, 0.4];

  return (
    <div className="flex items-end justify-center gap-[4px] h-4 mt-6">
      {BAR_PHASES.map((phase, i) => {
        const peak = active
          ? Math.max(0.2, Math.min(1, level * (0.4 + phase * 0.8)))
          : 0.2;
        return (
          <span
            key={i}
            className="w-[3px] rounded-full transition-all duration-150"
            style={{ 
              height: `${peak * 100}%`, 
              backgroundColor: active ? "#334155" : "#cbd5e1",
            }}
          />
        );
      })}
    </div>
  );
}
