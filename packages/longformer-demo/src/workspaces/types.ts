/**
 * Workspace layout contract — the typed view model every workspace builder
 * receives, and the builder signature the registry stores.
 *
 * The view model is *derived* from the state slices in src/state/ rather
 * than declared by hand. That is what retired the old hand-written
 * `WorkspaceLayoutViewModel` and its 52 `unknown` fields + 59 `as never`
 * casts: slice types and mock-data types now flow through unchanged, so a
 * prop mismatch is a compile error instead of a silent cast.
 */
import type { ReactNode } from "react";
import type {
  ChatSlice,
  CommsSlice,
  EmailSlice,
  FilesSlice,
  ModelSelectionSlice,
  NotesSlice,
  PlannerSlice,
  ProductivitySlice,
} from "../state";
import type { DesktopSlice } from "../state";
import type { staticWorkspaceData } from "../state";
import type { WorkspaceId } from "../workspace-config";

/**
 * Desktop-slice fields that non-desktop workspaces consume (the Apps
 * marketplace page, tray launching, wallpaper setting). The full DesktopSlice
 * stays in App.tsx; only this narrow surface travels with the view model.
 */
export type DesktopViewModelFields = Pick<
  DesktopSlice,
  | "appsSubpage"
  | "setAppsSubpage"
  | "marketplaceCategory"
  | "setMarketplaceCategory"
  | "installedApps"
  | "marketplaceApps"
  | "appSearch"
  | "setAppSearch"
  | "handleTrayLaunchApp"
  | "handleInstallApp"
  | "desktopWallpaperUrl"
  | "setDesktopWallpaperUrl"
> & {
  /** App ids with a visible (non-minimized) window, for "running" badges. */
  runningAppIds: Set<string>;
};

/** Everything a workspace can read: all domain slices + static fixtures. */
export type WorkspaceViewModel = ChatSlice &
  CommsSlice &
  EmailSlice &
  NotesSlice &
  PlannerSlice &
  FilesSlice &
  ProductivitySlice &
  ModelSelectionSlice &
  DesktopViewModelFields &
  typeof staticWorkspaceData & {
    setWorkspaceId: (id: WorkspaceId) => void;
  };

/** View model plus per-render context the shell supplies. */
export type WorkspaceLayoutInput = WorkspaceViewModel & {
  workspaceId: WorkspaceId;
  /** Injected by the shell; only the desktop workspace entry uses it. */
  renderDesktopWorkspace?: () => ReactNode;
};

export interface WorkspaceLayoutOptions {
  /** Include workspace sidebars (false for compact desktop-window embedding). */
  includeSidebar: boolean;
}

export interface WorkspaceLayout {
  sidebar?: ReactNode;
  main: ReactNode;
}

/** One registry entry: turns the view model into a sidebar/main pair. */
export type WorkspaceLayoutBuilder = (
  vm: WorkspaceLayoutInput,
  options: WorkspaceLayoutOptions,
) => WorkspaceLayout;
