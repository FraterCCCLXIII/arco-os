import { useCallback, useRef } from "react";
import { clampRect, pxDeltaToPercent } from "./geometry";
import type { SurfaceRect } from "./types";
import { usePointerGesture } from "./usePointerGesture";

export type ResizeEdge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

const CURSOR_BY_EDGE: Record<ResizeEdge, string> = {
  n: "ns-resize",
  s: "ns-resize",
  e: "ew-resize",
  w: "ew-resize",
  ne: "nesw-resize",
  nw: "nwse-resize",
  se: "nwse-resize",
  sw: "nesw-resize",
};

export interface UseWindowResizeOptions {
  rect: SurfaceRect;
  edge: ResizeEdge;
  disabled?: boolean;
  containerRef: React.RefObject<HTMLElement | null>;
  onResize: (rect: SurfaceRect) => void;
  onFocus?: () => void;
}

function resizeFromEdge(start: SurfaceRect, edge: ResizeEdge, deltaX: number, deltaY: number): SurfaceRect {
  let { x, y, width, height } = start;

  if (edge.includes("e")) width += deltaX;
  if (edge.includes("w")) {
    width -= deltaX;
    x += deltaX;
  }
  if (edge.includes("s")) height += deltaY;
  if (edge.includes("n")) {
    height -= deltaY;
    y += deltaY;
  }

  return clampRect({ x, y, width, height });
}

export function useWindowResize({
  rect,
  edge,
  disabled = false,
  containerRef,
  onResize,
  onFocus,
}: UseWindowResizeOptions) {
  const startRectRef = useRef(rect);

  const handleMove = useCallback(
    (deltaX: number, deltaY: number) => {
      const container = containerRef.current;
      if (!container) return;
      const percent = pxDeltaToPercent(deltaX, deltaY, container.clientWidth, container.clientHeight);
      onResize(resizeFromEdge(startRectRef.current, edge, percent.deltaX, percent.deltaY));
    },
    [containerRef, edge, onResize],
  );

  const gesture = usePointerGesture({
    disabled,
    cursor: CURSOR_BY_EDGE[edge],
    onStart: () => {
      startRectRef.current = rect;
      onFocus?.();
    },
    onMove: handleMove,
  });

  return gesture;
}
