"use client";
import {
  ReactNode,
  createContext,
  useEffect,
  useState,
  useCallback,
} from "react";

export const ScrollLockContext = createContext({
  locks: 0,
  lockScroll: () => {},
  unlockScroll: () => {},
});

export function ScrollLockProvider({ children }: { children: ReactNode }) {
  const [locks, setLocks] = useState(0);
  const lockScroll = useCallback(() => setLocks((locks) => locks + 1), []);
  const unlockScroll = useCallback(
    () => setLocks((locks) => Math.max(locks - 1, 0)),
    []
  );

  useEffect(() => {
    if (locks > 0) {
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [locks]);

  return (
    <ScrollLockContext.Provider value={{ lockScroll, unlockScroll, locks }}>
      {children}
    </ScrollLockContext.Provider>
  );
}
