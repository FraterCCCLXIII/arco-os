import { Icon } from "../../../icons";
import { cx } from "../../../utils/cx";
import type { DesktopApp } from "./types";
import styles from "./AndroidHomeScreen.module.css";

const TONE_CLASS = {
  accent: styles.toneAccent,
  success: styles.toneSuccess,
  warning: styles.toneWarning,
  danger: styles.toneDanger,
  neutral: styles.toneNeutral,
} as const;

export interface AndroidHomeScreenProps {
  apps: DesktopApp[];
  onLaunchApp: (appId: string) => void;
  className?: string;
}

/** Android-style launcher grid — scrollable app tiles above the nav bar. */
export function AndroidHomeScreen({ apps, onLaunchApp, className }: AndroidHomeScreenProps) {
  return (
    <div className={cx(styles.screen, className)}>
      <div className={styles.searchRow}>
        <Icon name="search" size={16} />
        <span>Search apps</span>
      </div>
      <ul className={styles.grid}>
        {apps.map((app) => (
          <li key={app.id}>
            <button type="button" className={styles.tile} onClick={() => onLaunchApp(app.id)}>
              <span className={cx(styles.icon, TONE_CLASS[app.tone ?? "neutral"])}>
                <Icon name={app.icon} size={22} />
              </span>
              <span className={styles.label}>{app.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
