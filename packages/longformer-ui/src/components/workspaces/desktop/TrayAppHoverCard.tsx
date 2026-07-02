import type { ReactElement } from "react";
import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { HoverCard } from "../../primitives/HoverCard";
import type { DesktopApp, DesktopWindow } from "./types";
import styles from "./TrayAppHoverCard.module.css";

const TONE_CLASS = {
  accent: styles.toneAccent,
  success: styles.toneSuccess,
  warning: styles.toneWarning,
  danger: styles.toneDanger,
  neutral: styles.toneNeutral,
} as const;

export interface TrayAppHoverCardProps {
  app: DesktopApp;
  children: ReactElement;
  running?: boolean;
  active?: boolean;
  activeWindowId?: string;
  windows?: DesktopWindow[];
}

function previewWindowTitle(
  app: DesktopApp,
  windows?: DesktopWindow[],
  activeWindowId?: string,
): string | undefined {
  if (!windows?.length) return undefined;

  const appWindows = windows.filter((window) => window.appId === app.id && !window.minimized);
  if (!appWindows.length) return undefined;

  const focused = activeWindowId ? appWindows.find((window) => window.id === activeWindowId) : undefined;
  if (focused?.title) return focused.title;

  if (appWindows.length === 1) return appWindows[0]?.title;
  return `${appWindows.length} windows open`;
}

/** Hover preview card for pinned apps in dock / taskbar trays. */
export function TrayAppHoverCard({
  app,
  children,
  running = false,
  active = false,
  activeWindowId,
  windows,
}: TrayAppHoverCardProps) {
  const windowTitle = previewWindowTitle(app, windows, active ? activeWindowId : undefined);

  return (
    <HoverCard
      content={
        <div className={styles.card}>
          <div className={styles.header}>
            <span className={cx(styles.icon, TONE_CLASS[app.tone ?? "neutral"])}>
              <Icon name={app.icon} size={18} />
            </span>
            <div className={styles.meta}>
              <span className={styles.title}>{app.label}</span>
              {app.description ? <span className={styles.description}>{app.description}</span> : null}
            </div>
          </div>

          {(active || running) && (
            <div className={styles.statusRow}>
              {active ? <span className={styles.statusActive}>Active</span> : null}
              {running && !active ? <span className={styles.statusRunning}>Running</span> : null}
            </div>
          )}

          {windowTitle ? <div className={styles.windowTitle}>{windowTitle}</div> : null}
        </div>
      }
    >
      {children}
    </HoverCard>
  );
}
