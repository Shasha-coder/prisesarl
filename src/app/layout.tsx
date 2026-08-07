import type { Metadata, Viewport } from "next";
import { SUSPENSION_MESSAGE } from "@/lib/site-lock";
import "./globals.css";

export const metadata: Metadata = {
  title: "Account Suspended",
  description: SUSPENSION_MESSAGE,
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#111111",
  width: "device-width",
  initialScale: 1,
};

/**
 * Hard lock layout: no navbar, footer, agent, WhatsApp, or splash.
 * Full marketing UI is not mounted at all.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body
        className="min-h-full antialiased"
        style={{ margin: 0, background: "#0f0f10", color: "#fff" }}
      >
        {children}
      </body>
    </html>
  );
}
