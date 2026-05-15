import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-ink text-paper pt-20 pb-7 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-blueprint-dark opacity-40 mask-radial-top" />
      
      <div className="max-w-[1240px] mx-auto px-5 sm:px-7 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-[34px] h-[34px] rounded-lg bg-white relative grid place-items-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M2 15h10" />
                  <path d="m9 18 3-3-3-3" />
                </svg>
              </div>
              <div>
                <span className="block font-bold tracking-[0.04em] text-[17px] leading-[1.2] text-white">PRISE Sarl</span>
              </div>
            </div>
            <p className="text-[14px] leading-[1.65] text-paper/70 max-w-[340px]">
              PRISE Sarl est une entreprise congolaise spécialisée en ingénierie globale. De la conception à la réalisation, nous construisons, connectons, alimentons et formons pour un avenir durable.
            </p>
          </div>

          <div>
            <h4 className="text-[11px] tracking-[0.22em] uppercase text-gold font-bold mb-5">Domaines</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="#civil" className="text-[14px] text-paper/70 hover:text-white transition-colors">Génie Civil</Link></li>
              <li><Link href="#telecom" className="text-[14px] text-paper/70 hover:text-white transition-colors">Télécommunications</Link></li>
              <li><Link href="#energy" className="text-[14px] text-paper/70 hover:text-white transition-colors">Énergie</Link></li>
              <li><Link href="#logistics" className="text-[14px] text-paper/70 hover:text-white transition-colors">Logistique</Link></li>
              <li><Link href="#training" className="text-[14px] text-paper/70 hover:text-white transition-colors">Formations</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] tracking-[0.22em] uppercase text-gold font-bold mb-5">Liens Rapides</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="#projets" className="text-[14px] text-paper/70 hover:text-white transition-colors">Projets Vitrines</Link></li>
              <li><Link href="#about" className="text-[14px] text-paper/70 hover:text-white transition-colors">Qui sommes-nous</Link></li>
              <li><Link href="#carrieres" className="text-[14px] text-paper/70 hover:text-white transition-colors">Carrières</Link></li>
              <li><Link href="#devis" className="text-[14px] text-paper/70 hover:text-white transition-colors">Demander un devis</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] tracking-[0.22em] uppercase text-gold font-bold mb-5">Contact</h4>
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
          <p>© {new Date().getFullYear()} PRISE Sarl. Tous droits réservés.</p>
          <div className="flex gap-4">
            <Link href="#privacy" className="hover:text-white transition-colors">Politique de confidentialité</Link>
            <Link href="#terms" className="hover:text-white transition-colors">Mentions légales</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
