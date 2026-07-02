import type { SurfaceRect } from "./types";

export const MIN_WINDOW_WIDTH = 18;
export const MIN_WINDOW_HEIGHT = 16;

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function clampRect(rect: SurfaceRect, minWidth = MIN_WINDOW_WIDTH, minHeight = MIN_WINDOW_HEIGHT): SurfaceRect {
  const width = clamp(rect.width, minWidth, 100);
  const height = clamp(rect.height, minHeight, 100);
  const x = clamp(rect.x, 0, 100 - width);
  const y = clamp(rect.y, 0, 100 - height);
  return { x, y, width, height };
}

export function applyDelta(rect: SurfaceRect, deltaX: number, deltaY: number): SurfaceRect {
  return clampRect({
    x: rect.x + deltaX,
    y: rect.y + deltaY,
    width: rect.width,
    height: rect.height,
  });
}

export function pxDeltaToPercent(
  deltaX: number,
  deltaY: number,
  containerWidth: number,
  containerHeight: number,
): { deltaX: number; deltaY: number } {
  if (containerWidth <= 0 || containerHeight <= 0) {
    return { deltaX: 0, deltaY: 0 };
  }
  return {
    deltaX: (deltaX / containerWidth) * 100,
    deltaY: (deltaY / containerHeight) * 100,
  };
}

export function computeZIndex(stackOrder: number, layer: "base" | "sheet" | "modal", baseZ = 10): number {
  const layerBoost = layer === "modal" ? 1000 : layer === "sheet" ? 500 : 0;
  return baseZ + stackOrder + layerBoost;
}
