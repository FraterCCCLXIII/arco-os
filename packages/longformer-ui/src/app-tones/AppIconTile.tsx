import { cx } from "../utils/cx";
import { Icon, type IconName } from "../icons";
import type { BadgeTone } from "../components/primitives/Badge";
import {
  badgeToneToHue,
  resolveAppIconHue,
  type AppIconHue,
} from "./app-tones";
import styles from "./app-icon-tile.module.css";

export type AppIconTileSize = "xs" | "sm" | "md" | "lg" | "xl" | "dock" | "dockMac" | "taskbar";

export interface AppIconTileProps {
  icon: IconName;
  appId?: string;
  hue?: AppIconHue;
  /** Legacy semantic tone — used when `appId` / `hue` are not provided. */
  tone?: BadgeTone;
  size?: AppIconTileSize;
  className?: string;
}

const HUE_CLASS: Record<AppIconHue, string> = {
  blue: styles.hueBlue,
  indigo: styles.hueIndigo,
  violet: styles.hueViolet,
  purple: styles.huePurple,
  teal: styles.hueTeal,
  green: styles.hueGreen,
  lime: styles.hueLime,
  amber: styles.hueAmber,
  orange: styles.hueOrange,
  rose: styles.hueRose,
  cyan: styles.hueCyan,
  sky: styles.hueSky,
  gold: styles.hueGold,
  emerald: styles.hueEmerald,
  slate: styles.hueSlate,
  graphite: styles.hueGraphite,
};

const LIGHT_HUES = new Set<AppIconHue>(["amber", "orange", "gold", "lime"]);

const ICON_SIZE: Record<AppIconTileSize, number> = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 22,
  xl: 26,
  dock: 18,
  dockMac: 22,
  taskbar: 14,
};

function resolveHue(appId: string | undefined, hue: AppIconHue | undefined, tone: BadgeTone | undefined): AppIconHue {
  if (hue) return hue;
  if (appId) return resolveAppIconHue(appId);
  if (tone) return badgeToneToHue(tone);
  return "blue";
}

/** Shared gradient tile used by nav rail, desktop, dock, and launcher grids. */
export function AppIconTile({
  icon,
  appId,
  hue,
  tone,
  size = "md",
  className,
}: AppIconTileProps) {
  const resolvedHue = resolveHue(appId, hue, tone);

  return (
    <span
      className={cx(
        styles.tile,
        styles[size],
        HUE_CLASS[resolvedHue],
        LIGHT_HUES.has(resolvedHue) && styles.tileLight,
        className,
      )}
      aria-hidden="true"
    >
      <Icon name={icon} size={ICON_SIZE[size]} strokeWidth={1.85} />
    </span>
  );
}

export function appIconHueClass(hue: AppIconHue, className?: string) {
  return cx(styles.tile, HUE_CLASS[hue], LIGHT_HUES.has(hue) && styles.tileLight, className);
}
