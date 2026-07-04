/**
 * Desktop & apps state — the surface manager (windowing), wallpaper, nav-rail
 * pinning, the tray dock, the app marketplace, and user-created custom apps.
 *
 * This slice owns everything about *where apps live and how they launch*.
 * It takes the router's workspaceId/setWorkspaceId as arguments because
 * launching an app can navigate (e.g. tray launch jumps to the desktop),
 * and navigation is owned by the URL, not by this hook.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useSurfaceManager,
  DEFAULT_DESKTOP_WALLPAPER_URL,
  type CreateAppPayload,
  type AppsSubpage,
  type MarketplaceCategoryId,
} from "longformer-ui";
import {
  WORKSPACES,
  loadPinnedWorkspaceIds,
  loadTrayPinnedIds,
  moveAppToTray,
  normalizeTrayPinnedIds,
  savePinnedWorkspaceIds,
  saveTrayPinnedIds,
  splitAppsByTrayPinned,
  splitWorkspacesByPinned,
  workspacesToDesktopApps,
  type WorkspaceId,
} from "../workspace-config";
import {
  buildInstalledApps,
  buildMarketplaceApps,
  initialInstalledAppIds,
} from "../mock-data/apps";
import {
  createCustomApp,
  createCustomAppWindow,
  toDesktopApp,
  type CustomApp,
} from "../mock-data/custom-apps";
import {
  createWindowForApp,
  desktopIcons,
  initialSurfaceWindows,
  isDesktopLaunchableWorkspace,
} from "../mock-data/desktop";

const DESKTOP_WALLPAPER_STORAGE_KEY = "longformer-desktop-wallpaper";

function loadDesktopWallpaperUrl(): string {
  if (typeof window === "undefined") return DEFAULT_DESKTOP_WALLPAPER_URL;

  try {
    const saved = window.localStorage.getItem(DESKTOP_WALLPAPER_STORAGE_KEY);
    return saved ?? DEFAULT_DESKTOP_WALLPAPER_URL;
  } catch {
    return DEFAULT_DESKTOP_WALLPAPER_URL;
  }
}

/**
 * Maps non-workspace app ids (marketplace listings like "zoom", "figma") to
 * the workspace that best demos them when launched from the tray.
 */
const APP_WORKSPACE: Partial<Record<string, WorkspaceId>> = {
  ...Object.fromEntries(WORKSPACES.map((workspace) => [workspace.id, workspace.id])),
  zoom: "contacts",
  linear: "tasks",
  notion: "notes",
  figma: "generated",
  github: "desktop",
  docker: "desktop",
  spotify: "music",
  "1password": "passport",
  analytics: "generated",
} as Partial<Record<string, WorkspaceId>>;

export interface DesktopStateArgs {
  workspaceId: WorkspaceId;
  setWorkspaceId: (id: WorkspaceId) => void;
}

