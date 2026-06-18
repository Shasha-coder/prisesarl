"use client";

import { useEffect, useState } from "react";

/* ── Countdown target: 30 days from now ── */
function getTarget() {
  if (typeof window === "undefined") return Date.now() + 30 * 86400000;
  const key = "prise_cs_target";
  const stored = localStorage.getItem(key);
  if (stored) return parseInt(stored, 10);
  const t = Date.now() + 30 * 86400000;
  localStorage.setItem(key, String(t));
  return t;
}

function useClock(target: number) {
  const calc = () => {
    const d = Math.max(0, target - Date.now());
    return {
      days: Math.floor(d / 86400000),
      hours: Math.floor((d % 86400000) / 3600000),
      minutes: Math.floor((d % 3600000) / 60000),
      seconds: Math.floor((d % 60000) / 1000),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const i = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
  return t;
}

/* ── Particles ── */
function Particles() {
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: 1 + Math.random() * 2,
    dur: 8 + Math.random() * 14,
    delay: Math.random() * 10,
    opacity: 0.3 + Math.random() * 0.5,
  }));

  return (
    <div className="cs-particles">
      {particles.map((p) => (
        <div
          key={p.id}
          className="cs-particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ── WhatsApp Icon ── */
function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

/* ── Mail Icon ── */
function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

/* ── Main Page ── */
export default function ComingSoon() {
  const [target, setTarget] = useState(Date.now() + 30 * 86400000);
  useEffect(() => { setTarget(getTarget()); }, []);
  const clock = useClock(target);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="cs-wrapper">
      {/* Background effects */}
      <div className="cs-orb cs-orb--1" />
      <div className="cs-orb cs-orb--2" />
      <div className="cs-orb cs-orb--3" />
      <div className="cs-grid" />
      <div className="cs-scanline" />
      <Particles />

      {/* Corner accents */}
      <div className="cs-corner cs-corner--tl" />
      <div className="cs-corner cs-corner--tr" />
      <div className="cs-corner cs-corner--bl" />
      <div className="cs-corner cs-corner--br" />

      {/* Logo */}
      <div className="cs-logo">
        <div className="cs-logo-ring">
          <span className="cs-logo-text">P</span>
        </div>
      </div>

      {/* Content */}
      <div className="cs-content">
        <div className="cs-eyebrow">
          <span className="cs-eyebrow-dot" />
          En construction
        </div>

        <h1 className="cs-heading">
          <em>Coming Soon</em>
        </h1>

        <p className="cs-sub">
          PRISE Sarl prépare quelque chose d&apos;exceptionnel.
          Notre nouveau site sera bientôt en ligne.
        </p>

        {/* Countdown */}
        <div className="cs-countdown">
          <div className="cs-countdown-block">
            <span className="cs-countdown-value">{pad(clock.days)}</span>
            <span className="cs-countdown-label">Jours</span>
          </div>
          <span className="cs-countdown-sep">:</span>
          <div className="cs-countdown-block">
            <span className="cs-countdown-value">{pad(clock.hours)}</span>
            <span className="cs-countdown-label">Heures</span>
          </div>
          <span className="cs-countdown-sep">:</span>
          <div className="cs-countdown-block">
            <span className="cs-countdown-value">{pad(clock.minutes)}</span>
            <span className="cs-countdown-label">Minutes</span>
          </div>
          <span className="cs-countdown-sep">:</span>
          <div className="cs-countdown-block">
            <span className="cs-countdown-value">{pad(clock.seconds)}</span>
            <span className="cs-countdown-label">Secondes</span>
          </div>
        </div>

        {/* CTA */}
        <div className="cs-cta-row">
          <a
            href="https://wa.me/243824613377"
            target="_blank"
            rel="noopener noreferrer"
            className="cs-btn cs-btn--primary"
          >
            <WhatsAppIcon /> Nous contacter
          </a>
          <a
            href="mailto:contact@prise-sarl.cd"
            className="cs-btn cs-btn--ghost"
          >
            <MailIcon /> Email
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="cs-footer">
        <span>© {new Date().getFullYear()} PRISE Sarl</span>
        <span className="cs-footer-sep" />
        <span>Kinshasa, RDC</span>
        <span className="cs-footer-sep" />
        <a href="tel:+243824613377">+243 824 613 377</a>
      </footer>
    </div>
  );
}
