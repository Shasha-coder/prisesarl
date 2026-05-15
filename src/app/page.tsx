import { Hero } from "@/components/sections/Hero";
import { Domains } from "@/components/sections/Domains";
import { Methodology } from "@/components/sections/Methodology";
import { Atlas } from "@/components/sections/Atlas";
import { Trust } from "@/components/sections/Trust";
import { Formations } from "@/components/sections/Formations";
import { IntelligentQuote } from "@/components/sections/IntelligentQuote";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EngineeringBusiness",
  "name": "PRISE Sarl",
  "alternateName": "PRISE Engineering",
  "description": "Entreprise congolaise spécialisée en génie civil, télécommunications, énergie, logistique et formation professionnelle.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Kinshasa",
    "addressCountry": "CD",
  },
  "url": "https://prise-sarl.cd",
  "telephone": "+243810000000",
  "areaServed": "RDC",
  "knowsAbout": [
    "Génie Civil",
    "Télécommunications",
    "Énergie solaire",
    "Logistique chantier",
    "Formation professionnelle",
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Domains />
      <Methodology />
      <Atlas />
      <Trust />
      <Formations />
      <IntelligentQuote />
    </>
  );
}
