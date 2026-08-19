# PRISE Sarl

Website for a Congolese civil-engineering company — génie civil, telecoms, energy, logistics, training — plus **Ernest**, a bilingual FR/EN voice agent who can show a visitor around and take a lead.

The visual idea is *From Blueprint to Reality*: plates draw themselves like a plotter, then resolve into the live brand.

---

## Stack

Next.js 16 · TypeScript · Tailwind 4 · GSAP · Lenis · Three.js · OpenAI Realtime (WebRTC) · Nodemailer

## Run locally

```bash
git clone https://github.com/Shasha-coder/prisesarl.git
cd prisesarl
copy .env.example .env.local
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000)

The site runs with no keys. Talking to Ernest needs `OPENAI_API_KEY`.

## Ernest

The browser never sees the OpenAI secret.

1. `POST /api/agent/session` mints an ephemeral Realtime client secret
2. WebRTC audio + tools (scroll, language, quote form, email report)
3. Default voice: `cedar`

SMTP (`SMTP_HOST` / `SMTP_USER` / `SMTP_PASS`) is only for the lead email. Conversation still works without it.

## Layout

```
src/app/                 homepage + APIs
src/agent/               prompt, tools, Realtime hook
src/components/sections  hero, domains, atlas, quote, formations
src/i18n                 FR / EN
docs/prototype.html      original HTML prototype
docs/SCOPE.md            original commercial scope
```

`npm run dev` · `npm run build` · `npm run lint`
