import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MouseGlow from "@/components/MouseGlow";

export const metadata: Metadata = {
  title: "DojoMath | Cours de mathématiques en ligne",
  description:
    "Réserve des cours de mathématiques en ligne avec DojoMath. Progression, méthode et accompagnement personnalisé.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-slate-950 text-white antialiased">
        {/* Effet souris */}
        <MouseGlow />

        {/* Navigation */}
        <Navbar />

        {/* Contenu des pages */}
        <main className="relative z-10">{children}</main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}