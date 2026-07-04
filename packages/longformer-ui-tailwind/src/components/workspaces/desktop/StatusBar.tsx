import { useEffect, useState } from "react";
import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import type { DesktopShell, DesktopStatus } from "./types";
import styles from "./StatusBar.tailwind";

export interface StatusBarProps {
  shell: DesktopShell;
  status?: DesktopStatus;
  className?: string;
  /** When true the simulated desktop fills its workspace panel. */
  fullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

function formatClock(date: Date, shell: DesktopShell): string {
  if (shell === "ios" || shell === "android") {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", weekday: shell === "macos" ? "short" : undefined });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}

/** Pixel heights for each shell — kept in sync with `StatusBar.module.css`. */
export const STATUS_BAR_HEIGHT: Record<DesktopShell, number> = {
  macos: 28,
  windows: 32,
  ios: 24,
  android: 24,
  chromeos: 28,
};

export function getStatusBarHeight(shell: DesktopShell): number {
  return STATUS_BAR_HEIGHT[shell];
}

function FullscreenToggle({
  fullscreen,
  onToggle,
}: {
  fullscreen: boolean;
  onToggle: () => void;
}) {
  const label = fullscreen ? "Exit full screen" : "Enter full screen";

  return (
    <button
      type="button"
      className={styles.fullscreenToggle}
      aria-label={label}
      title={label}
      onClick={onToggle}
    >
      <Icon name={fullscreen ? "minimize-2" : "maximize"} size={13} />
    </button>
  );
}

/** Top status / menu bar — adapts layout per shell (macOS menu bar, iOS status bar, etc.). */
export function StatusBar({ shell, status, className, fullscreen = false, onToggleFullscreen }: StatusBarProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const clock = formatClock(now, shell);
  const date = formatDate(now);
  const battery = status?.batteryPercent ?? 84;

  return (
    <header className={cx(styles.bar, styles[shell], className)} role="banner">
      {shell === "macos" && (
        <>
          <div className={styles.left}>
            <Icon name="settings" size={13} aria-hidden="true" />
            <span className={styles.menuApp}>{status?.activeAppLabel ?? "Finder"}</span>
            <span className={styles.menuItem}>File</span>
            <span className={styles.menuItem}>Edit</span>
            <span className={styles.menuItem}>View</span>
            <span className={styles.menuItem}>Window</span>
          </div>
          <div className={styles.right}>
            {onToggleFullscreen && <FullscreenToggle fullscreen={fullscreen} onToggle={onToggleFullscreen} />}
            <Icon name="wifi" size={13} />
            <Icon name="bluetooth" size={13} />
            <Icon name="battery" size={13} />
            <span className={styles.clock}>{clock}</span>
          </div>
        </>
      )}

      {shell === "windows" && (
        <>
          <div className={styles.left}>
            <span className={styles.winMark} aria-hidden="true" />
          </div>
          <div className={styles.center}>
            <span className={styles.searchHint}>Type here to search</span>
          </div>
          <div className={styles.right}>
            {onToggleFullscreen && <FullscreenToggle fullscreen={fullscreen} onToggle={onToggleFullscreen} />}
            <Icon name="wifi" size={13} />
            <Icon name="volume" size={13} />
            <Icon name="battery" size={13} />
            <span className={styles.clock}>{clock}</span>
            <span className={styles.date}>{date}</span>
          </div>
        </>
      )}

      {(shell === "ios" || shell === "android") && (
        <>
          <div className={styles.left}>
            <span className={styles.mobileClock}>{clock}</span>
          </div>
          <div className={cx(styles.center, styles.notchArea)} aria-hidden="true" />
          <div className={styles.right}>
            {onToggleFullscreen && <FullscreenToggle fullscreen={fullscreen} onToggle={onToggleFullscreen} />}
            {status?.wifi !== false && <Icon name="wifi" size={12} />}
            <Icon name="battery" size={12} />
            <span className={styles.batteryPct}>{battery}%</span>
          </div>
        </>
      )}

      {shell === "chromeos" && (
        <>
          <div className={styles.left}>
            <Icon name="grid" size={14} />
            <span className={styles.menuApp}>Longformer</span>
          </div>
          <div className={styles.right}>
            {onToggleFullscreen && <FullscreenToggle fullscreen={fullscreen} onToggle={onToggleFullscreen} />}
            <Icon name="wifi" size={13} />
            <Icon name="battery" size={13} />
            <span className={styles.clock}>{clock}</span>
          </div>
        </>
      )}
    </header>
  );
}
