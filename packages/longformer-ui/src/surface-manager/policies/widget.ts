import type { SurfaceRect, WindowPolicy } from "../types";

export const WIDGET_SURFACE_RECT: SurfaceRect = { x: 0, y: 0, width: 100, height: 100 };

export const widgetPolicy: WindowPolicy = {
  formFactor: "widget",
  allowDrag: false,
  allowResize: false,
  maxVisible: 0,
  defaultPlacement() {
    return { ...WIDGET_SURFACE_RECT };
  },
  constrainRect() {
    return { ...WIDGET_SURFACE_RECT };
  },
  onFormFactorChange(state) {
    return {
      ...state,
      windows: state.windows.map((w) =>
        w.layer === "base" && w.state !== "minimized"
          ? { ...w, rect: { ...WIDGET_SURFACE_RECT }, state: "fullscreen" as const }
          : w,
      ),
    };
  },
};
