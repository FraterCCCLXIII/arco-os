import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon, type IconName } from "../../../icons";
import { Button } from "../Button";
import styles from "./MediaCard.tailwind";

export type MediaCardTone = "accent" | "success" | "warning";

export interface MediaCardBadge {
  icon?: IconName;
  label: ReactNode;
}

export interface MediaCardProps {
  /** Photo to fill the card. Omit to fall back to a themed gradient. */
  image?: string;
  imageAlt?: string;
  /** Gradient tone used when no `image` is supplied. */
  tone?: MediaCardTone;
  title: ReactNode;
  description?: ReactNode;
  /** Small glass pills over the photo, e.g. a rating or a duration. */
  badges?: MediaCardBadge[];
  actionLabel?: ReactNode;
  onAction?: () => void;
  className?: string;
}

/**
 * A full-bleed photo card with a bottom scrim, e.g. a listing, destination,
 * or property preview. Built for a 3:4 image with legible text over any
 * photo, so it always caps out at two lines of copy plus one action.
 */
export function MediaCard({
  image,
  imageAlt = "",
  tone = "accent",
  title,
  description,
  badges,
  actionLabel,
  onAction,
  className,
}: MediaCardProps) {
  return (
    <div className={cx(styles.card, className)}>
      {image ? (
        <img className={styles.image} src={image} alt={imageAlt} />
      ) : (
        <div className={cx(styles.placeholder, styles[tone])} aria-hidden="true" />
      )}
      <div className={styles.scrim} aria-hidden="true" />
      <div className={styles.content}>
        {badges && badges.length > 0 && (
          <div className={styles.badges}>
            {badges.map((badge, index) => (
              <span key={index} className={styles.badge}>
                {badge.icon && <Icon name={badge.icon} size={12} />}
                {badge.label}
              </span>
            ))}
          </div>
        )}
        <div className={styles.title}>{title}</div>
        {description && <div className={styles.description}>{description}</div>}
        {actionLabel && (
          <Button variant="primary" fullWidth className={styles.action} onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
