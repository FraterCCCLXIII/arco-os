import type { ReactNode } from "react";
import { useState } from "react";
import { cx } from "../../../utils/cx";
import { StatusBar } from "./StatusBar";
import { DesktopSurface } from "./DesktopSurface";
import { TaskTray } from "./TaskTray";
import { ShellPicker } from "./ShellPicker";
import { SpecialPagePicker } from "./SpecialPagePicker";
import { DEVICE_FORM_FACTOR_ORDER, FormFactorPicker } from "./FormFactorPicker";
import { SpecialPageView, type SpecialPageId } from "./special-pages";
import type { FormFactor, SurfaceRect, SurfaceWindow, WindowPolicy } from "../../../surface-manager";
import { toSurfaceWindow } from "../../../surface-manager";
import { FORM_FACTOR_FRAME, formFactorUsesFixedFrame } from "./formFactorFrame";
import type { DesktopApp, DesktopIconItem, DesktopShell, DesktopStatus, DesktopWindow } from "./types";
import type { WidgetTile } from "./widget-types";
import styles from "./DesktopWorkspace.module.css";

export interface DesktopWorkspaceProps {
  shell: DesktopShell;
  onShellChange?: (shell: DesktopShell) => void;
  formFactor?: FormFactor;
  onFormFactorChange?: (formFactor: FormFactor) => void;
  policy?: WindowPolicy;
  apps: DesktopApp[];
  desktopIcons: DesktopIconItem[];
  /** Prefer `surfaceWindows`; legacy flat `windows` still accepted. */
  surfaceWindows?: SurfaceWindow[];
  windows: DesktopWindow[];
  activeWindowId?: string;
  status?: DesktopStatus;
  onLaunchApp: (appId: string) => void;
  onSelectDesktopIcon: (iconId: string) => void;
  onFocusWindow: (windowId: string) => void;
  onCloseWindow: (windowId: string) => void;
  onMinimizeWindow: (windowId: string) => void;
  onMaximizeWindow?: (windowId: string) => void;
  onMoveWindow?: (windowId: string, rect: SurfaceRect) => void;
  onResizeWindow?: (windowId: string, rect: SurfaceRect) => void;
  onPopPhoneStack?: () => void;
  onMinimizeAll?: () => void;
  onNextGlance?: () => void;
  onPrevGlance?: () => void;
  widgetTiles?: WidgetTile[];
  onCreateApp?: () => void;
  /** Tray-specific pinned apps — defaults to `apps` when omitted. */
  trayApps?: DesktopApp[];
  trayOverflowApps?: DesktopApp[];
  onTrayReorder?: (fromIndex: number, toIndex: number) => void;
  onTrayUndock?: (fromIndex: number) => void;
  onMoveToTray?: (id: string, index?: number) => void;
  renderWindowContent?: (window: SurfaceWindow) => ReactNode;
  /** Optional slot rendered above the desktop surface, e.g. shell picker controls. */
  header?: ReactNode;
  /** When set, controls whether the simulated desktop fills the workspace panel. */
  fullscreen?: boolean;
  onFullscreenChange?: (fullscreen: boolean) => void;
  defaultFullscreen?: boolean;
  wallpaperUrl?: string;
  specialPage?: SpecialPageId;
  onSpecialPageChange?: (page: SpecialPageId) => void;
  defaultSpecialPage?: SpecialPageId;
}

/**
 * A simulated OS desktop — status bar on top, dock/taskbar on bottom, and a
 * wallpaper surface with shortcut icons and window frames. Switch `shell` to
 * mimic macOS, Windows, iOS, Android, or Chrome OS chrome.
 */
