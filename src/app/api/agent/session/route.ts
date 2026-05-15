import { NextResponse } from "next/server";
import { ERNEST_SYSTEM_PROMPT } from "@/agent/system-prompt";
import { AGENT_TOOLS } from "@/agent/tools";

/**
 * POST /api/agent/session
 *
 * Mints an ephemeral Realtime API session for the browser, baking in
 * Ernest's system prompt and tool list so the model has everything it
 * needs from the first audio frame.
 *
 * Requires env: OPENAI_API_KEY.
 * Optional env: OPENAI_REALTIME_MODEL (defaults to "gpt-realtime").
 */
export async function POST() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not set on the server." },
      { status: 500 }
    );
  }

  const model = process.env.OPENAI_REALTIME_MODEL || "gpt-realtime";

  try {
    const res = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        // Default to a warm, neutral voice — model picks language at speak time
        voice: "alloy",
        instructions: ERNEST_SYSTEM_PROMPT,
        modalities: ["audio", "text"],
        tools: AGENT_TOOLS,
        tool_choice: "auto",
        input_audio_transcription: { model: "whisper-1" },
        turn_detection: { type: "server_vad", threshold: 0.5, silence_duration_ms: 700 },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ ...data, model });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
