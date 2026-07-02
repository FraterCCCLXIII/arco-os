import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { IconName } from "../../../icons";

const HOLD_MS = 480;
const PENDING_VISUAL_MS = 360;
const UNDOCK_THRESHOLD_PX = 48;

interface PendingDrag {
  index: number;
  pointerId: number;
  startX: number;
  startY: number;
  captureTarget: HTMLElement;
}

export interface TrayDragState {
  fromIndex: number;
  dropIndex: number;
  pointerId: number;
  ghostX: number;
  ghostY: number;
  appId: string;
  label: string;
  icon: IconName;
  isUndocking: boolean;
}

export interface UseTrayReorderOptions {
  enabled: boolean;
  itemCount: number;
  trayBoundsRef: MutableRefObject<HTMLElement | null>;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  onUndock?: (fromIndex: number) => void;
}

function resolveDropIndex(clientX: number, refs: (HTMLElement | null)[]): number {
  for (let index = 0; index < refs.length; index += 1) {
    const element = refs[index];
    if (!element) continue;

    const rect = element.getBoundingClientRect();
    const midpoint = rect.left + rect.width / 2;
    if (clientX < midpoint) return index;
  }

  return Math.max(0, refs.length - 1);
}

function isUndocking(pointerY: number, trayBounds: HTMLElement | null): boolean {
  if (!trayBounds) return false;
  const rect = trayBounds.getBoundingClientRect();
  return pointerY < rect.top - UNDOCK_THRESHOLD_PX;
}

/** Slot steps other icons shift while a drag target moves horizontally. */
export function getTrayReorderShift(index: number, fromIndex: number, dropIndex: number): number {
  if (fromIndex === dropIndex) return 0;

  if (fromIndex < dropIndex) {
    return index > fromIndex && index <= dropIndex ? -1 : 0;
  }

  return index >= dropIndex && index < fromIndex ? 1 : 0;
}

/** Slot steps icons shift when dragging an overflow app onto the tray. */
export function getTrayPinShift(index: number, dropIndex: number | null): number {
  if (dropIndex === null) return 0;
  return index >= dropIndex ? 1 : 0;
}

/** Hold-and-drag reordering for tray dock icons; pull upward to de-dock. */
export function useTrayReorder({
  enabled,
  itemCount,
  trayBoundsRef,
  onReorder,
  onUndock,
}: UseTrayReorderOptions) {
  const [dragState, setDragState] = useState<TrayDragState | null>(null);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pendingRef = useRef<PendingDrag | null>(null);
  const holdTimerRef = useRef<number | null>(null);
  const pendingVisualTimerRef = useRef<number | null>(null);
  const dragRef = useRef<TrayDragState | null>(null);
  const didDragRef = useRef(false);

  useEffect(() => {
    dragRef.current = dragState;
  }, [dragState]);

  const clearHoldTimer = useCallback(() => {
    if (holdTimerRef.current !== null) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (pendingVisualTimerRef.current !== null) {
      window.clearTimeout(pendingVisualTimerRef.current);
      pendingVisualTimerRef.current = null;
    }
  }, []);

  const cancelPending = useCallback(() => {
    clearHoldTimer();
    pendingRef.current = null;
    setPendingIndex(null);
  }, [clearHoldTimer]);

  const finishDrag = useCallback(
    (state: TrayDragState) => {
      if (state.isUndocking) {
        didDragRef.current = true;
        onUndock?.(state.fromIndex);
      } else if (state.fromIndex !== state.dropIndex) {
        didDragRef.current = true;
        onReorder?.(state.fromIndex, state.dropIndex);
      }

      setDragState(null);
      dragRef.current = null;
      document.body.style.userSelect = "";
    },
    [onReorder, onUndock],
  );

  const createItemPointerDown = useCallback(
    (index: number, appId: string, label: string, icon: IconName) => (event: ReactPointerEvent<HTMLElement>) => {
      if (!enabled || event.button !== 0 || itemCount <= 1) return;
      if (!onReorder && !onUndock) return;

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

      pendingVisualTimerRef.current = window.setTimeout(() => {
        const pending = pendingRef.current;
        if (!pending || pending.index !== index) return;
        setPendingIndex(index);
        pendingVisualTimerRef.current = null;
      }, PENDING_VISUAL_MS);

      function onPointerMove(ev: PointerEvent) {
        const pending = pendingRef.current;
        const active = dragRef.current;

        if (active) {
          if (ev.pointerId !== active.pointerId) return;

          ev.preventDefault();

          const undocking = isUndocking(ev.clientY, trayBoundsRef.current);
          const dropIndex = undocking ? active.fromIndex : resolveDropIndex(ev.clientX, itemRefs.current);
          const next: TrayDragState = {
            ...active,
            dropIndex,
            ghostX: ev.clientX,
            ghostY: ev.clientY,
            isUndocking: undocking,
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

        const initial: TrayDragState = {
          fromIndex: index,
          dropIndex: index,
          pointerId: pending.pointerId,
          ghostX: pending.startX,
          ghostY: pending.startY,
          appId,
          label,
          icon,
          isUndocking: false,
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
    [cancelPending, enabled, finishDrag, itemCount, onReorder, onUndock, trayBoundsRef],
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
