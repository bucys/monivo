import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

const siteUrl = "https://monivo.lt";
const siteTitle = "Monivo — aišku, kiek lieka";
const siteDescription =
  "Monivo padeda individualiai dirbantiems grožio specialistams sekti pajamas, išlaidas ir mokesčių rezervą — kad būtų aiškiau, kiek lieka.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s · Monivo",
  },
  description: siteDescription,
  applicationName: "Monivo",
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "lt_LT",
    siteName: "Monivo",
    title: siteTitle,
    description: siteDescription,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
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
