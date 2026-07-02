import type { SurfaceWindow, WindowPolicy } from "../types";
import { WATCH_RECT } from "./desktop";

export const watchPolicy: WindowPolicy = {
  formFactor: "watch",
  allowDrag: false,
  allowResize: false,
  maxVisible: 1,
  defaultPlacement() {
    return { ...WATCH_RECT };
  },
  constrainRect() {
    return { ...WATCH_RECT };
  },
  onOpen(state, window) {
    const baseWindows = state.windows.filter((w) => w.layer === "base" && w.state !== "minimized");
    const index = baseWindows.findIndex((w) => w.id === window.id);
    const windows = state.windows.map((w) =>
      w.layer === "base" ? { ...w, rect: { ...WATCH_RECT }, state: "fullscreen" as const } : w,
    );
    return {
      ...state,
      windows,
      watchGlanceIndex: index >= 0 ? index : Math.max(0, baseWindows.length - 1),
      activeWindowId: window.id,
    };
  },
  onFormFactorChange(state) {
    const windows = state.windows.map((w) =>
      w.layer === "base" ? { ...w, rect: { ...WATCH_RECT }, state: "fullscreen" as const } : w,
    );
    const baseWindows = windows.filter((w) => w.layer === "base" && w.state !== "minimized");
    return {
      ...state,
      windows,
      watchGlanceIndex: clampIndex(state.watchGlanceIndex, baseWindows.length),
    };
  },
};

export function watchVisibleWindows(windows: SurfaceWindow[], glanceIndex: number): SurfaceWindow[] {
  const base = windows.filter((w) => w.layer === "base" && w.state !== "minimized");
  if (base.length === 0) return [];
  const index = clampIndex(glanceIndex, base.length);
  const active = base[index];
  const neighbors = [base[index - 1], active, base[index + 1]].filter(Boolean) as SurfaceWindow[];
  const overlays = windows.filter(
    (w) => (w.layer === "sheet" || w.layer === "modal") && w.state !== "minimized",
  );
  return [...neighbors, ...overlays];
}

export function clampGlanceIndex(index: number, count: number): number {
  return clampIndex(index, count);
}

function clampIndex(index: number, count: number): number {
  if (count <= 0) return 0;
  return Math.min(count - 1, Math.max(0, index));
}
