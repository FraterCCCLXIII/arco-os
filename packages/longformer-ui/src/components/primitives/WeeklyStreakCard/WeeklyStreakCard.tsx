import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { Card } from "../Card";
import { MetricTrendHeader } from "../MetricTrendHeader";
import styles from "./WeeklyStreakCard.module.css";

export interface StreakDay {
  label: string;
  completed?: boolean;
}

export interface WeeklyStreakCardProps {
  title?: string;
  value: string;
  longestLabel?: string;
  longestValue?: string;
  days: StreakDay[];
  className?: string;
}

/** Weekly streak tracker — numbered day chips in completed and pending states. */
export function WeeklyStreakCard({
  title = "Weekly Streak",
  value,
  longestLabel = "Longest Streak",
  longestValue,
  days,
  className,
}: WeeklyStreakCardProps) {
  const rows = [days.slice(0, 5), days.slice(5, 10)];

  return (
    <Card padding="lg" className={cx(styles.card, className)}>
      <MetricTrendHeader title={title} value={value} />
      {longestValue && (
        <div className={styles.longest}>
          {longestLabel} <strong>{longestValue}</strong>
        </div>
      )}
      <div className={styles.grid}>
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((day) => (
              <span key={day.label} className={cx(styles.day, day.completed ? styles.dayDone : styles.dayPending)}>
                <Icon name="check" size={10} />
                {day.label}
              </span>
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
}
