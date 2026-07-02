import { useEffect, useState } from "react";
import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { Tooltip } from "../../primitives/Tooltip";
import { TrayAppHoverCard, type TrayAppMenuActionHandlers } from "./TrayAppHoverCard";
import type { FormFactor } from "../../../surface-manager";
import type { DesktopApp, DesktopShell, DesktopWindow } from "./types";
import styles from "./TaskTray.module.css";

export interface TaskTrayProps {
  shell: DesktopShell;
  formFactor?: FormFactor;
  apps: DesktopApp[];
  windows: DesktopWindow[];
  activeWindowId?: string;
  onLaunchApp: (appId: string) => void;
  onFocusWindow: (windowId: string) => void;
  onMinimizeWindow?: (windowId: string) => void;
  onCloseWindow?: (windowId: string) => void;
  /** Opens the create-app flow — rendered as a trailing plus control in the dock. */
  onCreateApp?: () => void;
  onPopPhoneStack?: () => void;
  onMinimizeAll?: () => void;
  onNextGlance?: () => void;
  onPrevGlance?: () => void;
  /** Phone launcher is visible — hide duplicate dock/shelf chrome. */
  homeVisible?: boolean;
  /** Overlay mode for the global hover dock — drops full-bleed taskbar chrome. */
  floating?: boolean;
  className?: string;
}

const TONE_CLASS = {
  accent: styles.toneAccent,
  success: styles.toneSuccess,
  warning: styles.toneWarning,
  danger: styles.toneDanger,
  neutral: styles.toneNeutral,
} as const;

function trayMenuHandlers(
  appId: string,
  windows: DesktopWindow[],
  onLaunchApp: (appId: string) => void,
  onFocusWindow: (windowId: string) => void,
  onMinimizeWindow?: (windowId: string) => void,
  onCloseWindow?: (windowId: string) => void,
): TrayAppMenuActionHandlers {
  const appWindows = () => windows.filter((window) => window.appId === appId);
  const openWindows = () => appWindows().filter((window) => !window.minimized);

  return {
    onNewWindow: () => onLaunchApp(appId),
    onNewPrivateWindow: () => onLaunchApp(appId),
    onShowAllWindows: () => {
      const visible = openWindows();
      if (visible[0]) onFocusWindow(visible[0].id);
      else onLaunchApp(appId);
    },
    onHide: () => {
      openWindows().forEach((window) => onMinimizeWindow?.(window.id));
    },
    onQuit: () => {
      appWindows().forEach((window) => onCloseWindow?.(window.id));
    },
  };
}

