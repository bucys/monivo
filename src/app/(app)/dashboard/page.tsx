import { AppScreen } from "@/components/app/app-screen";

export default function DashboardPage() {
  return (
    <AppScreen>
      <p className="text-body text-ink-700">
        Šiame ekrane atsiras šio mėnesio aiškumas — kiek gali išleisti, kiek
        atidėta mokesčiams ir paskutiniai įrašai.
      </p>
    </AppScreen>
  );
}
