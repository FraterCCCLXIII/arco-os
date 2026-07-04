import { cx } from "../../../utils/cx";
import { AnalyticsCardHeader } from "../AnalyticsCardHeader";
import { Button } from "../Button";
import { Card } from "../Card";
import styles from "./FearGreedCard.tailwind";
import type { IconName } from "../../../icons";

export interface FearGreedCardProps {
  title?: string;
  icon?: IconName;
  score: number;
  label: string;
  caption?: string;
  leftPercent: number;
  rightPercent: number;
  actionLabel?: string;
  className?: string;
}

/** Sentiment gauge card — semi-circular index readout and a split opinion bar. */
export function FearGreedCard({
  title = "Fear & Greed index",
  icon = "hash",
  score,
  label,
  caption = "Voted! Join again tomorrow.",
  leftPercent,
  rightPercent,
  actionLabel = "Trade now",
  className,
}: FearGreedCardProps) {
  const needleAngle = -90 + (Math.max(0, Math.min(100, score)) / 100) * 180;

  return (
    <Card padding="lg" className={cx(styles.card, className)}>
      <AnalyticsCardHeader
        title={title}
        icon={icon}
        action={
          <Button variant="secondary" size="sm">
            {actionLabel}
          </Button>
        }
      />
      <div className={styles.gaugeWrap}>
        <svg className={styles.gauge} viewBox="0 0 200 110" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((segment) => (
            <path
              key={segment}
              d={`M20 95 A 80 80 0 0 1 ${20 + segment * 40} ${segment === 0 ? 35 : segment === 4 ? 35 : 20}`}
              className={cx(styles.segment, styles[`segment-${segment}`])}
              transform={`rotate(${-90 + segment * 36} 100 95)`}
            />
          ))}
          <g transform={`rotate(${needleAngle} 100 95)`}>
            <polygon points="100,95 94,58 106,58" className={styles.needle} />
          </g>
        </svg>
        <div className={styles.gaugeCenter}>
          <div className={styles.score}>{score}</div>
          <div className={styles.sentiment}>{label}</div>
        </div>
      </div>
      {caption && <div className={styles.caption}>{caption}</div>}
      <div className={styles.splitBar}>
        <span className={styles.splitLeft} style={{ width: `${leftPercent}%` }}>
          {leftPercent}%
        </span>
        <span className={styles.splitRight} style={{ width: `${rightPercent}%` }}>
          {rightPercent}%
        </span>
      </div>
    </Card>
  );
}