/** Bottom dock / taskbar / navigation tray — shell-specific layout and chrome. */
export function TaskTray({
  shell,
  formFactor = "desktop",
  apps,
  windows,
  activeWindowId,
  onLaunchApp,
  onFocusWindow,
  onMinimizeWindow,
  onCloseWindow,
  onCreateApp,
  onPopPhoneStack,
  onMinimizeAll,
  onNextGlance,
  onPrevGlance,
  homeVisible = false,
  floating = false,
  className,
}: TaskTrayProps) {
  const openAppIds = new Set(windows.filter((w) => !w.minimized).map((w) => w.appId));
  const pinnedApps = apps.filter((app) => app.pinned !== false);

  if (shell === "android") {
    return (
      <footer className={cx(styles.tray, styles.android, floating && styles.floating, className)} role="contentinfo">
        <div className={styles.androidNav}>
          <button
            type="button"
            className={styles.androidNavButton}
            aria-label="Back"
            onClick={formFactor === "phone" ? onPopPhoneStack : undefined}
          >
            <Icon name="chevron-left" size={18} />
          </button>
          <button
            type="button"
            className={styles.androidNavButton}
            aria-label="Home"
            onClick={formFactor === "phone" ? onMinimizeAll : undefined}
          >
            <Icon name="home" size={18} />
          </button>
          <button type="button" className={styles.androidNavButton} aria-label="Recents">
            <Icon name="layers" size={18} />
          </button>
        </div>
        {!homeVisible && (
        <div className={styles.androidShelf}>
          {pinnedApps.slice(0, 5).map((app) => {
            const running = openAppIds.has(app.id);
            const active = windows.some((w) => w.appId === app.id && w.id === activeWindowId);
            return (
            <TrayAppHoverCard
              key={app.id}
              app={app}
              running={running}
              active={active}
              windows={windows}
              activeWindowId={activeWindowId}
              {...trayMenuHandlers(app.id, windows, onLaunchApp, onFocusWindow, onMinimizeWindow, onCloseWindow)}
            >
              <button
                type="button"
                className={cx(styles.trayIcon, TONE_CLASS[app.tone ?? "neutral"], running && styles.trayIconActive)}
                aria-label={app.label}
                onClick={() => onLaunchApp(app.id)}
              >
                <Icon name={app.icon} size={18} />
              </button>
            </TrayAppHoverCard>
            );
          })}
          <TrayCreateButton iconSize={18} onCreateApp={onCreateApp} />
        </div>
        )}
      </footer>
    );
  }

  if (shell === "ios") {
    return (
      <footer className={cx(styles.tray, styles.ios, floating && styles.floating, className)} role="contentinfo">
        {!homeVisible && (
        <div className={styles.iosDock}>
          {pinnedApps.slice(0, 4).map((app) => {
            const running = openAppIds.has(app.id);
            const active = windows.some((w) => w.appId === app.id && w.id === activeWindowId);
            return (
            <TrayAppHoverCard
              key={app.id}
              app={app}
              running={running}
              active={active}
              windows={windows}
              activeWindowId={activeWindowId}
              {...trayMenuHandlers(app.id, windows, onLaunchApp, onFocusWindow, onMinimizeWindow, onCloseWindow)}
            >
              <button
                type="button"
                className={cx(styles.trayIcon, styles.iosIcon, TONE_CLASS[app.tone ?? "neutral"], running && styles.trayIconActive)}
                aria-label={app.label}
                onClick={() => onLaunchApp(app.id)}
              >
                <Icon name={app.icon} size={20} />
              </button>
            </TrayAppHoverCard>
            );
          })}
          <TrayCreateButton iconSize={20} ios onCreateApp={onCreateApp} />
        </div>
        )}
        {formFactor === "watch" && (
          <div className={styles.watchNav}>
            <button type="button" className={styles.androidNavButton} aria-label="Previous glance" onClick={onPrevGlance}>
              <Icon name="chevron-left" size={16} />
            </button>
            <button type="button" className={styles.androidNavButton} aria-label="Next glance" onClick={onNextGlance}>
              <Icon name="chevron-right" size={16} />
            </button>
          </div>
        )}
        <button
          type="button"
          className={styles.homeIndicator}
          aria-label="Home"
          onClick={formFactor === "phone" ? onMinimizeAll : undefined}
        />
      </footer>
    );
  }

  if (shell === "windows") {
    return (
      <WindowsTaskTray
        apps={pinnedApps}
        windows={windows}
        activeWindowId={activeWindowId}
        openAppIds={openAppIds}
        floating={floating}
        className={className}
        onLaunchApp={onLaunchApp}
        onFocusWindow={onFocusWindow}
        onMinimizeWindow={onMinimizeWindow}
        onCloseWindow={onCloseWindow}
        onCreateApp={onCreateApp}
      />
    );
  }

  // macOS dock + Chrome OS shelf share a centered icon row
  return (
    <footer className={cx(styles.tray, styles[shell], floating && styles.floating, className)} role="contentinfo">
      <div className={shell === "macos" ? styles.macosDock : styles.chromeShelf}>
        {pinnedApps.map((app) => {
          const running = openAppIds.has(app.id);
          const active = windows.some((w) => w.appId === app.id && w.id === activeWindowId);
          return (
            <TrayAppHoverCard
              key={app.id}
              app={app}
              running={running}
              active={active}
              windows={windows}
              activeWindowId={activeWindowId}
              {...trayMenuHandlers(app.id, windows, onLaunchApp, onFocusWindow, onMinimizeWindow, onCloseWindow)}
            >
              <button
                type="button"
                className={cx(
                  styles.trayIcon,
                  shell === "macos" && styles.macosIcon,
                  TONE_CLASS[app.tone ?? "neutral"],
                  running && styles.trayIconActive,
                )}
                aria-label={app.label}
                onClick={() => onLaunchApp(app.id)}
              >
                <Icon name={app.icon} size={shell === "macos" ? 22 : 18} />
                {running && shell === "macos" && <span className={styles.dockDot} aria-hidden="true" />}
              </button>
            </TrayAppHoverCard>
          );
        })}
        <TrayCreateButton iconSize={shell === "macos" ? 22 : 18} macos={shell === "macos"} onCreateApp={onCreateApp} />
      </div>
    </footer>
  );
}

