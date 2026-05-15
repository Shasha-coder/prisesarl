/**
 * Tool definitions for Ernest.
 *
 * These are sent to the Realtime API as function-call tools. The client
 * dispatches each tool call into AgentControl (see ./controls.ts).
 */

export const AGENT_TOOLS = [
  {
    type: "function" as const,
    name: "scroll_to_section",
    description:
      "Smoothly scroll the visitor's view to a named section of the home page. Use whenever you want to physically guide them while you speak.",
    parameters: {
      type: "object",
      properties: {
        target: {
          type: "string",
          enum: ["hero", "domains", "methode", "projets", "pourquoi", "formations", "devis", "contact"],
          description: "The section id to scroll into view.",
        },
      },
      required: ["target"],
    },
  },
  {
    type: "function" as const,
    name: "highlight_domain",
    description:
      "Briefly pulse one of the five domain cards so the visitor's eye lands on it while you describe it.",
    parameters: {
      type: "object",
      properties: {
        domain: {
          type: "string",
          enum: ["civil", "telecom", "energy", "logistics", "training"],
        },
      },
      required: ["domain"],
    },
  },
  {
    type: "function" as const,
    name: "set_language",
    description:
      "Switch the on-page UI language to French (fr) or English (en). Use when the visitor explicitly asks, or when you detect they prefer one over the other.",
    parameters: {
      type: "object",
      properties: {
        lang: { type: "string", enum: ["fr", "en"] },
      },
      required: ["lang"],
    },
  },
  {
    type: "function" as const,
    name: "open_devis_form",
    description:
      "Scroll to the quote concierge and pre-select a domain to help the visitor start a proper request.",
    parameters: {
      type: "object",
      properties: {
        domain: {
          type: "string",
          enum: ["civil", "telecom", "energy", "logistics", "training"],
        },
      },
      required: [],
    },
  },
  {
    type: "function" as const,
    name: "submit_report",
    description:
      "Send a written briefing of this conversation by email to PRISE management. Call this exactly once at the end of the conversation, whether or not the visitor wants a callback. The transcript is sent automatically.",
    parameters: {
      type: "object",
      properties: {
        summary: {
          type: "string",
          description: "Two or three sentences in French summarizing what the visitor wanted, the discipline involved, and any concrete numbers (timeline, scale, location, budget) they shared.",
        },
        language: {
          type: "string",
          description: "ISO 639-1 code of the language the visitor used, e.g. 'fr', 'en', 'pt', 'sw', 'ar', 'zh'.",
        },
        lead: {
          type: "object",
          description: "Lead capture. Provide empty strings for fields the visitor did not share.",
          properties: {
            name:    { type: "string" },
            email:   { type: "string" },
            phone:   { type: "string" },
            channel: { type: "string", enum: ["email", "phone", "whatsapp", "none", ""] },
            need:    { type: "string" },
          },
          required: ["name", "email", "phone", "channel", "need"],
        },
      },
      required: ["summary", "language", "lead"],
    },
  },
];

export type ToolName = (typeof AGENT_TOOLS)[number]["name"];
