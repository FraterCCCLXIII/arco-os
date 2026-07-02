import { cx } from "../../../utils/cx";
import { Card } from "../Card";
import { MetricTrendHeader } from "../MetricTrendHeader";
import styles from "./QuizScoreCard.module.css";

export interface QuizScoreCardProps {
  title?: string;
  value: string;
  change?: string;
  changeDirection?: "up" | "down";
  highestLabel?: string;
  highestValue?: string;
  lowestLabel?: string;
  lowestValue?: string;
  highestProgress?: number;
  lowestProgress?: number;
  className?: string;
}

/** Quiz performance summary — score range rows and dual horizontal progress bars. */
export function QuizScoreCard({
  title = "Avg Quiz Score",
  value,
  change,
  changeDirection = "down",
  highestLabel = "Highest Score",
  highestValue,
  lowestLabel = "Lowest Score",
  lowestValue,
  highestProgress = 92,
  lowestProgress = 64,
  className,
}: QuizScoreCardProps) {
  return (
    <Card padding="lg" className={cx(styles.card, className)}>
      <MetricTrendHeader title={title} value={value} change={change} changeDirection={changeDirection} />
      <div className={styles.rows}>
        {highestValue && (
          <div className={styles.row}>
            <span className={styles.rowLabel}>
              {highestLabel} <strong>{highestValue}</strong>
            </span>
            <div className={styles.track}>
              <span className={styles.fillBlue} style={{ width: `${highestProgress}%` }} />
            </div>
          </div>
        )}
        {lowestValue && (
          <div className={styles.row}>
            <span className={styles.rowLabel}>
              {lowestLabel} <strong>{lowestValue}</strong>
            </span>
            <div className={styles.track}>
              <span className={cx(styles.fillOrange, styles.striped)} style={{ width: `${lowestProgress}%` }} />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
