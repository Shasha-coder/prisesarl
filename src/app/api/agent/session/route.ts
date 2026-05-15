import { NextResponse } from "next/server";

/**
 * POST /api/agent/session
 *
 * Mints an ephemeral Realtime API session for the browser. We keep the
 * create payload minimal — only model + voice — because OpenAI's
 * /v1/realtime/sessions endpoint rejects some field combinations that
 * are perfectly valid over the data channel. Instructions, tools and
 * turn detection are applied client-side via a session.update event
 * after the WebRTC data channel opens.
 *
 * Required env: OPENAI_API_KEY
 * Optional env:
 *   OPENAI_REALTIME_MODEL (default: gpt-4o-realtime-preview-2024-12-17)
 *   OPENAI_REALTIME_VOICE (default: alloy)
 */
export async function POST() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not set on the server." },
      { status: 500 }
    );
  }

  const model =
    process.env.OPENAI_REALTIME_MODEL || "gpt-4o-realtime-preview-2024-12-17";
  const voice = process.env.OPENAI_REALTIME_VOICE || "alloy";

  try {
    const res = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "realtime=v1",
      },
      body: JSON.stringify({ model, voice }),
    });

    const text = await res.text();
    if (!res.ok) {
      // Bubble the upstream error body up to the browser console so
      // misconfiguration (wrong model name, no API access, etc.) is visible.
      console.error("[/api/agent/session] OpenAI", res.status, text);
      return NextResponse.json(
        { error: "openai_error", status: res.status, detail: text, model },
        { status: res.status }
      );
    }

    const data = JSON.parse(text);
    return NextResponse.json({ ...data, model });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
