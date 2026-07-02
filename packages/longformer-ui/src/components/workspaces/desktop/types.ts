import type { ReactNode } from "react";
import type { IconName } from "../../../icons";
import type { SurfaceWindow } from "../../../surface-manager";

/** Which OS shell chrome to mimic — macOS menu bar + dock, Windows taskbar, mobile status bars, etc. */
export type DesktopShell = "macos" | "windows" | "ios" | "android" | "chromeos";

export const DESKTOP_SHELL_LABEL: Record<DesktopShell, string> = {
  macos: "macOS",
  windows: "Windows",
  ios: "iOS",
  android: "Android",
  chromeos: "Chrome OS",
};

export interface DesktopApp {
  id: string;
  label: string;
  icon: IconName;
  /** Accent used for the app tile / dock icon background. */
  tone?: "accent" | "success" | "warning" | "danger" | "neutral";
  /** Optional blurb shown in tray hover cards. */
  description?: string;
  pinned?: boolean;
}

export interface DesktopIconItem {
  id: string;
  label: string;
  icon: IconName;
  appId: string;
}

/**
 * @deprecated Prefer `SurfaceWindow` from `surface-manager`. Flat layout kept for mock data migration.
 */
export interface DesktopWindow {
  id: string;
  appId: string;
  title: string;
  icon: IconName;
  /** Percent-based layout within the desktop surface. */
  x: number;
  y: number;
  width: number;
  height: number;
  minimized?: boolean;
  content?: ReactNode;
}

export type { SurfaceWindow };

export interface DesktopStatus {
  wifi?: boolean;
  bluetooth?: boolean;
  batteryPercent?: number;
  volume?: boolean;
  /** Shown in the menu bar / status area for macOS-style shells. */
  activeAppLabel?: string;
}
