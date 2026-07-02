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

export interface NavRailDragState {
  fromIndex: number;
  dropIndex: number;
  pointerId: number;
  ghostX: number;
  ghostY: number;
  label: string;
  icon: IconName;
  isUndocking: boolean;
}

export interface UseNavRailReorderOptions {
  enabled: boolean;
  itemCount: number;
  railBoundsRef: MutableRefObject<HTMLElement | null>;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  onUndock?: (fromIndex: number) => void;
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

function isUndocking(pointerX: number, railBounds: HTMLElement | null): boolean {
  if (!railBounds) return false;
  const rect = railBounds.getBoundingClientRect();
  return pointerX > rect.right + UNDOCK_THRESHOLD_PX;
}

/** Hold-and-drag reordering for pinned NavRail workspace tabs; pull right to de-dock. */
export function useNavRailReorder({
  enabled,
  itemCount,
  railBoundsRef,
  onReorder,
  onUndock,
}: UseNavRailReorderOptions) {
  const [dragState, setDragState] = useState<NavRailDragState | null>(null);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pendingRef = useRef<PendingDrag | null>(null);
  const holdTimerRef = useRef<number | null>(null);
  const pendingVisualTimerRef = useRef<number | null>(null);
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
    (state: NavRailDragState) => {
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
    (index: number, label: string, icon: IconName) => (event: ReactPointerEvent<HTMLElement>) => {
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

          const undocking = isUndocking(ev.clientX, railBoundsRef.current);
          const dropIndex = undocking ? active.fromIndex : resolveDropIndex(ev.clientY, itemRefs.current);
          const next: NavRailDragState = {
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

        const initial: NavRailDragState = {
          fromIndex: index,
          dropIndex: index,
          pointerId: pending.pointerId,
          ghostX: pending.startX,
          ghostY: pending.startY,
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
    [cancelPending, enabled, finishDrag, itemCount, onReorder, onUndock, railBoundsRef],
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
