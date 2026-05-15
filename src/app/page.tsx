import { Hero } from "@/components/sections/Hero";
import { Domains } from "@/components/sections/Domains";
import { IntelligentQuote } from "@/components/sections/IntelligentQuote";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EngineeringBusiness",
  "name": "PRISE Sarl",
  "description": "Entreprise congolaise spécialisée en génie civil, télécommunications, énergie, logistique et formation professionnelle.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Kinshasa",
    "addressCountry": "CD"
  },
  "url": "https://prise-sarl.cd",
  "telephone": "+243810000000"
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
      <IntelligentQuote />
    </>
  );
}
