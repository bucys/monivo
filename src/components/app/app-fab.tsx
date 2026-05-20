"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { dispatchOpenAddService } from "@/app/(app)/services/services-client";
import {
  dispatchOpenExpenseEntry,
  dispatchOpenIncomeEntry,
} from "@/components/add-entry/add-entry-sheet";
import { useT } from "@/i18n/locale-provider";

export function AppFab() {
  const pathname = usePathname();
  const t = useT();
  const onServices =
    pathname === "/services" || pathname?.startsWith("/services/");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [menuOpen]);

  const handleFabClick = () => {
    if (onServices) {
      dispatchOpenAddService();
      return;
    }
    setMenuOpen((v) => !v);
  };

  const choose = (kind: "income" | "expense") => {
    setMenuOpen(false);
    if (kind === "income") dispatchOpenIncomeEntry();
    else dispatchOpenExpenseEntry();
  };

  const showMenu = menuOpen && !onServices;

  // Stacking: topbar z-30 · FAB backdrop z-40 (above topbar when open) ·
  // FAB button + menu z-50 (above backdrop, but below any open ModalSheet
  // which mounts at z-50 *later* in DOM and therefore wins by paint order).
  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label="Uždaryti meniu"
        aria-hidden={!showMenu}
        tabIndex={showMenu ? 0 : -1}
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-ink-900/40 transition-opacity duration-200 ease-out ${
          showMenu ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        className={`fixed bottom-[112px] left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2.5 transition-all duration-200 ease-out ${
          showMenu
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
        aria-hidden={!showMenu}
      >
        <MenuPill
          tabIndex={showMenu ? 0 : -1}
          onClick={() => choose("income")}
          tone="income"
          label={t.nav.addIncome}
        />
        <MenuPill
          tabIndex={showMenu ? 0 : -1}
          onClick={() => choose("expense")}
          tone="expense"
          label={t.nav.addExpense}
        />
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleFabClick();
        }}
        aria-label={
          onServices
            ? "Pridėti paslaugą"
            : showMenu
              ? "Uždaryti pridėjimo meniu"
              : "Pridėti įrašą"
        }
        aria-expanded={onServices ? undefined : showMenu}
        className="fixed bottom-[40px] left-1/2 z-50 -translate-x-1/2 touch-manipulation"
      >
        <span className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-gradient-to-br from-[#2E8E7D] via-accent to-accent-deep text-white shadow-fab transition-transform active:scale-95">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            aria-hidden
            className={`transition-transform duration-200 ease-out ${
              showMenu ? "rotate-45" : "rotate-0"
            }`}
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>
    </div>
  );
}

function MenuPill({
  onClick,
  tone,
  label,
  tabIndex,
}: {
  onClick: () => void;
  tone: "income" | "expense";
  label: string;
  tabIndex: number;
}) {
  const dotClass =
    tone === "income"
      ? "bg-accent-soft text-accent-deep"
      : "bg-expense-bg text-expense";
  const sign = tone === "income" ? "+" : "−";
  return (
    <button
      type="button"
      onClick={onClick}
      tabIndex={tabIndex}
      className="flex items-center gap-2.5 rounded-full bg-white px-4 py-2.5 text-[14px] font-semibold text-ink-900/90 shadow-fab transition-transform active:scale-[0.97]"
    >
      <span
        aria-hidden
        className={`flex h-[22px] w-[22px] items-center justify-center rounded-full text-[14px] font-bold ${dotClass}`}
      >
        {sign}
      </span>
      {label}
    </button>
  );
}
