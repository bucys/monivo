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

type Ctx = {
  modalCount: number;
  push: () => void;
  pop: () => void;
};

const UIChromeContext = createContext<Ctx>({
  modalCount: 0,
  push: () => {},
  pop: () => {},
});

export function UIChromeProvider({ children }: { children: ReactNode }) {
  const [modalCount, setCount] = useState(0);
  const push = useCallback(() => setCount((n) => n + 1), []);
  const pop = useCallback(() => setCount((n) => Math.max(0, n - 1)), []);
  const value = useMemo<Ctx>(
    () => ({ modalCount, push, pop }),
    [modalCount, push, pop],
  );
  return (
    <UIChromeContext.Provider value={value}>{children}</UIChromeContext.Provider>
  );
}

/** Returns true while any modal/sheet is currently open. App chrome (FAB,
 *  bottom nav badges, etc.) should suppress itself when this is true. */
export function useChromeSuppressed(): boolean {
  return useContext(UIChromeContext).modalCount > 0;
}

/** Modal primitives call this with their `open` state. Increments the global
 *  modal count while mounted-and-open; decrements on close/unmount. */
export function useChromeBlocker(open: boolean): void {
  const { push, pop } = useContext(UIChromeContext);
  useEffect(() => {
    if (!open) return;
    push();
    return () => pop();
  }, [open, push, pop]);
}
