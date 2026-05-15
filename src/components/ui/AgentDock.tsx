"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Mic, MicOff, Minus, Send, Sparkles, X } from "lucide-react";
import { useRealtimeAgent } from "@/agent/useRealtimeAgent";
import { useI18n } from "@/i18n/I18nProvider";
import { AvatarSVG } from "@/agent/AvatarSVG";

// Defer three.js — it's ~600 KB. Only load when the panel opens.
const Avatar3D = dynamic(() => import("@/agent/Avatar").then((m) => m.Avatar), {
  ssr: false,
  loading: () => <AvatarLoading />,
});

/**
 * AgentDock — Ernest, floating concierge.
 *
 * Bottom-right floating launcher → opens an editorial-styled panel.
 * Two modes: Voice (Realtime API, WebRTC) and Text (same data channel).
 * The launcher also visualizes audio level when speaking.
 */
export function AgentDock() {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [mode, setMode] = useState<"voice" | "text">("voice");
  const [text, setText] = useState("");
  const [glbFailed, setGlbFailed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { status, transcript, audioLevel, error, start, stop, sendText } = useRealtimeAgent();

  // React when the agent calls set_language → update i18n
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<"fr" | "en">).detail;
      if (detail === "fr" || detail === "en") {
        // i18n provider also stores in localStorage; trigger storage event so other tabs sync
        try { window.localStorage.setItem("prise.lang", detail); } catch {}
        // Force a re-mount of provider via custom event listener (added in provider)
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

  const ringScale = 1 + Math.min(audioLevel, 1) * 0.55;

  const statusLabel =
    status === "connecting" ? t("agent.connecting") :
    status === "listening" ? t("agent.listening") :
    status === "speaking"  ? t("agent.thinking") :
    status === "error"     ? t("agent.error") :
    t("agent.tagline");

  return (
    <>
      {/* Floating launcher */}
      <button
        onClick={() => { setOpen(true); setMinimized(false); }}
        className={cn(
          "fixed right-[22px] bottom-[90px] z-[55] w-[60px] h-[60px] rounded-full grid place-items-center text-white transition-all duration-300",
          "bg-gradient-to-br from-ink via-ink-3 to-hot shadow-[0_14px_32px_-8px_rgba(43,183,220,0.55)]",
          open ? "scale-0 opacity-0 pointer-events-none" : "hover:scale-[1.06]"
        )}
        aria-label="Ouvrir Ernest, concierge PRISE"
      >
        <Sparkles className="w-6 h-6" />
        <span className="absolute inset-[-6px] rounded-full border-2 border-hot/40 animate-[waPulse_2.4s_ease-out_infinite]" />
        <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-gold border-2 border-paper" />
      </button>

      {/* Panel */}
      <div
        className={cn(
          "fixed z-[58] transition-all duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)]",
          open && !minimized
            ? "right-[22px] bottom-[22px] w-[min(420px,calc(100vw-44px))] h-[min(640px,calc(100vh-44px))]"
            : open && minimized
            ? "right-[22px] bottom-[22px] w-[260px] h-[64px]"
            : "right-[22px] bottom-[22px] w-[60px] h-[60px] pointer-events-none opacity-0 scale-90"
        )}
      >
        <div className="w-full h-full bg-paper text-ink rounded-2xl shadow-[0_30px_80px_-20px_rgba(10,34,64,0.4)] overflow-hidden flex flex-col paper-edge">

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-ink/8 bg-ink text-paper">
            <AgentAvatar ringScale={ringScale} status={status} />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold tracking-[0.02em] truncate">{t("agent.title")}</p>
              <p className="text-[10.5px] tracking-[0.18em] uppercase opacity-65 truncate">
                {statusLabel}
              </p>
            </div>
            <button
              onClick={() => setMinimized((m) => !m)}
              className="p-1.5 rounded text-paper/70 hover:bg-white/8 hover:text-paper transition-colors"
              aria-label="Réduire"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={() => { stop(); setOpen(false); }}
              className="p-1.5 rounded text-paper/70 hover:bg-white/8 hover:text-paper transition-colors"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {!minimized && (
            <>
              {/* Mode toggle */}
              <div className="flex gap-1 px-4 pt-3">
                <ModeButton active={mode === "voice"} onClick={() => setMode("voice")}>
                  {t("agent.mode.voice")}
                </ModeButton>
                <ModeButton active={mode === "text"} onClick={() => setMode("text")}>
                  {t("agent.mode.text")}
                </ModeButton>
                <span className="ml-auto text-[10px] font-mono tracking-[0.18em] uppercase text-mute self-center">
                  {lang.toUpperCase()} · 60+ lang
                </span>
              </div>

              {/* The face — only mounted when voice mode is active */}
              {mode === "voice" && (
                <div className="relative mx-4 mt-3 h-[210px] rounded-xl overflow-hidden bg-gradient-to-b from-paper-2 to-paper-3 shadow-inner">
                  <div className="absolute inset-0 bg-blueprint-xs opacity-50 pointer-events-none" />
                  {glbFailed ? (
                    <AvatarSVG
                      audioLevel={audioLevel}
                      active={status === "listening" || status === "speaking"}
                      className="absolute inset-0 w-full h-full"
                    />
                  ) : (
                    <Avatar3D
                      audioLevel={audioLevel}
                      active={status === "listening" || status === "speaking"}
                      className="absolute inset-0"
                      onLoadError={() => setGlbFailed(true)}
                    />
                  )}
                  <div className="absolute left-3 bottom-2 right-3 flex items-center justify-between text-[10px] font-mono tracking-[0.22em] uppercase text-ink-2/70">
                    <span>Ernest · live</span>
                    <span>{statusLabel}</span>
                  </div>
                </div>
              )}

              {/* Transcript */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {transcript.length === 0 && (
                  <div className="text-[14px] text-ink-2 leading-[1.6] bg-white/60 border border-ink/8 rounded-xl p-3.5">
                    {t("agent.welcome")}
                  </div>
                )}
                {transcript.map((line, i) => (
                  <div
                    key={i}
                    className={cn(
                      "max-w-[88%] text-[14px] leading-[1.55] rounded-xl px-3.5 py-2.5",
                      line.role === "user"
                        ? "ml-auto bg-ink text-paper"
                        : "bg-white/70 border border-ink/8 text-ink"
                    )}
                  >
                    {line.text}
                  </div>
                ))}
                {error && (
                  <p className="text-[12px] text-rust font-mono">{error}</p>
                )}
              </div>

              {/* Input area */}
              {mode === "voice" ? (
                <div className="border-t border-ink/8 p-4 flex items-center justify-between gap-3">
                  <VoiceWave level={audioLevel} active={status === "listening" || status === "speaking"} />
                  {status === "idle" || status === "error" ? (
                    <button
                      onClick={start}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-hot text-white text-[13px] font-semibold hover:bg-hot-2 transition-all shadow-md"
                    >
                      <Mic className="w-4 h-4" /> {t("agent.start")}
                    </button>
                  ) : (
                    <button
                      onClick={stop}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-ink text-paper text-[13px] font-semibold hover:bg-ink-2 transition-all"
                    >
                      <MicOff className="w-4 h-4" /> {t("agent.stop")}
                    </button>
                  )}
                </div>
              ) : (
                <form
                  className="border-t border-ink/8 p-3 flex items-center gap-2"
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
                    placeholder={t("agent.placeholder")}
                    className="flex-1 px-3.5 py-2.5 rounded-full bg-white border border-ink/10 outline-none focus:border-hot text-[14px]"
                  />
                  <button
                    type="submit"
                    className="w-10 h-10 rounded-full bg-hot text-white grid place-items-center hover:bg-hot-2 transition-colors disabled:opacity-50"
                    disabled={!text.trim()}
                    aria-label="Envoyer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

function ModeButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.04em] transition-all",
        active ? "bg-ink text-paper" : "bg-ink/5 text-ink-2 hover:bg-ink/10"
      )}
    >
      {children}
    </button>
  );
}

function AvatarLoading() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="w-16 h-16 rounded-full border-2 border-hot/40 border-t-hot animate-spin" />
    </div>
  );
}

function AgentAvatar({ ringScale, status }: { ringScale: number; status: string }) {
  return (
    <div className="relative w-9 h-9 grid place-items-center shrink-0">
      <span
        className={cn(
          "absolute inset-0 rounded-full bg-hot/40 transition-transform duration-150",
          status === "listening" || status === "speaking" ? "" : "scale-100"
        )}
        style={{ transform: `scale(${ringScale})` }}
      />
      <span className="relative w-7 h-7 rounded-full bg-gradient-to-br from-paper to-paper-2 grid place-items-center shadow-inner">
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-ink" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="9" r="3.5" />
          <path d="M 5 19 Q 5 14 12 14 Q 19 14 19 19" />
        </svg>
      </span>
    </div>
  );
}

/**
 * VoiceWave — 18 bars that react to the live audio level.
 * A per-bar phase offset (computed once) plus the level value gives
 * the illusion of speech without sampling time during render.
 */
const BAR_PHASES = Array.from({ length: 18 }, (_, i) =>
  0.4 + 0.6 * Math.abs(Math.sin(i * 1.3 + 0.8))
);

function VoiceWave({ level, active }: { level: number; active: boolean }) {
  return (
    <div className="flex items-end gap-[3px] h-8">
      {BAR_PHASES.map((phase, i) => {
        const peak = active
          ? Math.max(0.15, Math.min(1, level * (0.5 + phase)))
          : 0.15;
        return (
          <span
            key={i}
            className="w-[3px] bg-hot rounded-full transition-all duration-150"
            style={{ height: `${peak * 100}%`, opacity: active ? 1 : 0.35 }}
          />
        );
      })}
    </div>
  );
}
