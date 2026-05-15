import { NextResponse } from "next/server";

/**
 * POST /api/agent/session
 *
 * Mints an ephemeral Realtime API session via the GA endpoint
 * `POST /v1/realtime/client_secrets`. The browser uses the returned
 * ephemeral key to POST its WebRTC SDP offer to /v1/realtime/calls.
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
  const voice = process.env.OPENAI_REALTIME_VOICE || "marin";

  try {
    const res = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "OpenAI-Safety-Identifier": "prise-sarl-web",
      },
      body: JSON.stringify({
        session: {
          type: "realtime",
          model,
          audio: { output: { voice } },
        },
      }),
    });

    const text = await res.text();
    if (!res.ok) {
      console.error("[/api/agent/session] OpenAI", res.status, text);
      return NextResponse.json(
        { error: "openai_error", status: res.status, detail: text, model },
        { status: res.status }
      );
    }

    const data = JSON.parse(text);
    return NextResponse.json({ value: data.value, model, voice });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
