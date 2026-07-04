import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon, type IconName } from "../../../icons";
import { Avatar } from "../Avatar";
import { Button } from "../Button";
import { Card } from "../Card";
import { Chip } from "../Chip";
import { Divider } from "../Divider";
import styles from "./ListingCard.tailwind";

export interface ListingCardProps {
  /** Leading tile icon, e.g. for a plot, app, or category. Ignored if `avatarName` is set. */
  icon?: IconName;
  /** Renders an `Avatar` instead of an icon tile, e.g. for a company or person. */
  avatarName?: string;
  avatarSrc?: string;
  title: ReactNode;
  /** Small line above the title, e.g. a company name and a relative time. */
  subtitle?: ReactNode;
  tags?: string[];
  price?: ReactNode;
  priceMeta?: ReactNode;
  actionLabel?: ReactNode;
  onAction?: () => void;
  saved?: boolean;
  onToggleSave?: () => void;
  className?: string;
}

/**
 * A bordered listing row for things people browse and act on one at a time —
 * a job posting, a marketplace item, a search result. Leading identity up
 * top, a save toggle, then a price/action footer below a divider.
 */
export function ListingCard({
  icon,
  avatarName,
  avatarSrc,
  title,
  subtitle,
  tags,
  price,
  priceMeta,
  actionLabel,
  onAction,
  saved = false,
  onToggleSave,
  className,
}: ListingCardProps) {
  return (
    <Card padding="lg" className={cx(styles.card, className)}>
      <div className={styles.head}>
        {avatarName ? (
          <Avatar name={avatarName} src={avatarSrc} size="lg" />
        ) : icon ? (
          <span className={styles.iconTile}>
            <Icon name={icon} size={18} />
          </span>
        ) : (
          <span />
        )}
        {onToggleSave && (
          <Chip icon="bookmark" active={saved} onClick={onToggleSave}>
            {saved ? "Saved" : "Save"}
          </Chip>
        )}
      </div>

      {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      <div className={styles.title}>{title}</div>

      {tags && tags.length > 0 && (
        <div className={styles.tags}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {(price || actionLabel) && (
        <>
          <Divider className={styles.divider} />
          <div className={styles.footer}>
            <div className={styles.priceBlock}>
              {price && <span className={styles.price}>{price}</span>}
              {priceMeta && <span className={styles.priceMeta}>{priceMeta}</span>}
            </div>
            {actionLabel && (
              <Button size="sm" variant="primary" onClick={onAction}>
                {actionLabel}
              </Button>
            )}
          </div>
        </>
      )}
    </Card>
  );
}
