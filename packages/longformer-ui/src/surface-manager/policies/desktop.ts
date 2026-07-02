import type { SurfaceRect, WindowPolicy } from "../types";
import { clampRect } from "../geometry";

export const PHONE_RECT: SurfaceRect = { x: 8, y: 12, width: 84, height: 76 };
export const WATCH_RECT: SurfaceRect = { x: 10, y: 18, width: 80, height: 58 };

export const desktopPolicy: WindowPolicy = {
  formFactor: "desktop",
  allowDrag: true,
  allowResize: true,
  maxVisible: Infinity,
  defaultPlacement(windows, input) {
    const index = windows.length;
    return clampRect({
      x: 12 + (index % 3) * 8,
      y: 14 + (index % 2) * 10,
      width: input.appId === "terminal" ? 38 : 46,
      height: input.appId === "terminal" ? 34 : 50,
    });
  },
  constrainRect(rect) {
    return clampRect(rect);
  },
};

export function maximizedRect(): SurfaceRect {
  return { x: 2, y: 2, width: 96, height: 92 };
}