export function useDesktopState({ workspaceId, setWorkspaceId }: DesktopStateArgs) {
  // --- Windowing (surface manager) -------------------------------------
  const surface = useSurfaceManager({
    formFactor: "desktop",
    shell: "macos",
    initialWindows: initialSurfaceWindows,
  });
  const [desktopFullscreen, setDesktopFullscreen] = useState(false);
  const [desktopWallpaperUrl, setDesktopWallpaperUrlState] = useState(loadDesktopWallpaperUrl);

  const setDesktopWallpaperUrl = useCallback((url: string) => {
    setDesktopWallpaperUrlState(url);
    try {
      window.localStorage.setItem(DESKTOP_WALLPAPER_STORAGE_KEY, url);
    } catch {
      /* ignore storage failures */
    }
  }, []);

  // Fullscreen is a desktop-only mode; leaving the workspace exits it.
  useEffect(() => {
    if (workspaceId !== "desktop") {
      setDesktopFullscreen(false);
    }
  }, [workspaceId]);

  // --- Nav rail pinning (persisted) -------------------------------------
  const [pinnedWorkspaceIds, setPinnedWorkspaceIds] = useState<WorkspaceId[]>(() =>
    loadPinnedWorkspaceIds(),
  );

  useEffect(() => {
    savePinnedWorkspaceIds(pinnedWorkspaceIds);
  }, [pinnedWorkspaceIds]);

  const { pinned: railWorkspaces, overflow: overflowWorkspaces } = useMemo(
    () => splitWorkspacesByPinned(pinnedWorkspaceIds),
    [pinnedWorkspaceIds],
  );

  // --- Marketplace & custom apps ---------------------------------------
  const [appsSubpage, setAppsSubpage] = useState<AppsSubpage>("installed");
  const [marketplaceCategory, setMarketplaceCategory] = useState<MarketplaceCategoryId>("featured");
  const [appSearch, setAppSearch] = useState("");
  const [installedAppIds, setInstalledAppIds] = useState<Set<string>>(
    () => new Set(initialInstalledAppIds),
  );
  const [customApps, setCustomApps] = useState<CustomApp[]>([]);
  const [createAppOpen, setCreateAppOpen] = useState(false);

  const customDesktopApps = useMemo(() => customApps.map(toDesktopApp), [customApps]);
  const allDesktopApps = useMemo(
    () => [...workspacesToDesktopApps(), ...customDesktopApps],
    [customDesktopApps],
  );
  const allAppIds = useMemo(() => allDesktopApps.map((app) => app.id), [allDesktopApps]);

  // --- Tray dock (persisted) --------------------------------------------
  const [trayPinnedIds, setTrayPinnedIds] = useState<string[]>(() => loadTrayPinnedIds(allAppIds));

  // Creating/removing custom apps changes the known-app set; renormalize so
  // the tray never references a deleted app and new apps get appended.
  useEffect(() => {
    setTrayPinnedIds((prev) => normalizeTrayPinnedIds(prev, allAppIds));
  }, [allAppIds]);

  useEffect(() => {
    saveTrayPinnedIds(trayPinnedIds);
  }, [trayPinnedIds]);

  const { pinned: trayPinnedApps, overflow: trayOverflowApps } = useMemo(
    () => splitAppsByTrayPinned(trayPinnedIds, allDesktopApps),
    [trayPinnedIds, allDesktopApps],
  );

  const installedApps = useMemo(
    () => buildInstalledApps(installedAppIds, customApps),
    [installedAppIds, customApps],
  );
  const marketplaceApps = useMemo(() => buildMarketplaceApps(installedAppIds), [installedAppIds]);

  // --- Launch & window actions ------------------------------------------

  /** Launch on the desktop surface: focus an existing window or open a new one. */
  const handleLaunchDesktopApp = useCallback(
    (appId: string) => {
      if (appId === "desktop") return;

      const existing = surface.windows.find(
        (window) => window.appId === appId && window.state !== "minimized" && window.layer === "base",
      );
      if (existing) {
        surface.focus(existing.id);
        return;
      }

      const app = allDesktopApps.find((a) => a.id === appId);
      if (!app) return;
      const customApp = customApps.find((item) => item.id === appId);
      if (customApp) {
        surface.open(createCustomAppWindow(customApp, surface.windows.length));
        return;
      }
      if (!isDesktopLaunchableWorkspace(appId)) return;
      surface.openApp(app, createWindowForApp);
    },
    [surface, allDesktopApps, customApps],
  );

  const handleSelectDesktopIcon = useCallback(
    (iconId: string) => {
      const icon = desktopIcons.find((item) => item.id === iconId);
      if (icon) handleLaunchDesktopApp(icon.appId);
    },
    [handleLaunchDesktopApp],
  );

  const handleCloseDesktopWindow = useCallback(
    (windowId: string) => {
      surface.close(windowId);
    },
    [surface],
  );

  const handleMinimizeDesktopWindow = useCallback(
    (windowId: string) => {
      surface.minimize(windowId);
    },
    [surface],
  );

  const handleMinimizeAllPhoneWindows = useCallback(() => {
    surface.windows
      .filter((window) => window.layer === "base" && window.state !== "minimized")
      .forEach((window) => surface.minimize(window.id));
  }, [surface]);

  /**
   * Launch from the tray outside the desktop: custom apps hop to the desktop
   * surface, workspace apps navigate to their workspace. The desktop launch is
   * queued in a microtask so it runs after the navigation commits.
   */
  const handleTrayLaunchApp = useCallback(
    (appId: string) => {
      if (workspaceId === "desktop") {
        handleLaunchDesktopApp(appId);
        return;
      }
      if (customApps.some((app) => app.id === appId)) {
        setWorkspaceId("desktop");
        queueMicrotask(() => handleLaunchDesktopApp(appId));
        return;
      }
      const target = APP_WORKSPACE[appId];
      if (target === "desktop") {
        setWorkspaceId("desktop");
        queueMicrotask(() => handleLaunchDesktopApp(appId));
      } else if (target) {
        setWorkspaceId(target);
      }
    },
    [workspaceId, customApps, handleLaunchDesktopApp, setWorkspaceId],
  );

  const handleInstallApp = useCallback((appId: string) => {
    setInstalledAppIds((prev) => new Set([...prev, appId]));
  }, []);

  /** Create a custom app: install it, pin it to the tray, and launch it. */
  const handleCreateApp = useCallback(
    (payload: CreateAppPayload) => {
      const app = createCustomApp(payload);
      setCustomApps((prev) => [...prev, app]);
      setInstalledAppIds((prev) => new Set([...prev, app.id]));
      setTrayPinnedIds((prev) => moveAppToTray(prev, app.id));
      setCreateAppOpen(false);

      if (workspaceId !== "desktop") {
        setWorkspaceId("desktop");
      }
      queueMicrotask(() => handleLaunchDesktopApp(app.id));
    },
    [workspaceId, setWorkspaceId, handleLaunchDesktopApp],
  );

  const openCreateAppModal = useCallback(() => {
    setCreateAppOpen(true);
  }, []);

  /** Tray click on a minimized window: go to the desktop and restore it. */
  const handleTrayFocusWindow = useCallback(
    (windowId: string) => {
      setWorkspaceId("desktop");
      surface.restore(windowId);
      surface.focus(windowId);
    },
    [setWorkspaceId, surface],
  );

  return {
    surface,
    desktopFullscreen,
    setDesktopFullscreen,
    desktopWallpaperUrl,
    setDesktopWallpaperUrl,
    pinnedWorkspaceIds,
    setPinnedWorkspaceIds,
    railWorkspaces,
    overflowWorkspaces,
    appsSubpage,
    setAppsSubpage,
    marketplaceCategory,
    setMarketplaceCategory,
    appSearch,
    setAppSearch,
    installedApps,
    marketplaceApps,
    customApps,
    createAppOpen,
    setCreateAppOpen,
    allDesktopApps,
    trayPinnedApps,
    trayOverflowApps,
    setTrayPinnedIds,
    handleLaunchDesktopApp,
    handleSelectDesktopIcon,
    handleCloseDesktopWindow,
    handleMinimizeDesktopWindow,
    handleMinimizeAllPhoneWindows,
    handleTrayLaunchApp,
    handleInstallApp,
    handleCreateApp,
    openCreateAppModal,
    handleTrayFocusWindow,
  };
}

export type DesktopSlice = ReturnType<typeof useDesktopState>;
