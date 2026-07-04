import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { IconName } from "../../../icons";
import type { NavRailItem } from "./NavRail";

const DRAG_THRESHOLD_PX = 6;

export interface NavRailPinDragState {
  id: string;
  label: string;
  icon: IconName;
  pointerId: number;
  ghostX: number;
  ghostY: number;
}

export interface UseNavRailPinDragOptions {
  enabled: boolean;
  itemCount: number;
  itemRefs: React.MutableRefObject<(HTMLElement | null)[]>;
  onPin?: (id: string, index: number) => void;
}

function resolvePinDropIndex(clientY: number, refs: (HTMLElement | null)[]): number {
  for (let index = 0; index < refs.length; index += 1) {
    const element = refs[index];
    if (!element) continue;

    const rect = element.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    if (clientY < midpoint) return index;
  }

  return refs.length;
}

/** Drag overflow apps onto pinned NavRail slots to dock them on the sidebar. */
export function useNavRailPinDrag({ enabled, itemCount, itemRefs, onPin }: UseNavRailPinDragOptions) {
  const [pinDrag, setPinDrag] = useState<NavRailPinDragState | null>(null);
  const [pinDropIndex, setPinDropIndex] = useState<number | null>(null);
  const pinDragRef = useRef<NavRailPinDragState | null>(null);
  const didDragRef = useRef(false);

  useEffect(() => {
    pinDragRef.current = pinDrag;
  }, [pinDrag]);

  const finishPinDrag = useCallback(
    (state: NavRailPinDragState, dropIndex: number) => {
      onPin?.(state.id, Math.max(0, Math.min(dropIndex, itemCount)));
      setPinDrag(null);
      setPinDropIndex(null);
      pinDragRef.current = null;
      document.body.style.userSelect = "";
    },
    [itemCount, onPin],
  );

  const createOverflowDragStart = useCallback(
    (item: NavRailItem) => (event: ReactPointerEvent<HTMLElement>) => {
      if (!enabled || !onPin || event.button !== 0) return;

      const captureTarget = event.currentTarget;
      const startX = event.clientX;
      const startY = event.clientY;
      didDragRef.current = false;

      function onPointerMove(ev: PointerEvent) {
        if (ev.pointerId !== event.pointerId) return;

        const active = pinDragRef.current;
        if (active) {
          ev.preventDefault();
          const dropIndex = resolvePinDropIndex(ev.clientY, itemRefs.current);
          setPinDropIndex(dropIndex);
          const next: NavRailPinDragState = {
            ...active,
            ghostX: ev.clientX,
            ghostY: ev.clientY,
          };
          pinDragRef.current = next;
          setPinDrag(next);
          return;
        }

        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        if (Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return;

        ev.preventDefault();
        didDragRef.current = true;
        document.body.style.userSelect = "none";

        const initial: NavRailPinDragState = {
          id: item.id,
          label: item.label,
          icon: item.icon,
          pointerId: ev.pointerId,
          ghostX: ev.clientX,
          ghostY: ev.clientY,
        };

        pinDragRef.current = initial;
        setPinDrag(initial);
        setPinDropIndex(resolvePinDropIndex(ev.clientY, itemRefs.current));
      }

      function cleanupListeners() {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointercancel", onPointerUp);
      }

      function onPointerUp(ev: PointerEvent) {
        if (ev.pointerId !== event.pointerId) return;

        const active = pinDragRef.current;
        if (active) {
          finishPinDrag(active, resolvePinDropIndex(ev.clientY, itemRefs.current));
        }

        if (captureTarget.hasPointerCapture?.(ev.pointerId)) {
          captureTarget.releasePointerCapture(ev.pointerId);
        }

        cleanupListeners();
      }

      captureTarget.setPointerCapture(event.pointerId);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerUp);
    },
    [enabled, finishPinDrag, itemRefs, onPin],
  );

  const shouldSuppressOverflowClick = useCallback(() => {
    if (!didDragRef.current) return false;
    didDragRef.current = false;
    return true;
  }, []);

  useEffect(
    () => () => {
      document.body.style.userSelect = "";
    },
    [],
  );

  return {
    pinDrag,
    pinDropIndex,
    createOverflowDragStart,
    shouldSuppressOverflowClick,
  };
}
