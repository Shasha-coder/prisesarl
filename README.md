# PRISE Sarl

Marketing site for a Congolese civil-engineering company (génie civil, telecoms, energy, logistics, training), with **Ernest** — a bilingual FR/EN voice agent that can walk a visitor through the services and take a lead.

**Concept:** *From Blueprint to Reality* — sections draw themselves as technical plates, then resolve into the live brand.

---

## Table of contents

1. [What it does](#what-it-does)
2. [Tech stack](#tech-stack)
3. [Getting started](#getting-started)
4. [Environment variables](#environment-variables)
5. [Voice agent](#voice-agent)
6. [Project layout](#project-layout)
7. [Security](#security)
8. [Scripts](#scripts)

---

## What it does

- Full homepage: hero plotter, domains, methodology, DRC atlas, trust, formations, conversational quote
- FR / EN i18n
- WhatsApp CTA (`+243 824 613 377`)
- **Ernest** (OpenAI Realtime): spoken tour, section jumps, quote intake, email report
- Original HTML prototype kept as `prototype.html` (no build)

The production Next.js app is what you run locally. The site lock / suspension page has been removed so `npm run dev` serves the real experience.

## Tech stack

| Layer | Technology |
|-------|------------|
| App | Next.js 16 (App Router, TypeScript) |
| UI | Tailwind CSS 4, GSAP, Lenis, Framer Motion |
| 3D / motion | Three.js, Rive |
| Voice | OpenAI Realtime API (WebRTC, ephemeral session) |
| Email | Nodemailer / SMTP (lead reports) |
| i18n | Custom FR/EN dictionary |

## Getting started

**Prerequisites:** Node.js 20+. An OpenAI API key is required only if you want to talk to Ernest.

```bash
git clone https://github.com/Shasha-coder/prisesarl.git
cd prisesarl
copy .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The marketing site loads without any keys. Click the agent dock to start a voice session once `OPENAI_API_KEY` is set.

## Environment variables

Copy `.env.example` → `.env.local`. **Never commit real keys.**

| Variable | Required | Purpose |
|----------|----------|---------|
| `OPENAI_API_KEY` | Voice agent | Server mints an ephemeral Realtime client secret |
| `OPENAI_REALTIME_MODEL` | No | Default `gpt-realtime` |
| `OPENAI_REALTIME_VOICE` | No | Default `cedar` (male Realtime voice) |
| `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` | Lead emails | Ernest’s `/api/agent/report` |
| `AGENT_REPORT_TO` | No | Inbox for those reports |

## Voice agent

Ernest runs in the browser over WebRTC. Flow:

1. Client calls `POST /api/agent/session`
2. Server calls OpenAI `client_secrets` with Ernest’s system prompt + tools
3. Browser uses the **ephemeral** key — the raw `OPENAI_API_KEY` never leaves the server
4. Tools can scroll sections, switch language, open the quote form, and submit a report

Without SMTP, conversation still works; only the email report returns 500.

## Project layout

```
src/app/                 Homepage + API (session, report, quote)
src/agent/               Ernest prompt, tools, Realtime hook, avatar
src/components/sections  Hero, domains, atlas, quote, formations
src/components/ui        Agent dock, splash, cursor, WhatsApp
src/i18n/                FR / EN
prototype.html           Standalone HTML prototype
SCOPE.md                 Original commercial scope
```

## Security

- `.env*` is gitignored except `.env.example` (placeholders).
- OpenAI key is server-only; the client receives a short-lived session secret.
- SMTP credentials are server-only.
- Do not commit production mailbox passwords.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local dev server — [http://localhost:3000](http://localhost:3000) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

---

Private portfolio project.
