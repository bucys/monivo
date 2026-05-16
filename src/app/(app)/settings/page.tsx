import { AppScreen } from "@/components/app/app-screen";
import { LogoutButton } from "@/components/auth/logout-button";

export default function SettingsPage() {
  return (
    <AppScreen title="Nustatymai">
      <p className="text-body text-ink-700">
        Čia tvarkysi profilį, mokesčių procentą, kategorijas ir paskyrą.
      </p>
      <div className="mt-8 flex flex-col items-start gap-2">
        <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-500">
          Paskyra
        </span>
        <LogoutButton />
      </div>
    </AppScreen>
  );
}
