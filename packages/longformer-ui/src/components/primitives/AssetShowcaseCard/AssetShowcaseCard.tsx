import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon, type IconName } from "../../../icons";
import { Avatar } from "../Avatar";
import { Button } from "../Button";
import { Card } from "../Card";
import styles from "./AssetShowcaseCard.module.css";

export interface AssetShowcaseStat {
  icon?: IconName;
  label: ReactNode;
}

export interface AssetShowcaseCardProps {
  title: ReactNode;
  description?: ReactNode;
  imageTone?: "accent" | "success" | "warning";
  stats?: AssetShowcaseStat[];
  creatorName?: string;
  creatorMeta?: ReactNode;
  actionLabel?: ReactNode;
  className?: string;
}

/** Asset preview card — hero visual, engagement stats, creator row, and download CTA. */
export function AssetShowcaseCard({
  title,
  description,
  imageTone = "accent",
  stats,
  creatorName,
  creatorMeta,
  actionLabel = "Download",
  className,
}: AssetShowcaseCardProps) {
  return (
    <Card padding="none" className={cx(styles.card, className)}>
      <div className={cx(styles.hero, styles[`hero-${imageTone}`])} aria-hidden="true" />
      <div className={styles.body}>
        <div className={styles.title}>{title}</div>
        {description && <div className={styles.description}>{description}</div>}
        {stats && stats.length > 0 && (
          <div className={styles.stats}>
            {stats.map((stat, index) => (
              <span key={index} className={styles.stat}>
                {stat.icon && <Icon name={stat.icon} size={12} />}
                {stat.label}
              </span>
            ))}
          </div>
        )}
        {(creatorName || actionLabel) && (
          <div className={styles.footer}>
            {creatorName && (
              <div className={styles.creator}>
                <Avatar name={creatorName} size="sm" />
                <div>
                  <div className={styles.creatorName}>{creatorName}</div>
                  {creatorMeta && <div className={styles.creatorMeta}>{creatorMeta}</div>}
                </div>
              </div>
            )}
            {actionLabel && (
              <Button variant="primary" className={styles.action}>
                <Icon name="download" size={14} />
                {actionLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
