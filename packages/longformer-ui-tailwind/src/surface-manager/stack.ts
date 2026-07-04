import type { SurfaceWindow } from "./types";

export function nextStackOrder(windows: SurfaceWindow[]): number {
  if (windows.length === 0) return 1;
  return Math.max(...windows.map((w) => w.stackOrder)) + 1;
}

export function bringToFront(windows: SurfaceWindow[], windowId: string): SurfaceWindow[] {
  const next = nextStackOrder(windows);
  return windows.map((w) => (w.id === windowId ? { ...w, stackOrder: next } : w));
}

export function sendToBack(windows: SurfaceWindow[], windowId: string): SurfaceWindow[] {
  const min = Math.min(...windows.map((w) => w.stackOrder));
  return windows.map((w) => (w.id === windowId ? { ...w, stackOrder: min - 1 } : w));
}

export function sortByStack(windows: SurfaceWindow[]): SurfaceWindow[] {
  return [...windows].sort((a, b) => a.stackOrder - b.stackOrder);
}

export function visibleWindows(windows: SurfaceWindow[]): SurfaceWindow[] {
  return windows.filter((w) => w.state !== "minimized");
}
