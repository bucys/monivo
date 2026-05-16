"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  };

  return (
    <Button
      variant="secondary"
      isLoading={loading}
      onClick={onClick}
      className="!h-auto !w-auto !rounded-[14px] !border-hair !px-5 !py-3 !text-[14px]"
    >
      Atsijungti
    </Button>
  );
}
