/**
 * Data model for the phone home-screen interaction — pages of apps/folders
 * plus a dock row. Kept as plain objects so layouts can be serialized or
 * agent-generated.
 */

export interface PhoneApp {
  id: string;
  name: string;
  /** Index into the built-in gradient palette. */
  colorIndex: number;
}

export interface PhoneFolder {
  id: string;
  name: string;
  apps: PhoneApp[];
}

export type PhoneHomeItem =
  | { type: "app"; app: PhoneApp }
  | { type: "folder"; folder: PhoneFolder };

export interface PhoneHomeLayout {
  pages: PhoneHomeItem[][];
  dock: PhoneHomeItem[];
}

/** Where an icon lives on the home screen — used for drag/drop bookkeeping. */
export interface PhoneHomeLocation {
  zone: "page" | "dock";
  pageIndex?: number;
  itemIndex: number;
}

export interface PhoneHomeScreenProps {
  /** Defaults to a randomly seeded two-page layout. */
  layout?: PhoneHomeLayout;
  pageCount?: number;
  carrier?: string;
  wallpaperUrl?: string;
  className?: string;
  /** Fill the parent container instead of using fixed phone dimensions. */
  fill?: boolean;
  /** Hide the built-in status row (use when an outer status bar is present). */
  hideStatusBar?: boolean;
  /** Show the drag-to-folder hint footer. */
  showHint?: boolean;
  onLayoutChange?: (layout: PhoneHomeLayout) => void;
  onAppLaunch?: (appId: string) => void;
}
