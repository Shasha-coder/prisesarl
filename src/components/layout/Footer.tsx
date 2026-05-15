"use client";

import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { useT } from "@/i18n/I18nProvider";

export function Footer() {
  const t = useT();
  return (
    <footer className="bg-ink text-paper pt-20 pb-7 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-blueprint-dark opacity-40 mask-radial-top" />

      <div className="max-w-[1280px] mx-auto px-5 sm:px-7 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">

          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-[34px] h-[34px] rounded-lg bg-white relative grid place-items-center">
                <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="none" stroke="var(--color-ink)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M 6 4 L 6 20 M 6 4 L 14 4 Q 19 4 19 9 Q 19 14 14 14 L 6 14" />
                  <circle cx="6" cy="20" r="1.4" fill="var(--color-hot)" />
                </svg>
              </div>
              <span className="block font-bold tracking-[0.04em] text-[17px] leading-[1.2] text-white">PRISE Sarl</span>
            </div>
            <p className="text-[14px] leading-[1.65] text-paper/70 max-w-[340px]">
              {t("footer.tagline")}
            </p>
          </div>

          <div>
            <h4 className="text-[11px] tracking-[0.22em] uppercase text-gold font-bold mb-5">{t("footer.domains")}</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="#services" className="text-[14px] text-paper/70 hover:text-white transition-colors">{t("nav.services")}</Link></li>
              <li><Link href="#methode" className="text-[14px] text-paper/70 hover:text-white transition-colors">{t("nav.methode")}</Link></li>
              <li><Link href="#formations" className="text-[14px] text-paper/70 hover:text-white transition-colors">{t("nav.formations")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] tracking-[0.22em] uppercase text-gold font-bold mb-5">{t("footer.links")}</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="#projets" className="text-[14px] text-paper/70 hover:text-white transition-colors">{t("nav.projets")}</Link></li>
              <li><Link href="#pourquoi" className="text-[14px] text-paper/70 hover:text-white transition-colors">{t("nav.pourquoi")}</Link></li>
              <li><Link href="#devis" className="text-[14px] text-paper/70 hover:text-white transition-colors">{t("nav.devis")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] tracking-[0.22em] uppercase text-gold font-bold mb-5">{t("footer.contact")}</h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3 text-paper/70">
                <MapPin className="w-4 h-4 mt-0.5 text-hot" />
                <span className="text-[13px] leading-tight">Kinshasa, RDC<br/>Avenue de l&apos;Avenir</span>
              </li>
              <li className="flex items-start gap-3 text-paper/70">
                <Phone className="w-4 h-4 mt-0.5 text-hot" />
                <span className="text-[13px]">+243 81 000 0000</span>
              </li>
              <li className="flex items-start gap-3 text-paper/70">
                <Mail className="w-4 h-4 mt-0.5 text-hot" />
                <span className="text-[13px]">contact@prise-sarl.cd</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-[12px] text-paper/55">
          <p>© {new Date().getFullYear()} PRISE Sarl. {t("footer.copyright")}</p>
          <div className="flex gap-4">
            <Link href="#privacy" className="hover:text-white transition-colors">{t("footer.privacy")}</Link>
            <Link href="#terms" className="hover:text-white transition-colors">{t("footer.terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
