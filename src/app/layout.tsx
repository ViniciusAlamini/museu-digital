import type { Metadata } from "next";
import localFont from "next/font/local";
import { connection } from "next/server";
import "./globals.css";
import "@/components/shared/forms.css";
import "@/components/shared/explorer.css";
import "./library.css";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/shared/AppShell";
import { getCurrentUser } from "@/lib/auth";

const manuscript = localFont({
  src: [
    {
      path: "./fonts/CormorantGaramond.woff2",
      style: "normal",
      weight: "300 700",
    },
    {
      path: "./fonts/CormorantGaramond-Italic.woff2",
      style: "italic",
      weight: "300 700",
    },
  ],
  variable: "--font-cormorant",
  weight: "300 700",
  display: "swap",
  fallback: ["Georgia"],
});
const interfaceFont = localFont({
  src: "./fonts/Manrope.woff2",
  variable: "--font-manrope",
  weight: "200 800",
  display: "swap",
  fallback: ["Arial"],
});
export const metadata: Metadata = {
  title: "Museu Digital — Um arquivo de aventuras",
  description:
    "Um lugar para guardar as campanhas, os personagens e as histórias das nossas mesas de RPG.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await connection();
  const user = await getCurrentUser();
  if (!user) {
    return (
      <html lang="pt-BR">
        <body className={`${manuscript.variable} ${interfaceFont.variable}`}>
          <main className="auth-layout">{children}</main>
        </body>
      </html>
    );
  }
  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, system: true },
  });
  return (
    <html lang="pt-BR">
      <body className={`${manuscript.variable} ${interfaceFont.variable}`}>
        <AppShell campaigns={campaigns} user={user}>{children}</AppShell>
      </body>
    </html>
  );
}
