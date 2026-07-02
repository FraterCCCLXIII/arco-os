import { useCallback, useRef } from "react";
import { applyDelta, pxDeltaToPercent } from "./geometry";
import type { SurfaceRect } from "./types";
import { usePointerGesture } from "./usePointerGesture";

export interface UseWindowDragOptions {
  rect: SurfaceRect;
  disabled?: boolean;
  containerRef: React.RefObject<HTMLElement | null>;
  onMove: (rect: SurfaceRect) => void;
  onFocus?: () => void;
}

export function useWindowDrag({ rect, disabled = false, containerRef, onMove, onFocus }: UseWindowDragOptions) {
  const startRectRef = useRef(rect);

  const handleMove = useCallback(
    (deltaX: number, deltaY: number) => {
      const container = containerRef.current;
      if (!container) return;
      const { deltaX: dx, deltaY: dy } = pxDeltaToPercent(
        deltaX,
        deltaY,
        container.clientWidth,
        container.clientHeight,
      );
      onMove(applyDelta(startRectRef.current, dx, dy));
    },
    [containerRef, onMove],
  );

  const gesture = usePointerGesture({
    disabled,
    cursor: "grabbing",
    onStart: () => {
      startRectRef.current = rect;
      onFocus?.();
    },
    onMove: handleMove,
  });

  return gesture;
}
