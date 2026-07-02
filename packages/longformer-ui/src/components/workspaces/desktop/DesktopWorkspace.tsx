import type { ReactNode } from "react";
import { StatusBar } from "./StatusBar";
import { DesktopSurface } from "./DesktopSurface";
import { TaskTray } from "./TaskTray";
import { ShellPicker } from "./ShellPicker";
import { FormFactorPicker } from "./FormFactorPicker";
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
  renderWindowContent?: (window: SurfaceWindow) => ReactNode;
  /** Optional slot rendered above the desktop surface, e.g. shell picker controls. */
  header?: ReactNode;
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
  renderWindowContent,
  header,
}: DesktopWorkspaceProps) {
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
    <div className={styles.workspace}>
      {(onShellChange || onFormFactorChange) && (
        <div className={styles.toolbar}>
          {header ?? (
            <div className={styles.toolbarPickers}>
              {onFormFactorChange && (
                <FormFactorPicker formFactor={formFactor} onFormFactorChange={onFormFactorChange} />
              )}
              {onShellChange && <ShellPicker shell={shell} onShellChange={onShellChange} />}
            </div>
          )}
        </div>
      )}
      <div className={styles.deviceStage}>
        <div
          className={styles.deviceScreen}
          data-shell={shell}
          data-form-factor={formFactor}
          style={
            fixedFrame
              ? {
                  width: frame.width,
                  height: frame.height,
                }
              : undefined
          }
        >
          <StatusBar shell={shell} status={mergedStatus} />
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
          />
          <TaskTray
            shell={shell}
            formFactor={formFactor}
            apps={apps}
            windows={trayWindows}
            activeWindowId={activeWindowId}
            onLaunchApp={onLaunchApp}
            onFocusWindow={onFocusWindow}
            onMinimizeWindow={onMinimizeWindow}
            onCloseWindow={onCloseWindow}
            onCreateApp={onCreateApp}
            onPopPhoneStack={onPopPhoneStack}
            onMinimizeAll={onMinimizeAll}
            onNextGlance={onNextGlance}
            onPrevGlance={onPrevGlance}
            homeVisible={homeVisible}
          />
        </div>
      </div>
    </div>
  );
}
