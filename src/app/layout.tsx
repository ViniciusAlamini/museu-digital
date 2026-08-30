import type { Metadata } from "next";
import { Cinzel, Inter, Caveat, Courier_Prime, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/shared/Navbar";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const courier = Courier_Prime({
  variable: "--font-courier",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Museu Digital — Acervo de Campanhas",
  description: "Acervo digital das suas campanhas de RPG",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${cinzel.variable} ${inter.variable} ${caveat.variable} ${courier.variable} ${playfair.variable} antialiased min-h-screen`}
      >
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
