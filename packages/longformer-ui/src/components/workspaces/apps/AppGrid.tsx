import { AppIcon } from "../../primitives/AppIcon";
import type { AppListing } from "./types";
import styles from "./AppGrid.module.css";

export interface AppGridProps {
  apps: AppListing[];
  runningAppIds?: Set<string>;
  onLaunchApp: (appId: string) => void;
}

/** A launcher-style grid of installed apps — click a tile to open it. */
export function AppGrid({ apps, runningAppIds, onLaunchApp }: AppGridProps) {
  return (
    <div className={styles.grid}>
      {apps.map((app) => (
        <AppIcon
          key={app.id}
          icon={app.icon}
          label={app.label}
          labelPlacement="below"
          size="lg"
          tone={app.tone ?? "accent"}
          running={runningAppIds?.has(app.id)}
          onClick={() => onLaunchApp(app.id)}
        />
      ))}
    </div>
  );
}
