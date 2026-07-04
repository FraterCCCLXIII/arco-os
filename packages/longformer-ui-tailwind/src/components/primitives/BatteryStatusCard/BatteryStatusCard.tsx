import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { Card } from "../Card";
import styles from "./BatteryStatusCard.tailwind";

export interface BatteryStatusCardProps {
  percent: ReactNode;
  powerMode?: ReactNode;
  timeRemaining?: ReactNode;
  tone?: "success" | "accent" | "warning";
  className?: string;
}

/** Battery snapshot — gradient hero readout plus power mode and remaining runtime. */
export function BatteryStatusCard({
  percent,
  powerMode,
  timeRemaining,
  tone = "success",
  className,
}: BatteryStatusCardProps) {
  return (
    <Card padding="none" className={cx(styles.card, className)}>
      <div className={cx(styles.hero, styles[`hero-${tone}`])}>
        <Icon name="battery" size={18} />
        <span className={styles.percent}>{percent}</span>
      </div>
      <div className={styles.body}>
        {powerMode && (
          <div className={styles.row}>
            <span className={styles.label}>Power mode</span>
            <span className={styles.value}>{powerMode}</span>
          </div>
        )}
        {timeRemaining && (
          <div className={styles.row}>
            <span className={styles.label}>Remaining</span>
            <span className={styles.value}>{timeRemaining}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
