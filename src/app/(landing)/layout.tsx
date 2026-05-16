import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
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
