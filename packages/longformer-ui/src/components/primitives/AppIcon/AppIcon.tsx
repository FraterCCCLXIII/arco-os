import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { AppIconTile } from "../../../app-tones/AppIconTile";
import type { AppIconHue } from "../../../app-tones/app-tones";
import type { IconName } from "../../../icons";
import { CountBadge, type BadgeTone } from "../Badge";
import { Tooltip } from "../Tooltip";
import styles from "./AppIcon.module.css";

export type AppIconSize = "sm" | "md" | "lg";

export interface AppIconProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Glyph to draw when no `image` is supplied. */
  icon?: IconName;
  /** Stable app id — resolves the canonical launcher hue when set. */
  appId?: string;
  /** Fully custom glyph (emoji, initials, inline svg) — takes precedence over `icon`. */
  glyph?: ReactNode;
  /** Photo/artwork to fill the tile, e.g. a favicon or app screenshot. */
  image?: string;
  /** Visible caption. Also used as the accessible name when no `aria-label` is given. */
  label?: string;
  /** Render the caption under the tile (launcher grids) or hide it (rely on the tooltip). */
  labelPlacement?: "below" | "none";
  size?: AppIconSize;
  tone?: BadgeTone;
  hue?: AppIconHue;
  /** Small dot under the tile, e.g. "this app is running". */
  running?: boolean;
  /** Overlay count badge, e.g. unread notifications. */
  badgeCount?: number;
  /** Selected/highlighted state. */
  active?: boolean;
}

const TILE_SIZE: Record<AppIconSize, "sm" | "md" | "xl"> = {
  sm: "sm",
  md: "md",
  lg: "xl",
};

/**
 * The single tile primitive shared by every "grid of apps" surface — app
 * launcher grids, marketplace listings, etc. Visual variants (image vs.
 * glyph vs. tone gradient) all resolve to the same interactive, accessible
 * button shape.
 */
export const AppIcon = forwardRef<HTMLButtonElement, AppIconProps>(function AppIcon(
  {
    icon,
    appId,
    glyph,
    image,
    label,
    labelPlacement = "none",
    size = "md",
    tone = "accent",
    hue,
    running = false,
    badgeCount,
    active = false,
    className,
    ...rest
  },
  ref
) {
  const button = (
    <button
      ref={ref}
      type="button"
      className={cx("lf-focusable", styles.tile, styles[size], active && styles.active, className)}
      aria-label={rest["aria-label"] ?? label}
      {...rest}
    >
      {image ? (
        <img className={styles.image} src={image} alt="" />
      ) : glyph ? (
        <span className={styles.glyph}>{glyph}</span>
      ) : icon ? (
        <AppIconTile
          appId={appId}
          icon={icon}
          hue={hue}
          tone={!appId && !hue ? tone : undefined}
          size={TILE_SIZE[size]}
          className={styles.iconTile}
        />
      ) : null}
      {typeof badgeCount === "number" && <CountBadge count={badgeCount} className={styles.badge} />}
    </button>
  );

  return (
    <span className={cx(styles.wrapper, styles[size])}>
      {label && labelPlacement === "none" ? <Tooltip label={label}>{button}</Tooltip> : button}
      {running && <span className={styles.runningDot} aria-hidden="true" />}
      {label && labelPlacement === "below" && <span className={styles.caption}>{label}</span>}
    </span>
  );
});
