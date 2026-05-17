"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { SettingsRow } from "./settings-card";
import { IconSignOut } from "./settings-icons";

export function LogoutRow({ label }: { label: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const onClick = async () => {
    if (pending) return;
    setPending(true);
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  };

  return (
    <SettingsRow
      icon={<IconSignOut />}
      label={pending ? "…" : label}
      destructive
      onClick={onClick}
      chevron={false}
      last
    />
  );
}
