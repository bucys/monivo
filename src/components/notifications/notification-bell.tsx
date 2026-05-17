"use client";

import { useEffect, useRef, useState } from "react";
import { ModalSheet } from "@/components/ui/modal-sheet";
import { NotificationItem } from "./notification-item";
import { useNotifications } from "./notifications-provider";

export function NotificationBell() {
  const { visible, unreadCount, markRead, markAllRead, isRead } =
    useNotifications();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Desktop only: close dropdown on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const onItemActivate = (id: string) => {
    markRead(id);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="Pranešimai"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/60 text-ink-700 ring-1 ring-hair/70 transition-colors hover:bg-white hover:text-ink-900/90"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 4.5 1.5 6 1.5 6h-15S6 12.5 6 8Z" />
          <path d="M10 19a2 2 0 0 0 4 0" />
        </svg>
        {unreadCount > 0 ? (
          <span
            aria-label={`${unreadCount} naujų pranešimų`}
            className="absolute right-[7px] top-[7px] h-2 w-2 rounded-full bg-accent ring-2 ring-cream"
          />
        ) : null}
      </button>

      {/* Desktop dropdown */}
      {open ? (
        <div className="absolute right-0 top-[calc(100%+8px)] z-40 hidden w-[360px] lg:block">
          <PanelCard
            items={visible}
            isRead={isRead}
            onItem={onItemActivate}
            onMarkAll={markAllRead}
          />
        </div>
      ) : null}

      {/* Mobile bottom sheet */}
      <div className="lg:hidden">
        <ModalSheet
          open={open}
          onClose={() => setOpen(false)}
          ariaLabel="Pranešimai"
        >
          <PanelHeader
            count={visible.length}
            unread={unreadCount}
            onMarkAll={markAllRead}
          />
          <PanelBody
            items={visible}
            isRead={isRead}
            onItem={onItemActivate}
          />
        </ModalSheet>
      </div>
    </div>
  );
}

function PanelCard({
  items,
  isRead,
  onItem,
  onMarkAll,
}: {
  items: ReturnType<typeof useNotifications>["visible"];
  isRead: (id: string) => boolean;
  onItem: (id: string) => void;
  onMarkAll: () => void;
}) {
  const unread = items.filter((n) => !isRead(n.id)).length;
  return (
    <div
      role="dialog"
      aria-label="Pranešimai"
      className="overflow-hidden rounded-[18px] border border-hair bg-white shadow-[0_12px_40px_-12px_rgba(23,33,29,0.2),_0_2px_6px_rgba(23,33,29,0.06)]"
    >
      <PanelHeader count={items.length} unread={unread} onMarkAll={onMarkAll} />
      <PanelBody items={items} isRead={isRead} onItem={onItem} />
    </div>
  );
}

function PanelHeader({
  count,
  unread,
  onMarkAll,
}: {
  count: number;
  unread: number;
  onMarkAll: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 pb-3 pt-1 lg:pt-4">
      <div>
        <h3 className="text-[15px] font-semibold tracking-[-0.012em] text-ink-900/90">
          Pranešimai
        </h3>
        {count > 0 ? (
          <p className="mt-0.5 text-[12px] text-ink-500 tabular-nums">
            {unread > 0 ? `${unread} naujų` : "Viskas perskaityta"}
          </p>
        ) : null}
      </div>
      {unread > 0 ? (
        <button
          type="button"
          onClick={onMarkAll}
          className="rounded-[10px] px-2 py-1 text-[12px] font-medium text-accent transition-colors hover:text-accent-deep"
        >
          Pažymėti perskaitytus
        </button>
      ) : null}
    </div>
  );
}

function PanelBody({
  items,
  isRead,
  onItem,
}: {
  items: ReturnType<typeof useNotifications>["visible"];
  isRead: (id: string) => boolean;
  onItem: (id: string) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center px-6 pb-6 pt-4 text-center">
        <span
          aria-hidden
          className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-accent-soft text-accent-deep"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 4.5 1.5 6 1.5 6h-15S6 12.5 6 8Z" />
            <path d="M10 19a2 2 0 0 0 4 0" />
          </svg>
        </span>
        <p className="mt-3 text-[14px] font-semibold tracking-[-0.012em] text-ink-900/90">
          Kol kas pranešimų nėra.
        </p>
        <p className="mt-1 max-w-[260px] text-[12px] leading-[1.5] text-ink-500">
          Čia matysi mokesčių priminimus, mėnesio įžvalgas ir paskyros žinutes.
        </p>
      </div>
    );
  }
  return (
    <div className="max-h-[60vh] overflow-y-auto px-2 pb-3 pt-1">
      {items.map((n) => (
        <NotificationItem
          key={n.id}
          notification={n}
          unread={!isRead(n.id)}
          onActivate={() => onItem(n.id)}
        />
      ))}
    </div>
  );
}