interface WindowsTaskTrayProps {
  apps: DesktopApp[];
  windows: DesktopWindow[];
  activeWindowId?: string;
  openAppIds: Set<string>;
  floating?: boolean;
  className?: string;
  onLaunchApp: (appId: string) => void;
  onFocusWindow: (windowId: string) => void;
  onMinimizeWindow?: (windowId: string) => void;
  onCloseWindow?: (windowId: string) => void;
  onCreateApp?: () => void;
}

function formatWindowsTrayClock(date: Date): string {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function formatWindowsTrayDate(date: Date): string {
  return date.toLocaleDateString([], { month: "numeric", day: "numeric", year: "numeric" });
}

/** Windows 11–style taskbar — centered pinned apps, accent running pills, tray clock. */
function WindowsTaskTray({
  apps,
  windows,
  activeWindowId,
  openAppIds,
  floating,
  className,
  onLaunchApp,
  onFocusWindow,
  onMinimizeWindow,
  onCloseWindow,
  onCreateApp,
}: WindowsTaskTrayProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <footer className={cx(styles.tray, styles.windows, floating && styles.floating, className)} role="contentinfo">
      <Tooltip label="Start">
        <button type="button" className={cx(styles.startButton, "lf-focusable")} aria-label="Start">
          <span className={styles.startMark} aria-hidden="true" />
        </button>
      </Tooltip>

      <div className={styles.taskList}>
        <div className={styles.taskListInner}>
          {apps.map((app) => {
            const running = openAppIds.has(app.id);
            const active = windows.some((w) => w.appId === app.id && w.id === activeWindowId);
            return (
              <TrayAppHoverCard
                key={app.id}
                app={app}
                running={running}
                active={active}
                windows={windows}
                activeWindowId={activeWindowId}
                {...trayMenuHandlers(app.id, windows, onLaunchApp, onFocusWindow, onMinimizeWindow, onCloseWindow)}
              >
                <button
                  type="button"
                  className={cx(
                    styles.taskButton,
                    "lf-focusable",
                    running && styles.taskButtonRunning,
                    active && styles.taskButtonActive,
                  )}
                  aria-label={app.label}
                  aria-pressed={active}
                  onClick={() => {
                    const win = windows.find((w) => w.appId === app.id && !w.minimized);
                    if (win) onFocusWindow(win.id);
                    else onLaunchApp(app.id);
                  }}
                >
                  <span className={cx(styles.windowsIcon, TONE_CLASS[app.tone ?? "neutral"])}>
                    <Icon name={app.icon} size={14} />
                  </span>
                </button>
              </TrayAppHoverCard>
            );
          })}
          <TrayCreateButton iconSize={14} windows onCreateApp={onCreateApp} />
        </div>
      </div>

      <div className={styles.systemTray}>
        <button type="button" className={cx(styles.systemTrayButton, "lf-focusable")} aria-label="Network">
          <Icon name="wifi" size={14} />
        </button>
        <button type="button" className={cx(styles.systemTrayButton, "lf-focusable")} aria-label="Volume">
          <Icon name="volume" size={14} />
        </button>
        <button type="button" className={cx(styles.systemTrayButton, "lf-focusable")} aria-label="Battery">
          <Icon name="battery" size={14} />
        </button>
        <button type="button" className={cx(styles.systemTrayClock, "lf-focusable")} aria-label="Date and time">
          <span className={styles.systemTrayTime}>{formatWindowsTrayClock(now)}</span>
          <span className={styles.systemTrayDate}>{formatWindowsTrayDate(now)}</span>
        </button>
      </div>
    </footer>
  );
}

interface TrayCreateButtonProps {
  iconSize: number;
  onCreateApp?: () => void;
  macos?: boolean;
  ios?: boolean;
  windows?: boolean;
}

/** Trailing plus control shared across shell-specific tray layouts. */
function TrayCreateButton({ iconSize, onCreateApp, macos, ios, windows }: TrayCreateButtonProps) {
  if (!onCreateApp) return null;

  return (
    <>
      <span className={cx(styles.trayDivider, windows && styles.trayDividerWindows)} aria-hidden="true" />
      <button
        type="button"
        className={cx(
          styles.createButton,
          "lf-focusable",
          macos && styles.macosIcon,
          ios && styles.iosIcon,
          windows && styles.createButtonWindows,
        )}
        aria-label="Create new app"
        onClick={onCreateApp}
      >
        <Icon name="plus" size={iconSize} />
      </button>
    </>
  );
}