export function DesktopWorkspace({
  shell,
  onShellChange,
  formFactor = "desktop",
  onFormFactorChange,
  policy,
  apps,
  desktopIcons,
  surfaceWindows,
  windows,
  activeWindowId,
  status,
  onLaunchApp,
  onSelectDesktopIcon,
  onFocusWindow,
  onCloseWindow,
  onMinimizeWindow,
  onMaximizeWindow,
  onMoveWindow,
  onResizeWindow,
  onPopPhoneStack,
  onMinimizeAll,
  onNextGlance,
  onPrevGlance,
  widgetTiles,
  onCreateApp,
  trayApps,
  trayOverflowApps,
  onTrayReorder,
  onTrayUndock,
  onMoveToTray,
  renderWindowContent,
  header,
  fullscreen: controlledFullscreen,
  onFullscreenChange,
  defaultFullscreen = false,
  wallpaperUrl,
  specialPage: controlledSpecialPage,
  onSpecialPageChange,
  defaultSpecialPage = "desktop",
}: DesktopWorkspaceProps) {
  const [internalFullscreen, setInternalFullscreen] = useState(defaultFullscreen);
  const [internalSpecialPage, setInternalSpecialPage] = useState<SpecialPageId>(defaultSpecialPage);
  const fullscreen = controlledFullscreen ?? internalFullscreen;
  const specialPage = controlledSpecialPage ?? internalSpecialPage;
  const showingSpecialPage = specialPage !== "desktop";

  function handleSpecialPageChange(page: SpecialPageId) {
    onSpecialPageChange?.(page);
    if (controlledSpecialPage === undefined) {
      setInternalSpecialPage(page);
    }
  }

  function handleToggleFullscreen() {
    const next = !fullscreen;
    onFullscreenChange?.(next);
    if (controlledFullscreen === undefined) {
      setInternalFullscreen(next);
    }
  }

  const displayWindows =
    surfaceWindows ??
    windows.map((window, index) => toSurfaceWindow(window, index + 1)).filter((w) => w.state !== "minimized");

  const activeSurfaceWindow = displayWindows.find((w) => w.id === activeWindowId);
  const activeLegacyWindow = windows.find((w) => w.id === activeWindowId);
  const mergedStatus: DesktopStatus = {
    ...status,
    activeAppLabel: status?.activeAppLabel ?? activeSurfaceWindow?.title ?? activeLegacyWindow?.title,
  };

  const trayWindows = windows;
  const isMobileShell = shell === "ios" || shell === "android";
  const homeVisible =
    formFactor === "phone" &&
    isMobileShell &&
    !displayWindows.some((window) => window.layer === "base");
  const frame = FORM_FACTOR_FRAME[formFactor];
  const fixedFrame = formFactorUsesFixedFrame(formFactor);

  return (
    <div className={cx(styles.workspace, fullscreen && styles.workspaceFullscreen)}>
      {(onShellChange || onFormFactorChange || !fullscreen) && !fullscreen && (
        <div className={styles.toolbar}>
          {header ?? (
            <>
              <SpecialPagePicker page={specialPage} onPageChange={handleSpecialPageChange} />
              <div className={styles.toolbarPickers}>
                {onFormFactorChange && (
                  <FormFactorPicker
                    formFactor={formFactor}
                    onFormFactorChange={onFormFactorChange}
                    items={DEVICE_FORM_FACTOR_ORDER}
                  />
                )}
                {onShellChange && <ShellPicker shell={shell} onShellChange={onShellChange} />}
              </div>
              {onFormFactorChange && (
                <button
                  type="button"
                  className={cx("lf-focusable", styles.widgetToggle, formFactor === "widget" && styles.widgetToggleActive)}
                  aria-pressed={formFactor === "widget"}
                  onClick={() => onFormFactorChange("widget")}
                >
                  Widget
                </button>
              )}
            </>
          )}
        </div>
      )}
      <div className={cx(styles.deviceStage, fullscreen && styles.deviceStageFullscreen)}>
        <div
          className={cx(styles.deviceScreen, fullscreen && styles.deviceScreenFullscreen)}
          data-shell={shell}
          data-form-factor={formFactor}
          style={
            fixedFrame && !fullscreen
              ? {
                  width: frame.width,
                  height: frame.height,
                }
              : undefined
          }
        >
          {showingSpecialPage ? (
            <SpecialPageView page={specialPage} />
          ) : (
            <>
              <StatusBar
                shell={shell}
                status={mergedStatus}
                fullscreen={fullscreen}
                onToggleFullscreen={handleToggleFullscreen}
              />
              <DesktopSurface
                shell={shell}
                formFactor={formFactor}
                policy={policy}
                icons={desktopIcons}
                apps={apps}
                windows={displayWindows}
                activeWindowId={activeWindowId}
                onSelectIcon={onSelectDesktopIcon}
                onLaunchApp={onLaunchApp}
                onFocusWindow={onFocusWindow}
                onCloseWindow={onCloseWindow}
                onMinimizeWindow={onMinimizeWindow}
                onMaximizeWindow={onMaximizeWindow}
                onMoveWindow={onMoveWindow}
                onResizeWindow={onResizeWindow}
                onNextGlance={onNextGlance}
                onPrevGlance={onPrevGlance}
                onShowMobileHome={onMinimizeAll}
                widgetTiles={widgetTiles}
                renderWindowContent={renderWindowContent}
                wallpaperUrl={wallpaperUrl}
              />
              <TaskTray
                shell={shell}
                formFactor={formFactor}
                apps={trayApps ?? apps}
                overflowApps={trayOverflowApps}
                windows={trayWindows}
                activeWindowId={activeWindowId}
                onLaunchApp={onLaunchApp}
                onFocusWindow={onFocusWindow}
                onMinimizeWindow={onMinimizeWindow}
                onCloseWindow={onCloseWindow}
                onCreateApp={onCreateApp}
                onReorder={onTrayReorder}
                onUndock={onTrayUndock}
                onMoveToTray={onMoveToTray}
                onPopPhoneStack={onPopPhoneStack}
                onMinimizeAll={onMinimizeAll}
                onNextGlance={onNextGlance}
                onPrevGlance={onPrevGlance}
                homeVisible={homeVisible}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
