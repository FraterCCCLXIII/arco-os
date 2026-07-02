import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { IconName } from "../../../icons";

const HOLD_MS = 180;

interface PendingDrag {
  index: number;
  pointerId: number;
  startX: number;
  startY: number;
  captureTarget: HTMLElement;
}

export interface NavRailDragState {
  fromIndex: number;
  dropIndex: number;
  pointerId: number;
  ghostX: number;
  ghostY: number;
  label: string;
  icon: IconName;
}

export interface UseNavRailReorderOptions {
  enabled: boolean;
  itemCount: number;
  onReorder?: (fromIndex: number, toIndex: number) => void;
}

function resolveDropIndex(clientY: number, refs: (HTMLElement | null)[]): number {
  for (let index = 0; index < refs.length; index += 1) {
    const element = refs[index];
    if (!element) continue;

    const rect = element.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    if (clientY < midpoint) return index;
  }

  return Math.max(0, refs.length - 1);
}

/** Hold-and-drag reordering for pinned NavRail workspace tabs. */
export function useNavRailReorder({ enabled, itemCount, onReorder }: UseNavRailReorderOptions) {
  const [dragState, setDragState] = useState<NavRailDragState | null>(null);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pendingRef = useRef<PendingDrag | null>(null);
  const holdTimerRef = useRef<number | null>(null);
  const dragRef = useRef<NavRailDragState | null>(null);
  const didDragRef = useRef(false);

  useEffect(() => {
    dragRef.current = dragState;
  }, [dragState]);

  const clearHoldTimer = useCallback(() => {
    if (holdTimerRef.current !== null) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }, []);

  const cancelPending = useCallback(() => {
    clearHoldTimer();
    pendingRef.current = null;
    setPendingIndex(null);
  }, [clearHoldTimer]);

  const finishDrag = useCallback(
    (state: NavRailDragState) => {
      if (state.fromIndex !== state.dropIndex) {
        didDragRef.current = true;
        onReorder?.(state.fromIndex, state.dropIndex);
      }

      setDragState(null);
      dragRef.current = null;
      document.body.style.userSelect = "";
    },
    [onReorder],
  );

  const createItemPointerDown = useCallback(
    (index: number, label: string, icon: IconName) => (event: ReactPointerEvent<HTMLElement>) => {
      if (!enabled || !onReorder || event.button !== 0 || itemCount <= 1) return;

      cancelPending();
      didDragRef.current = false;

      const captureTarget = event.currentTarget;
      captureTarget.setPointerCapture(event.pointerId);

      pendingRef.current = {
        index,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        captureTarget,
      };
      setPendingIndex(index);

      function onPointerMove(ev: PointerEvent) {
        const pending = pendingRef.current;
        const active = dragRef.current;

        if (active) {
          if (ev.pointerId !== active.pointerId) return;

          ev.preventDefault();

          const dropIndex = resolveDropIndex(ev.clientY, itemRefs.current);
          const next: NavRailDragState = {
            ...active,
            dropIndex,
            ghostX: ev.clientX,
            ghostY: ev.clientY,
          };

          dragRef.current = next;
          setDragState(next);
        } else if (pending && ev.pointerId === pending.pointerId) {
          ev.preventDefault();
        }
      }

      function cleanupListeners() {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointercancel", onPointerUp);
      }

      function onPointerUp(ev: PointerEvent) {
        const pending = pendingRef.current;
        const active = dragRef.current;

        if (active && ev.pointerId === active.pointerId) {
          finishDrag(active);
        } else if (pending && ev.pointerId === pending.pointerId) {
          cancelPending();
        }

        if (captureTarget.hasPointerCapture?.(ev.pointerId)) {
          captureTarget.releasePointerCapture(ev.pointerId);
        }

        cleanupListeners();
      }

      holdTimerRef.current = window.setTimeout(() => {
        const pending = pendingRef.current;
        if (!pending || pending.index !== index) return;

        document.body.style.userSelect = "none";
        setPendingIndex(null);

        const initial: NavRailDragState = {
          fromIndex: index,
          dropIndex: index,
          pointerId: pending.pointerId,
          ghostX: pending.startX,
          ghostY: pending.startY,
          label,
          icon,
        };

        pendingRef.current = null;
        holdTimerRef.current = null;
        dragRef.current = initial;
        setDragState(initial);
      }, HOLD_MS);

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);
    },
    [cancelPending, enabled, finishDrag, itemCount, onReorder],
  );

  const shouldSuppressClick = useCallback(() => {
    if (!didDragRef.current) return false;
    didDragRef.current = false;
    return true;
  }, []);

  useEffect(
    () => () => {
      clearHoldTimer();
      document.body.style.userSelect = "";
    },
    [clearHoldTimer],
  );

  return {
    dragState,
    pendingIndex,
    itemRefs,
    createItemPointerDown,
    shouldSuppressClick,
  };
}
