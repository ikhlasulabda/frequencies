import type { Metadata } from "next";
import { Sofia, Be_Vietnam_Pro, Geist_Mono, Moon_Dance } from "next/font/google";
import "./globals.css";

const sofia = Sofia({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
});

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const moonDance = Moon_Dance({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Frequencies | Cari lagu yang lu banget",
  description: "Rekomendasi musik berdasarkan kondisi emosional lo sekarang.",
  openGraph: {
    title: "Frequencies",
    description: "Find Your Frequency.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      style={{ colorScheme: 'only light' }}
      className={`${sofia.variable} ${beVietnamPro.variable} ${moonDance.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col"
        style={{ background: '#FFF9F0', color: '#0D0D0D' }}
      >
        {children}
      </body>
    </html>
  );
}