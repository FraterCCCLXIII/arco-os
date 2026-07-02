import type { SurfaceWindow, WindowPolicy } from "../types";
import { PHONE_RECT } from "./desktop";

export const phonePolicy: WindowPolicy = {
  formFactor: "phone",
  allowDrag: false,
  allowResize: false,
  maxVisible: 1,
  defaultPlacement() {
    return { ...PHONE_RECT };
  },
  constrainRect(_rect) {
    return { ...PHONE_RECT };
  },
  onOpen(state, window) {
    const stack = state.phoneStack.filter((id) => id !== window.id);
    stack.push(window.id);
    const windows = state.windows.map((w) =>
      w.layer === "base" ? { ...w, rect: { ...PHONE_RECT }, state: "fullscreen" as const } : w,
    );
    return { ...state, phoneStack: stack, windows, activeWindowId: window.id };
  },
  onFocus(state, windowId) {
    const stack = state.phoneStack.filter((id) => id !== windowId);
    stack.push(windowId);
    return { ...state, phoneStack: stack, activeWindowId: windowId };
  },
  onFormFactorChange(state) {
    const windows = state.windows.map((w) =>
      w.layer === "base" ? { ...w, rect: { ...PHONE_RECT }, state: "fullscreen" as const } : w,
    );
    const stack =
      state.phoneStack.length > 0
        ? state.phoneStack
        : windows.filter((w) => w.layer === "base" && w.state !== "minimized").map((w) => w.id);
    return { ...state, windows, phoneStack: stack };
  },
};

export function phoneVisibleWindowIds(state: {
  windows: SurfaceWindow[];
  phoneStack: string[];
}): string[] {
  const baseTop = state.phoneStack[state.phoneStack.length - 1];
  const overlays = state.windows
    .filter((w) => (w.layer === "sheet" || w.layer === "modal") && w.state !== "minimized")
    .sort((a, b) => a.stackOrder - b.stackOrder)
    .map((w) => w.id);

  if (!baseTop) {
    return overlays;
  }
  return [baseTop, ...overlays];
}
