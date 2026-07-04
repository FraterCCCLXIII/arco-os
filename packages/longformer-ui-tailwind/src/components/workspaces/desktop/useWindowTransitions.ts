import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sortByStack, type SurfaceWindow } from "../../../surface-manager";

export type WindowTransitionKind = "enter" | "close" | "minimize";

const ENTER_MS = 280;
const CLOSE_MS = 240;
const MINIMIZE_MS = 320;

function transitionDuration(kind: WindowTransitionKind) {
  switch (kind) {
    case "enter":
      return ENTER_MS;
    case "close":
      return CLOSE_MS;
    case "minimize":
      return MINIMIZE_MS;
  }
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useWindowTransitions(
  windows: SurfaceWindow[],
  {
    onClose,
    onMinimize,
  }: {
    onClose: (windowId: string) => void;
    onMinimize: (windowId: string) => void;
  },
) {
  const prevIdsRef = useRef<Set<string> | null>(null);
  const timersRef = useRef<Map<string, number>>(new Map());
  const transitionsRef = useRef<Map<string, WindowTransitionKind>>(new Map());
  const [transitions, setTransitions] = useState<Map<string, WindowTransitionKind>>(new Map());
  const [heldWindows, setHeldWindows] = useState<Map<string, SurfaceWindow>>(new Map());

  const setTransitionMap = useCallback((updater: (prev: Map<string, WindowTransitionKind>) => Map<string, WindowTransitionKind>) => {
    setTransitions((prev) => {
      const next = updater(prev);
      transitionsRef.current = next;
      return next;
    });
  }, []);

  const clearTimer = useCallback((windowId: string) => {
    const timer = timersRef.current.get(windowId);
    if (timer !== undefined) {
      globalThis.clearTimeout(timer);
      timersRef.current.delete(windowId);
    }
  }, []);

  const finishTransition = useCallback(
    (windowId: string) => {
      clearTimer(windowId);
      setHeldWindows((prev) => {
        if (!prev.has(windowId)) return prev;
        const next = new Map(prev);
        next.delete(windowId);
        return next;
      });
      setTransitionMap((prev) => {
        if (!prev.has(windowId)) return prev;
        const next = new Map(prev);
        next.delete(windowId);
        return next;
      });
    },
    [clearTimer, setTransitionMap],
  );

  const startTransition = useCallback(
    (surfaceWindow: SurfaceWindow, kind: WindowTransitionKind, onComplete: () => void) => {
      clearTimer(surfaceWindow.id);
      setHeldWindows((prev) => new Map(prev).set(surfaceWindow.id, surfaceWindow));
      setTransitionMap((prev) => new Map(prev).set(surfaceWindow.id, kind));

      const duration = prefersReducedMotion() ? 0 : transitionDuration(kind);
      if (duration === 0) {
        onComplete();
        finishTransition(surfaceWindow.id);
        return;
      }

      const timer = globalThis.setTimeout(() => {
        onComplete();
        finishTransition(surfaceWindow.id);
      }, duration);
      timersRef.current.set(surfaceWindow.id, timer);
    },
    [clearTimer, finishTransition, setTransitionMap],
  );

  useEffect(() => {
    const currentIds = new Set(windows.map((window) => window.id));
    if (prevIdsRef.current === null) {
      prevIdsRef.current = currentIds;
      return;
    }

    const entering = windows.filter((window) => !prevIdsRef.current!.has(window.id));

    for (const surfaceWindow of entering) {
      setTransitionMap((prev) => new Map(prev).set(surfaceWindow.id, "enter"));
      const duration = prefersReducedMotion() ? 0 : ENTER_MS;
      clearTimer(surfaceWindow.id);
      if (duration === 0) {
        setTransitionMap((prev) => {
          if (prev.get(surfaceWindow.id) !== "enter") return prev;
          const next = new Map(prev);
          next.delete(surfaceWindow.id);
          return next;
        });
        continue;
      }
      const timer = globalThis.setTimeout(() => {
        setTransitionMap((prev) => {
          if (prev.get(surfaceWindow.id) !== "enter") return prev;
          const next = new Map(prev);
          next.delete(surfaceWindow.id);
          return next;
        });
        timersRef.current.delete(surfaceWindow.id);
      }, duration);
      timersRef.current.set(surfaceWindow.id, timer);
    }

    prevIdsRef.current = currentIds;
  }, [windows, clearTimer, setTransitionMap]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      for (const timer of timers.values()) globalThis.clearTimeout(timer);
      timers.clear();
    };
  }, []);

  const requestClose = useCallback(
    (surfaceWindow: SurfaceWindow) => {
      const activeKind = transitionsRef.current.get(surfaceWindow.id);
      if (activeKind === "close" || activeKind === "minimize") return;
      startTransition(surfaceWindow, "close", () => onClose(surfaceWindow.id));
    },
    [onClose, startTransition],
  );

  const requestMinimize = useCallback(
    (surfaceWindow: SurfaceWindow) => {
      const activeKind = transitionsRef.current.get(surfaceWindow.id);
      if (activeKind === "close" || activeKind === "minimize") return;
      startTransition(surfaceWindow, "minimize", () => onMinimize(surfaceWindow.id));
    },
    [onMinimize, startTransition],
  );

  const displayWindows = useMemo(() => {
    const byId = new Map(windows.map((window) => [window.id, window]));
    for (const [id, window] of heldWindows) {
      if (!byId.has(id)) byId.set(id, window);
    }
    return sortByStack([...byId.values()]);
  }, [heldWindows, windows]);

  const getTransition = useCallback((windowId: string) => transitions.get(windowId), [transitions]);

  return {
    displayWindows,
    requestClose,
    requestMinimize,
    getTransition,
  };
}
