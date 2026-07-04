import type { AppPortViewport } from "./types";

export interface AppPortFrameSize {
  width: number;
  height: number;
}

/** Logical viewport dimensions used to frame a single app preview. */
export const APP_PORT_FRAME: Record<AppPortViewport, AppPortFrameSize> = {
  desktop: { width: 1280, height: 800 },
  tablet: { width: 834, height: 1112 },
  modal: { width: 1024, height: 680 },
  phone: { width: 390, height: 844 },
  watch: { width: 196, height: 242 },
};

export const APP_PORT_MODAL_MIN: AppPortFrameSize = { width: 520, height: 360 };
export const APP_PORT_MODAL_MAX: AppPortFrameSize = { width: 1400, height: 960 };

export function appPortUsesFixedFrame(viewport: AppPortViewport): boolean {
  return viewport !== "desktop";
}
