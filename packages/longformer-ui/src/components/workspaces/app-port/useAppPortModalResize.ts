import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type RefObject } from "react";
import { usePointerGesture } from "../../../surface-manager/usePointerGesture";
import type { ResizeEdge } from "../../../surface-manager/useWindowResize";
import {
  APP_PORT_FRAME,
  APP_PORT_MODAL_MAX,
  APP_PORT_MODAL_MIN,
  type AppPortFrameSize,
} from "./viewport-frame";

const RESIZE_EDGES: ResizeEdge[] = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];

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

function clampModalSize(size: AppPortFrameSize, stage?: DOMRect | null): AppPortFrameSize {
  const maxWidth = stage ? Math.min(APP_PORT_MODAL_MAX.width, stage.width - 32) : APP_PORT_MODAL_MAX.width;
  const maxHeight = stage ? Math.min(APP_PORT_MODAL_MAX.height, stage.height - 32) : APP_PORT_MODAL_MAX.height;

  return {
    width: Math.round(Math.min(maxWidth, Math.max(APP_PORT_MODAL_MIN.width, size.width))),
    height: Math.round(Math.min(maxHeight, Math.max(APP_PORT_MODAL_MIN.height, size.height))),
  };
}

function resizeFromEdge(start: AppPortFrameSize, edge: ResizeEdge, deltaX: number, deltaY: number): AppPortFrameSize {
  let { width, height } = start;

  if (edge.includes("e")) width += deltaX;
  if (edge.includes("w")) width -= deltaX;
  if (edge.includes("s")) height += deltaY;
  if (edge.includes("n")) height -= deltaY;

  return { width, height };
}

export interface UseAppPortModalResizeResult {
  size: AppPortFrameSize;
  resetSize: () => void;
  getResizeHandler: (edge: ResizeEdge) => (event: ReactPointerEvent<HTMLElement>) => void;
}

/** Drag-resize a centered modal window in pixel space for App Port scaling tests. */
export function useAppPortModalResize(
  stageRef: RefObject<HTMLElement | null>,
  enabled: boolean,
): UseAppPortModalResizeResult {
  const [size, setSize] = useState<AppPortFrameSize>(() => APP_PORT_FRAME.modal);
  const sizeRef = useRef(size);
  sizeRef.current = size;
  const startSizeRef = useRef(size);
  const activeEdgeRef = useRef<ResizeEdge>("se");

  useEffect(() => {
    if (enabled) {
      setSize(APP_PORT_FRAME.modal);
    }
  }, [enabled]);

  const applySize = useCallback(
    (next: AppPortFrameSize) => {
      setSize(clampModalSize(next, stageRef.current?.getBoundingClientRect()));
    },
    [stageRef],
  );

  const resetSize = useCallback(() => {
    applySize(APP_PORT_FRAME.modal);
  }, [applySize]);

  const gesture = usePointerGesture({
    disabled: !enabled,
    onStart: () => {
      startSizeRef.current = sizeRef.current;
      document.body.style.cursor = CURSOR_BY_EDGE[activeEdgeRef.current];
      document.body.style.userSelect = "none";
    },
    onMove: (deltaX, deltaY) => {
      applySize(resizeFromEdge(startSizeRef.current, activeEdgeRef.current, deltaX, deltaY));
    },
    onEnd: () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    },
  });

  const getResizeHandler = useCallback(
    (edge: ResizeEdge) => (event: ReactPointerEvent<HTMLElement>) => {
      activeEdgeRef.current = edge;
      gesture.onPointerDown(event);
    },
    [gesture],
  );

  return {
    size,
    resetSize,
    getResizeHandler,
  };
}

export { RESIZE_EDGES };
