"use client";

import { useEffect, useRef, useState } from "react";
import {
  scrollToSection,
  highlightDomain,
  setLanguage,
  openDevisForm,
  submitReport,
} from "./controls";
import { ERNEST_SYSTEM_PROMPT } from "./system-prompt";
import { AGENT_TOOLS } from "./tools";

/**
 * useRealtimeAgent
 *
 * Opens a WebRTC connection to OpenAI's Realtime API for full-duplex
 * audio + tool calling. The server mints an ephemeral session key so the
 * raw API key never reaches the browser.
 *
 * The hook also exposes a `sendText()` for the text-mode chat path,
 * implemented over the same data channel.
 *
 * React Compiler handles memoization automatically; we keep ref-stable
 * imperative methods rather than forcing manual `useCallback`.
 */

type TranscriptItem = { role: "agent" | "user" | "system"; text: string; at: string };

export type AgentStatus =
  | "idle"
  | "connecting"
  | "listening"
  | "thinking"
  | "speaking"
  | "error";

interface UseAgentOpts {
  onTranscriptChange?: (items: TranscriptItem[]) => void;
}

export function useRealtimeAgent(opts: UseAgentOpts = {}) {
  const [status, setStatus] = useState<AgentStatus>("idle");
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const transcriptRef = useRef<TranscriptItem[]>([]);
  const optsRef = useRef(opts);
  useEffect(() => { optsRef.current = opts; });

  function pushTranscript(item: TranscriptItem) {
    transcriptRef.current = [...transcriptRef.current, item];
    setTranscript(transcriptRef.current);
    optsRef.current.onTranscriptChange?.(transcriptRef.current);
  }

  function updateLastAgentText(delta: string) {
    const list = [...transcriptRef.current];
    const last = list[list.length - 1];
    if (last && last.role === "agent") {
      list[list.length - 1] = { ...last, text: last.text + delta };
    } else {
      list.push({ role: "agent", text: delta, at: new Date().toISOString() });
    }
    transcriptRef.current = list;
    setTranscript(list);
    optsRef.current.onTranscriptChange?.(list);
  }

  function sendEvent(payload: Record<string, unknown>) {
    const dc = dcRef.current;
    if (!dc || dc.readyState !== "open") return;
    dc.send(JSON.stringify(payload));
  }

  async function dispatchTool(name: string, argsJson: string): Promise<string> {
    let args: Record<string, unknown> = {};
    try { args = JSON.parse(argsJson || "{}"); } catch {}
    switch (name) {
      case "scroll_to_section":
        return scrollToSection(String(args.target ?? "hero"));
      case "highlight_domain":
        return highlightDomain(String(args.domain) as "civil" | "telecom" | "energy" | "logistics" | "training");
      case "set_language":
        return setLanguage(String(args.lang) as "fr" | "en");
      case "open_devis_form":
        return openDevisForm(args.domain ? (String(args.domain) as "civil" | "telecom" | "energy" | "logistics" | "training") : undefined);
      case "submit_report":
        return submitReport({
          summary: String(args.summary ?? ""),
          language: String(args.language ?? "fr"),
          lead: (args.lead as { name: string; email: string; phone: string; channel: string; need: string }) ?? { name: "", email: "", phone: "", channel: "", need: "" },
          transcript: transcriptRef.current,
        });
      default:
        return `Unknown tool ${name}.`;
    }
  }

  function stop() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    analyserRef.current?.disconnect();
    analyserRef.current = null;
    dcRef.current?.close();
    dcRef.current = null;
    pcRef.current?.close();
    pcRef.current = null;
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    if (audioElRef.current) {
      audioElRef.current.srcObject = null;
      audioElRef.current = null;
    }
    setStatus("idle");
    setAudioLevel(0);
  }

  async function start() {
    setError(null);
    setStatus("connecting");
    try {
      const tokenRes = await fetch("/api/agent/session", { method: "POST" });
      const tokenJson = await tokenRes.json().catch(() => null);
      if (!tokenRes.ok) {
        const detail = tokenJson?.detail || tokenJson?.error || tokenRes.statusText;
        console.error("[Ernest] session error", tokenJson);
        throw new Error(`Session ${tokenRes.status}: ${detail}`);
      }
      const ephemeralKey = tokenJson?.client_secret?.value;
      const model = tokenJson?.model ?? "gpt-4o-realtime-preview-2024-12-17";
      if (!ephemeralKey) throw new Error("Session token missing.");

      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      const audio = new Audio();
      audio.autoplay = true;
      audioElRef.current = audio;
      pc.ontrack = (ev) => {
        audio.srcObject = ev.streams[0];
        try {
          const AC = window.AudioContext;
          const ctx = new AC();
          const src = ctx.createMediaStreamSource(ev.streams[0]);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 256;
          src.connect(analyser);
          analyserRef.current = analyser;
          const buf = new Uint8Array(analyser.frequencyBinCount);
          const tick = () => {
            analyser.getByteFrequencyData(buf);
            let sum = 0;
            for (let i = 0; i < buf.length; i++) sum += buf[i];
            setAudioLevel(sum / buf.length / 255);
            rafRef.current = requestAnimationFrame(tick);
          };
          tick();
        } catch {}
      };

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;
      stream.getTracks().forEach((t) => pc.addTrack(t, stream));

      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;
      dc.onopen = () => {
        // Install Ernest's brain over the live data channel. The /sessions
        // endpoint rejects some of these fields in the create payload, but
        // session.update accepts them all.
        dc.send(
          JSON.stringify({
            type: "session.update",
            session: {
              modalities: ["audio", "text"],
              instructions: ERNEST_SYSTEM_PROMPT,
              tools: AGENT_TOOLS,
              tool_choice: "auto",
              input_audio_transcription: { model: "whisper-1" },
              turn_detection: {
                type: "server_vad",
                threshold: 0.5,
                prefix_padding_ms: 300,
                silence_duration_ms: 700,
              },
            },
          })
        );
        setStatus("listening");
      };
      dc.onmessage = (e) => {
        let evt: { type?: string;[k: string]: unknown };
        try { evt = JSON.parse(e.data); } catch { return; }
        const type = evt?.type ?? "";

        if (type === "response.audio_transcript.delta" || type === "response.text.delta") {
          const delta = String(evt.delta ?? "");
          if (delta) updateLastAgentText(delta);
          setStatus("speaking");
        }
        if (type === "response.audio_transcript.done" || type === "response.text.done") {
          setStatus("listening");
        }
        if (type === "conversation.item.input_audio_transcription.completed") {
          const text = String(evt.transcript ?? "");
          if (text) pushTranscript({ role: "user", text, at: new Date().toISOString() });
        }
        if (type === "response.function_call_arguments.done") {
          const name = String(evt.name ?? "");
          const args = String(evt.arguments ?? "{}");
          const callId = String(evt.call_id ?? "");
          dispatchTool(name, args).then((output) => {
            sendEvent({
              type: "conversation.item.create",
              item: {
                type: "function_call_output",
                call_id: callId,
                output: JSON.stringify({ result: output }),
              },
            });
            sendEvent({ type: "response.create" });
          });
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      const sdpRes = await fetch(`https://api.openai.com/v1/realtime?model=${encodeURIComponent(model)}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ephemeralKey}`,
          "Content-Type": "application/sdp",
        },
        body: offer.sdp ?? "",
      });
      const answer = { type: "answer" as const, sdp: await sdpRes.text() };
      await pc.setRemoteDescription(answer);

      setStatus("listening");
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
      setStatus("error");
      stop();
    }
  }

  function sendText(text: string) {
    pushTranscript({ role: "user", text, at: new Date().toISOString() });
    sendEvent({
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [{ type: "input_text", text }],
      },
    });
    sendEvent({ type: "response.create" });
  }

  useEffect(() => () => stop(), []);

  return { status, transcript, audioLevel, error, start, stop, sendText };
}
