"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AppNotification } from "@/lib/notifications";

const STORAGE_KEY = "monivo_notif_state_v1";

type Persisted = { read: string[]; dismissed: string[] };

type Ctx = {
  notifications: AppNotification[];
  visible: AppNotification[];
  unreadCount: number;
  isRead: (id: string) => boolean;
  markRead: (id: string) => void;
  markAllRead: () => void;
  dismiss: (id: string) => void;
};

const NotificationsContext = createContext<Ctx | null>(null);

function load(): Persisted {
  if (typeof window === "undefined") return { read: [], dismissed: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { read: [], dismissed: [] };
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    return {
      read: Array.isArray(parsed.read) ? parsed.read : [],
      dismissed: Array.isArray(parsed.dismissed) ? parsed.dismissed : [],
    };
  } catch {
    return { read: [], dismissed: [] };
  }
}

function save(state: Persisted) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function NotificationsProvider({
  initial,
  children,
}: {
  initial: AppNotification[];
  children: ReactNode;
}) {
  const [state, setState] = useState<Persisted>({ read: [], dismissed: [] });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(load());
    setHydrated(true);
  }, []);

  const update = useCallback((next: Persisted) => {
    setState(next);
    save(next);
  }, []);

  const isRead = useCallback(
    (id: string) => state.read.includes(id),
    [state.read],
  );

  const markRead = useCallback(
    (id: string) => {
      if (state.read.includes(id)) return;
      update({ ...state, read: [...state.read, id] });
    },
    [state, update],
  );

  const markAllRead = useCallback(() => {
    const all = Array.from(new Set([...state.read, ...initial.map((n) => n.id)]));
    update({ ...state, read: all });
  }, [state, update, initial]);

  const dismiss = useCallback(
    (id: string) => {
      if (state.dismissed.includes(id)) return;
      update({ ...state, dismissed: [...state.dismissed, id] });
    },
    [state, update],
  );

  const visible = useMemo(
    () => initial.filter((n) => !state.dismissed.includes(n.id)),
    [initial, state.dismissed],
  );

  const unreadCount = useMemo(() => {
    if (!hydrated) return 0; // avoid SSR/CSR mismatch on the badge
    return visible.filter((n) => !state.read.includes(n.id)).length;
  }, [hydrated, visible, state.read]);

  const value = useMemo<Ctx>(
    () => ({
      notifications: initial,
      visible,
      unreadCount,
      isRead,
      markRead,
      markAllRead,
      dismiss,
    }),
    [initial, visible, unreadCount, isRead, markRead, markAllRead, dismiss],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications(): Ctx {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    return {
      notifications: [],
      visible: [],
      unreadCount: 0,
      isRead: () => false,
      markRead: () => {},
      markAllRead: () => {},
      dismiss: () => {},
    };
  }
  return ctx;
}
