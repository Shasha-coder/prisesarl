import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/ui/WhatsAppFloat";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PRISE Sarl — Construire, connecter, former et accompagner l'avenir",
  description: "PRISE Sarl — entreprise congolaise spécialisée en génie civil, télécommunications, énergie, logistique et formation professionnelle. Solutions durables, modernes et fiables.",
  keywords: "génie civil, télécommunications, énergie, logistique, formation, RDC, Congo",
  metadataBase: new URL("https://prise-sarl.cd"),
  openGraph: {
    title: "PRISE Sarl — Engineering & Infrastructure",
    description: "Solutions durables en génie civil, télécoms, énergie et formation professionnelle en RDC.",
    type: "website",
    locale: "fr_CD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-ink">
        <SmoothScrollProvider>
          <ScrollProgress />
          <CustomCursor />
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <WhatsAppFloat />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
