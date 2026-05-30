import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { LocaleProvider } from "@/i18n/locale-provider";
import { getServerLocale } from "@/i18n/server";
import { MARKETING_BASE_URL } from "@/lib/urls";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

const siteUrl = MARKETING_BASE_URL;
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
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Monivo — aišku, kiek lieka",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF8F4",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Inline pre-hydration script — runs before React paints, so the user's saved
// theme is applied without a light-mode flash. Kept tiny; mirrors the runtime
// helpers in src/lib/theme.ts.
const themeBootstrap = `
(function(){try{
var k='monivo_theme';
var v=localStorage.getItem(k);
if(v!=='light'&&v!=='dark'&&v!=='device')v='device';
var dark=v==='dark'||(v==='device'&&window.matchMedia('(prefers-color-scheme: dark)').matches);
var r=document.documentElement;
if(dark)r.classList.add('dark');else r.classList.remove('dark');
r.dataset.theme=dark?'dark':'light';
r.style.colorScheme=dark?'dark':'light';
}catch(e){}})();
`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getServerLocale();
  return (
    <html lang={locale} className={inter.variable}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        <LocaleProvider initialLocale={locale}>{children}</LocaleProvider>
              <SpeedInsights />

      </body>
    </html>
  );
}
