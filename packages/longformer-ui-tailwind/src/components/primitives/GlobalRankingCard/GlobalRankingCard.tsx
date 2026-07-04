import { cx } from "../../../utils/cx";
import { Avatar } from "../Avatar";
import { Card } from "../Card";
import { MetricTrendHeader } from "../MetricTrendHeader";
import styles from "./GlobalRankingCard.tailwind";

export interface RankingEntry {
  name: string;
  avatarName?: string;
}

export interface GlobalRankingCardProps {
  title?: string;
  value: string;
  sectionLabel?: string;
  entries: RankingEntry[];
  className?: string;
}

/** Leaderboard snippet — global rank headline and a short local top list. */
export function GlobalRankingCard({
  title = "Global Ranking",
  value,
  sectionLabel = "Top local rank",
  entries,
  className,
}: GlobalRankingCardProps) {
  return (
    <Card padding="lg" className={cx(styles.card, className)}>
      <MetricTrendHeader title={title} value={value} />
      <div className={styles.sectionLabel}>{sectionLabel}</div>
      <ul className={styles.list}>
        {entries.map((entry) => (
          <li key={entry.name} className={styles.item}>
            <Avatar name={entry.avatarName ?? entry.name} size="sm" />
            <span>{entry.name}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
