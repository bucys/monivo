import { redirect } from "next/navigation";
import { AppShell } from "@/components/app/app-shell";
import { getT } from "@/i18n/server";
import { loadNotifications } from "@/lib/notifications";
import { loadCanWrite } from "@/lib/profile";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed_at")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.onboarding_completed_at) {
    redirect("/onboarding");
  }

  const { t } = await getT();
  const [notifications, canWrite] = await Promise.all([
    loadNotifications(supabase, user.id, t.notifications.generated),
    loadCanWrite(supabase, user.id),
  ]);

  return (
    <AppShell notifications={notifications} canWrite={canWrite}>
      {children}
    </AppShell>
  );
}
