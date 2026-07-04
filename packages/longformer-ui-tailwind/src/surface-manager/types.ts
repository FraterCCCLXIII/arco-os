import type { ReactNode } from "react";
import type { IconName } from "../icons";
import type { DesktopShell } from "../components/workspaces/desktop/types";

/** Device class — controls window movement and layout rules. */
export type FormFactor = "desktop" | "tablet" | "phone" | "watch" | "widget";

export const FORM_FACTOR_LABEL: Record<FormFactor, string> = {
  desktop: "Desktop",
  tablet: "Tablet",
  phone: "Phone",
  watch: "Watch",
  widget: "Widget",
};

export type WindowState = "normal" | "minimized" | "maximized" | "fullscreen";

export type WindowLayer = "base" | "sheet" | "modal";

export interface SurfaceRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SurfaceWindow {
  id: string;
  appId: string;
  title: string;
  icon: IconName;
  rect: SurfaceRect;
  state: WindowState;
  /** Monotonic rank — higher values render closer to the user. */
  stackOrder: number;
  layer: WindowLayer;
  /** Saved rect before maximize — restored on un-maximize. */
  savedRect?: SurfaceRect;
  content?: ReactNode;
}

export interface SurfaceManagerState {
  formFactor: FormFactor;
  shell: DesktopShell;
  windows: SurfaceWindow[];
  activeWindowId?: string;
  /** Phone navigation stack — last entry is the focused base window. */
  phoneStack: string[];
  /** Index into non-minimized base windows for watch glances. */
  watchGlanceIndex: number;
}

export interface OpenWindowInput {
  id: string;
  appId: string;
  title: string;
  icon: IconName;
  content?: ReactNode;
  layer?: WindowLayer;
}

export interface WindowPolicy {
  formFactor: FormFactor;
  allowDrag: boolean;
  allowResize: boolean;
  maxVisible: number;
  defaultPlacement: (windows: SurfaceWindow[], input: OpenWindowInput) => SurfaceRect;
  constrainRect: (rect: SurfaceRect, windows: SurfaceWindow[], windowId: string) => SurfaceRect;
  onOpen?: (state: SurfaceManagerState, window: SurfaceWindow) => SurfaceManagerState;
  onFocus?: (state: SurfaceManagerState, windowId: string) => SurfaceManagerState;
  onFormFactorChange?: (state: SurfaceManagerState) => SurfaceManagerState;
}

export type SurfaceAction =
  | { type: "OPEN"; window: OpenWindowInput }
  | { type: "CLOSE"; windowId: string }
  | { type: "FOCUS"; windowId: string }
  | { type: "MINIMIZE"; windowId: string }
  | { type: "RESTORE"; windowId: string }
  | { type: "MAXIMIZE"; windowId: string }
  | { type: "BRING_TO_FRONT"; windowId: string }
  | { type: "SEND_TO_BACK"; windowId: string }
  | { type: "MOVE"; windowId: string; rect: SurfaceRect }
  | { type: "RESIZE"; windowId: string; rect: SurfaceRect }
  | { type: "PUSH"; windowId: string }
  | { type: "POP" }
  | { type: "PRESENT_SHEET"; windowId: string }
  | { type: "DISMISS_SHEET"; windowId: string }
  | { type: "NEXT_GLANCE" }
  | { type: "PREV_GLANCE" }
  | { type: "SET_GLANCE_INDEX"; index: number }
  | { type: "SET_FORM_FACTOR"; formFactor: FormFactor }
  | { type: "SET_SHELL"; shell: DesktopShell };

/** Legacy flat layout — use `toSurfaceWindow` when migrating. */
export interface LegacyDesktopWindow {
  id: string;
  appId: string;
  title: string;
  icon: IconName;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized?: boolean;
  content?: ReactNode;
}

export function toSurfaceWindow(
  window: LegacyDesktopWindow,
  stackOrder: number,
  layer: WindowLayer = "base",
): SurfaceWindow {
  return {
    id: window.id,
    appId: window.appId,
    title: window.title,
    icon: window.icon,
    rect: { x: window.x, y: window.y, width: window.width, height: window.height },
    state: window.minimized ? "minimized" : "normal",
    stackOrder,
    layer,
    content: window.content,
  };
}

export function fromSurfaceWindow(window: SurfaceWindow): LegacyDesktopWindow {
  return {
    id: window.id,
    appId: window.appId,
    title: window.title,
    icon: window.icon,
    x: window.rect.x,
    y: window.rect.y,
    width: window.rect.width,
    height: window.rect.height,
    minimized: window.state === "minimized",
    content: window.content,
  };
}
