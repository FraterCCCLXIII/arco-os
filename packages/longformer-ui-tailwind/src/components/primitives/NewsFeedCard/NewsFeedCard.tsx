import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { Card } from "../Card";
import styles from "./NewsFeedCard.tailwind";

export interface NewsFeedStat {
  icon?: import("../../../icons").IconName;
  label: ReactNode;
}

export interface NewsFeedCardProps {
  source?: ReactNode;
  headline: ReactNode;
  excerpt?: ReactNode;
  imageTone?: "accent" | "neutral" | "warning";
  stats?: NewsFeedStat[];
  className?: string;
}

/** News preview card — hero image band, source tag, headline, and engagement stats. */
export function NewsFeedCard({
  source,
  headline,
  excerpt,
  imageTone = "neutral",
  stats,
  className,
}: NewsFeedCardProps) {
  return (
    <Card padding="none" className={cx(styles.card, className)}>
      <div className={cx(styles.hero, styles[`hero-${imageTone}`])} aria-hidden="true" />
      <div className={styles.body}>
        {source && <div className={styles.source}>{source}</div>}
        <div className={styles.headline}>{headline}</div>
        {excerpt && <div className={styles.excerpt}>{excerpt}</div>}
        {stats && stats.length > 0 && (
          <div className={styles.stats}>
            {stats.map((stat, index) => (
              <span key={index} className={styles.stat}>
                {stat.icon && <Icon name={stat.icon} size={12} />}
                {stat.label}
              </span>
            ))}
            <span className={styles.nav}>
              <Icon name="chevron-left" size={14} />
              <Icon name="chevron-right" size={14} />
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
