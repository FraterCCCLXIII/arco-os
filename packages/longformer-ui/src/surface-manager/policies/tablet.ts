import type { SurfaceRect, SurfaceWindow, WindowPolicy } from "../types";
import { clampRect } from "../geometry";

function splitRects(count: number): SurfaceRect[] {
  if (count <= 1) {
    return [{ x: 6, y: 8, width: 88, height: 84 }];
  }
  if (count === 2) {
    return [
      { x: 4, y: 8, width: 46, height: 84 },
      { x: 50, y: 8, width: 46, height: 84 },
    ];
  }
  return [
    { x: 4, y: 8, width: 46, height: 40 },
    { x: 50, y: 8, width: 46, height: 40 },
    { x: 4, y: 52, width: 92, height: 40 },
  ];
}

export function reflowTabletWindows(windows: SurfaceWindow[]): SurfaceWindow[] {
  const visible = windows.filter((w) => w.state !== "minimized" && w.layer === "base");
  const rects = splitRects(Math.min(visible.length, 3));
  let rectIndex = 0;

  return windows.map((w) => {
    if (w.state === "minimized" || w.layer !== "base") return w;
    const rect = rects[rectIndex] ?? rects[rects.length - 1];
    rectIndex += 1;
    return { ...w, rect: clampRect(rect) };
  });
}

export const tabletPolicy: WindowPolicy = {
  formFactor: "tablet",
  allowDrag: true,
  allowResize: true,
  maxVisible: 3,
  defaultPlacement(windows, _input) {
    const visible = windows.filter((w) => w.state !== "minimized" && w.layer === "base");
    const rects = splitRects(visible.length + 1);
    return clampRect(rects[Math.min(visible.length, rects.length - 1)]);
  },
  constrainRect(rect, windows, windowId) {
    const visible = windows.filter((w) => w.state !== "minimized" && w.layer === "base");
    const index = visible.findIndex((w) => w.id === windowId);
    const pane = splitRects(Math.max(visible.length, 1))[Math.max(index, 0)] ?? rect;
    return clampRect({
      x: clamp(rect.x, pane.x, pane.x + pane.width - rect.width),
      y: clamp(rect.y, pane.y, pane.y + pane.height - rect.height),
      width: clamp(rect.width, 18, pane.width),
      height: clamp(rect.height, 16, pane.height),
    });
  },
  onOpen(state) {
    return { ...state, windows: reflowTabletWindows(state.windows) };
  },
  onFormFactorChange(state) {
    return { ...state, windows: reflowTabletWindows(state.windows) };
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
