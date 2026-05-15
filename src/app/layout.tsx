import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Monivo — Pagaliau aišku kiek lieka",
  description:
    "Monivo padeda grožio specialistams kasdien matyti, kiek pinigų iš tiesų jų.",
  applicationName: "Monivo",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#F7F4EF",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="lt" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
