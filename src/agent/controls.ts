/**
 * Tool-call dispatchers. Pure DOM/window side-effects.
 *
 * Each handler returns a short string the agent can speak back as
 * confirmation ("done", "section opened", …). The agent's audio reply
 * does NOT depend on this — it's just structured feedback for the model.
 */

type Domain = "civil" | "telecom" | "energy" | "logistics" | "training";

const SECTION_BY_NAME: Record<string, string> = {
  hero:       "[aria-label='Hero']",
  domains:    "#services",
  methode:    "#methode",
  projets:    "#projets",
  pourquoi:   "#pourquoi",
  formations: "#formations",
  devis:      "#devis",
  contact:    "#devis",
};

export function scrollToSection(target: string) {
  const sel = SECTION_BY_NAME[target] ?? `#${target}`;
  const el = typeof document !== "undefined" ? document.querySelector(sel) : null;
  if (!el) return `Section ${target} introuvable.`;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  return `Scrolled to ${target}.`;
}

export function highlightDomain(domain: Domain) {
  if (typeof document === "undefined") return "no-dom";
  // Each domain card has a stable order: index 0..4
  const order: Domain[] = ["civil", "telecom", "energy", "logistics", "training"];
  const idx = order.indexOf(domain);
  if (idx < 0) return `Unknown domain ${domain}.`;
  const section = document.querySelector("#services");
  if (!section) return "Section services introuvable.";
  section.scrollIntoView({ behavior: "smooth", block: "start" });
  const cards = section.querySelectorAll<HTMLElement>(".group.relative.bg-white");
  const card = cards[idx];
  if (!card) return "Card not found.";
  // CSS pulse: add a class for 2 seconds.
  card.classList.add("agent-pulse");
  window.setTimeout(() => card.classList.remove("agent-pulse"), 2400);
  return `Highlighted ${domain}.`;
}

export function setLanguage(lang: "fr" | "en") {
  if (typeof window === "undefined") return "no-window";
  try {
    window.localStorage.setItem("prise.lang", lang);
  } catch {}
  window.dispatchEvent(new CustomEvent("prise:lang-request", { detail: lang }));
  return `Language switched to ${lang}.`;
}

export function openDevisForm(domain?: Domain) {
  scrollToSection("devis");
  if (domain) {
    window.dispatchEvent(new CustomEvent("prise:devis-preselect", { detail: domain }));
  }
  return `Devis form opened${domain ? ` with ${domain} pre-selected` : ""}.`;
}

export async function submitReport(payload: {
  summary: string;
  language: string;
  lead: { name: string; email: string; phone: string; channel: string; need: string };
  transcript: { role: "agent" | "user" | "system"; text: string; at: string }[];
}) {
  try {
    const res = await fetch("/api/agent/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const t = await res.text();
      return `Report send failed: ${t || res.status}`;
    }
    return "Report sent to PRISE management.";
  } catch (err) {
    return `Report send error: ${(err as Error).message}`;
  }
}
