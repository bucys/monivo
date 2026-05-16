import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-cream px-5 py-12 sm:px-8">
      {children}
    </main>
  );
}
