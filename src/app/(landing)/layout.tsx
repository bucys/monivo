import type { Metadata } from "next";

// NOTE: no `alternates.canonical` here — a layout-level canonical applies to
// every child route, which previously made /privatumas, /salygos and
// /kontaktai all canonicalize to "/". Each page declares its own canonical.
export const metadata: Metadata = {
  keywords: [
    "pajamų sekimas",
    "išlaidų sekimas",
    "grožio specialistams",
    "individuali veikla",
    "mokesčių rezervas",
  ],
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="landing-scroll landing-bg">{children}</div>;
}
