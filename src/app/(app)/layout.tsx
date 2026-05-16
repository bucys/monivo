import { AppBottomNav } from "@/components/app/app-bottom-nav";
import { AppFab } from "@/components/app/app-fab";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      <main className="flex-1 pb-32">{children}</main>
      <AppFab />
      <AppBottomNav />
    </div>
  );
}
