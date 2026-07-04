import { cx } from "../utils/cx";
import { Icon, type IconName } from "../icons";
import type { BadgeTone } from "../components/primitives/Badge";
import {
  badgeToneToHue,
  resolveAppIconHue,
  type AppIconHue,
} from "./app-tones";
import styles from "./app-icon-tile.tailwind";

export type AppIconTileSize = "xs" | "sm" | "md" | "lg" | "xl" | "dock" | "dockMac" | "taskbar";

export type AppIconTileSurface = "gradient" | "solid";

export interface AppIconTileProps {
  icon: IconName;
  appId?: string;
  hue?: AppIconHue;
  /** Legacy semantic tone — used when `appId` / `hue` are not provided. */
  tone?: BadgeTone;
  /** Flat vibrant fill with shared shadow tokens; use `gradient` for legacy two-stop fills. */
  surface?: AppIconTileSurface;
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

/** Shared app icon tile used by desktop, dock, tray, and launcher grids. */
export function AppIconTile({
  icon,
  appId,
  hue,
  tone,
  surface = "solid",
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
        surface === "gradient" && styles.tileGradient,
        LIGHT_HUES.has(resolvedHue) && styles.tileLight,
        className,
      )}
      aria-hidden="true"
    >
      <Icon name={icon} size={ICON_SIZE[size]} strokeWidth={1.85} />
    </span>
  );
}

export function appIconHueClass(hue: AppIconHue, className?: string, surface: AppIconTileSurface = "solid") {
  return cx(
    styles.tile,
    HUE_CLASS[hue],
    surface === "gradient" && styles.tileGradient,
    LIGHT_HUES.has(hue) && styles.tileLight,
    className,
  );
}
