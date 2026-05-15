import { NextResponse } from "next/server";
import { ERNEST_SYSTEM_PROMPT } from "@/agent/system-prompt";
import { AGENT_TOOLS } from "@/agent/tools";

/**
 * POST /api/agent/session
 *
 * Mints an ephemeral Realtime session via the GA endpoint
 * `POST /v1/realtime/client_secrets`. We bake Ernest's instructions
 * and tools into the create call itself so the model has its brain
 * from the very first audio frame — no race with the data channel.
 *
 * Required env: OPENAI_API_KEY
 * Optional env:
 *   OPENAI_REALTIME_MODEL (default: gpt-realtime)
 *   OPENAI_REALTIME_VOICE (default: marin)
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
  // "cedar" is the GA male voice — warm, charismatic, professional.
  // Alternates if you want to A/B: "onyx" (deeper, more formal),
  // "echo" (lighter), "verse" (more expressive). Override via env.
  const voice = process.env.OPENAI_REALTIME_VOICE || "cedar";

  const sessionConfig = {
    type: "realtime",
    model,
    instructions: ERNEST_SYSTEM_PROMPT,
    tools: AGENT_TOOLS,
    tool_choice: "auto",
    audio: {
      output: { voice },
      input: {
        transcription: { model: "whisper-1" },
        turn_detection: {
          type: "server_vad",
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 700,
        },
      },
    },
  };

  try {
    const res = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "OpenAI-Safety-Identifier": "prise-sarl-web",
      },
      body: JSON.stringify({ session: sessionConfig }),
    });

    const text = await res.text();
    if (!res.ok) {
      console.error("[/api/agent/session] OpenAI", res.status, text);
      // Fall back to a minimal session if the rich config was rejected — we'll
      // still install the brain over session.update from the client.
      if (res.status === 400) {
        const minimal = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "OpenAI-Safety-Identifier": "prise-sarl-web",
          },
          body: JSON.stringify({
            session: { type: "realtime", model, audio: { output: { voice } } },
          }),
        });
        const minimalText = await minimal.text();
        if (!minimal.ok) {
          return NextResponse.json(
            { error: "openai_error", status: minimal.status, detail: minimalText, model },
            { status: minimal.status }
          );
        }
        const minimalData = JSON.parse(minimalText);
        return NextResponse.json({
          value: minimalData.value,
          model,
          voice,
          brainInjected: false,
        });
      }
      return NextResponse.json(
        { error: "openai_error", status: res.status, detail: text, model },
        { status: res.status }
      );
    }

    const data = JSON.parse(text);
    return NextResponse.json({
      value: data.value,
      model,
      voice,
      brainInjected: true,
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
