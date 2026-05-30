import type { Metadata } from "next";
import type { ReactNode } from "react";

// Auth pages must never appear in search results. Left crawlable (not robots-
// disallowed) so this noindex directive is actually fetched and honored.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-cream px-5 py-12 sm:px-8">
      {children}
    </main>
  );
}
