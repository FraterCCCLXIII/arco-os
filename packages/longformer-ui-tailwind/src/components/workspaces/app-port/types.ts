import type { IconName } from "../../../icons";

/** Presentation mode for a single app inside App Port. */
export type AppPortViewport = "desktop" | "tablet" | "modal" | "phone" | "watch";

export const APP_PORT_VIEWPORT_LABEL: Record<AppPortViewport, string> = {
  desktop: "Desktop",
  tablet: "Tablet",
  modal: "Modal",
  phone: "Phone",
  watch: "Watch",
};

export const APP_PORT_VIEWPORT_ORDER: AppPortViewport[] = ["desktop", "tablet", "modal", "phone", "watch"];

/** How navigation, list, and detail panes are arranged for a viewport. */
export type AppPortLayoutMode = "expanded" | "split" | "stacked" | "watch";

export function layoutModeForViewport(viewport: AppPortViewport): AppPortLayoutMode {
  switch (viewport) {
    case "desktop":
    case "modal":
      return "expanded";
    case "tablet":
      return "split";
    case "phone":
      return "stacked";
    case "watch":
      return "watch";
  }
}

export interface AdaptiveNavItem {
  id: string;
  label: string;
  icon: IconName;
}

export interface AdaptiveListItem {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
}

export type AdaptiveMobilePane = "list" | "detail";

/** Stack depth for watch — sections hub, item list, or item detail. */
export type AdaptiveWatchPane = "sections" | "list" | "detail";
