import { NextResponse } from "next/server";
import { Resend } from "resend";

/**
 * POST /api/agent/report
 *
 * Receives the final summary + lead + full transcript from Ernest and
 * emails it to ernestk@prisesarl.com.
 *
 * Requires env: RESEND_API_KEY.
 * Optional env:
 *   AGENT_REPORT_TO   (defaults to ernestk@prisesarl.com)
 *   AGENT_REPORT_FROM (defaults to ernest@prise-sarl.cd; must match a Resend-verified domain)
 */

interface ReportPayload {
  summary: string;
  language: string;
  lead: { name: string; email: string; phone: string; channel: string; need: string };
  transcript: { role: "agent" | "user" | "system"; text: string; at: string }[];
}

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "RESEND_API_KEY is not set on the server." },
      { status: 500 }
    );
  }

  let body: ReportPayload;
  try {
    body = (await req.json()) as ReportPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const to = process.env.AGENT_REPORT_TO || "ernestk@prisesarl.com";
  const from = process.env.AGENT_REPORT_FROM || "Ernest (PRISE) <onboarding@resend.dev>";

  const resend = new Resend(apiKey);

  const transcriptHtml = (body.transcript ?? [])
    .map(
      (t) => `
      <tr>
        <td style="padding:4px 12px 4px 0;color:#8a96aa;font-size:12px;white-space:nowrap;text-transform:uppercase;letter-spacing:0.1em;vertical-align:top;">
          ${t.role}
        </td>
        <td style="padding:4px 0;color:#0a2240;font-size:14px;line-height:1.55;">
          ${escapeHtml(t.text)}
        </td>
      </tr>`
    )
    .join("");

  const html = `
  <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:680px;margin:auto;padding:32px;color:#0a2240;background:#fbf7eb;">
    <h1 style="font-family:Georgia,serif;font-size:24px;margin:0 0 4px;">Ernest · briefing visiteur</h1>
    <p style="color:#8a96aa;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 24px;">
      Langue ${escapeHtml(body.language || "—")} · ${new Date().toLocaleString("fr-FR")}
    </p>

    <h2 style="font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:#c8632b;margin:24px 0 8px;">Résumé</h2>
    <p style="font-size:15px;line-height:1.65;margin:0 0 24px;">${escapeHtml(body.summary || "—")}</p>

    <h2 style="font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:#c8632b;margin:24px 0 8px;">Lead capturé</h2>
    <table style="font-size:14px;line-height:1.6;border-collapse:collapse;">
      <tr><td style="padding:2px 12px 2px 0;color:#8a96aa;">Nom</td><td>${escapeHtml(body.lead?.name || "—")}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a96aa;">Email</td><td>${escapeHtml(body.lead?.email || "—")}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a96aa;">Téléphone</td><td>${escapeHtml(body.lead?.phone || "—")}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a96aa;">Canal préféré</td><td>${escapeHtml(body.lead?.channel || "—")}</td></tr>
      <tr><td style="padding:2px 12px 2px 0;color:#8a96aa;">Besoin</td><td>${escapeHtml(body.lead?.need || "—")}</td></tr>
    </table>

    <h2 style="font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:#c8632b;margin:32px 0 8px;">Transcription complète</h2>
    <table style="border-collapse:collapse;width:100%;">${transcriptHtml || "<tr><td>(vide)</td></tr>"}</table>

    <hr style="border:none;border-top:1px solid #ece4d2;margin:32px 0 16px;" />
    <p style="font-size:11px;color:#8a96aa;letter-spacing:0.1em;text-transform:uppercase;margin:0;">
      Envoi automatique · PRISE Sarl
    </p>
  </div>
  `;

  try {
    const result = await resend.emails.send({
      from,
      to,
      subject: `[Ernest] ${body.lead?.name || "Visiteur"} — ${body.summary?.slice(0, 60) || "Briefing"}`,
      html,
    });
    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, id: result.data?.id ?? null });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

function escapeHtml(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
