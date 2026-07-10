import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/ui/WhatsAppFloat";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { I18nProvider } from "@/i18n/I18nProvider";
import { SplashIntro } from "@/components/ui/SplashIntro";
import { AgentDock } from "@/components/ui/AgentDock";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PRISE Sarl — Construire, connecter, alimenter, former",
  description:
    "PRISE Sarl — entreprise congolaise spécialisée en génie civil, télécommunications, énergie, logistique et formation professionnelle. Solutions durables, modernes et fiables.",
  keywords: "génie civil, télécommunications, énergie, logistique, formation, RDC, Congo",
  metadataBase: new URL("https://prise-sarl.cd"),
  applicationName: "PRISE Sarl",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PRISE",
  },
  openGraph: {
    title: "PRISE Sarl — Engineering & Infrastructure",
    description:
      "Solutions durables en génie civil, télécoms, énergie et formation professionnelle en RDC.",
    type: "website",
    locale: "fr_CD",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a2240",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${fraunces.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-ink">
        <I18nProvider>
          <SplashIntro />
          <SmoothScrollProvider>
            <ScrollProgress />
            <CustomCursor />
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
            <WhatsAppFloat />
            <AgentDock />
          </SmoothScrollProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
