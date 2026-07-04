import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon, type IconName } from "../../../icons";
import { Avatar } from "../Avatar";
import { Card } from "../Card";
import { Divider } from "../Divider";
import styles from "./ProfileSummaryCard.tailwind";

export interface ProfileSummaryRow {
  icon?: IconName;
  title: ReactNode;
  subtitle?: ReactNode;
  trailing?: ReactNode;
  trailingMeta?: ReactNode;
}

export interface ProfileSummaryCardProps {
  avatarName?: string;
  avatarSrc?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  rating?: ReactNode;
  rows?: ProfileSummaryRow[];
  className?: string;
}

/**
 * A two-tier identity card — primary person/entity up top, optional detail
 * rows below a divider, e.g. a driver profile plus vehicle info.
 */
export function ProfileSummaryCard({
  avatarName,
  avatarSrc,
  title,
  subtitle,
  rating,
  rows,
  className,
}: ProfileSummaryCardProps) {
  return (
    <Card padding="lg" className={cx(styles.card, className)}>
      <div className={styles.primary}>
        {avatarName && <Avatar name={avatarName} src={avatarSrc} size="lg" />}
        <div className={styles.primaryBody}>
          <div className={styles.title}>{title}</div>
          {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        </div>
        {rating && (
          <div className={styles.rating}>
            <Icon name="star" size={12} />
            {rating}
          </div>
        )}
      </div>

      {rows && rows.length > 0 && (
        <>
          <Divider className={styles.divider} />
          {rows.map((row, index) => (
            <div key={index} className={styles.row}>
              {row.icon && (
                <span className={styles.rowIcon}>
                  <Icon name={row.icon} size={16} />
                </span>
              )}
              <div className={styles.rowBody}>
                <div className={styles.rowTitle}>{row.title}</div>
                {row.subtitle && <div className={styles.rowSubtitle}>{row.subtitle}</div>}
              </div>
              {(row.trailing || row.trailingMeta) && (
                <div className={styles.rowTrailing}>
                  {row.trailing && <div className={styles.rowTrailingValue}>{row.trailing}</div>}
                  {row.trailingMeta && <div className={styles.rowTrailingMeta}>{row.trailingMeta}</div>}
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </Card>
  );
}
