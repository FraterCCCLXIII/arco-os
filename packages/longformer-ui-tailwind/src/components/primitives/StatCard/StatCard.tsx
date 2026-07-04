import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon, type IconName } from "../../../icons";
import styles from "./StatCard.tailwind";

export type StatCardTone = "accent" | "success" | "warning" | "danger" | "neutral";

export type StatCardVisualization =
  | { type: "ring"; percent: number }
  | { type: "bars"; values: number[] }
  | { type: "dots"; total: number; filled: number };

export interface StatCardProps {
  icon?: IconName;
  label: ReactNode;
  value: ReactNode;
  /** Small line under the value, e.g. "Healthy". Ignored when the visualization is a ring — it renders under the ring instead. */
  caption?: ReactNode;
  tone?: StatCardTone;
  visualization?: StatCardVisualization;
  className?: string;
}

/**
 * A compact, tone-colored metric tile — a dashboard "vital sign" card. One
 * headline value plus an optional inline visualization (ring, sparkline
 * bars, or a filled dot grid) so the same shape covers a score, a trend, or
 * a streak without three bespoke components.
 */
export function StatCard({ icon, label, value, caption, tone = "accent", visualization, className }: StatCardProps) {
  const isRing = visualization?.type === "ring";

  return (
    <div className={cx(styles.card, styles[tone], className)}>
      <div className={styles.head}>
        {icon && (
          <span className={styles.iconTile}>
            <Icon name={icon} size={14} />
          </span>
        )}
        <span className={styles.label}>{label}</span>
      </div>

      {isRing ? (
        <div className={styles.ringRow}>
          <Ring percent={visualization.percent} value={value} />
          {caption && <span className={styles.caption}>{caption}</span>}
        </div>
      ) : (
        <>
          <div className={styles.value}>{value}</div>
          {caption && <div className={styles.caption}>{caption}</div>}
          {visualization?.type === "bars" && <Bars values={visualization.values} />}
          {visualization?.type === "dots" && <Dots total={visualization.total} filled={visualization.filled} />}
        </>
      )}
    </div>
  );
}

function Ring({ percent, value }: { percent: number; value: ReactNode }) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className={styles.ring}>
      <svg viewBox="0 0 36 36" className={styles.ringSvg} aria-hidden="true">
        <circle className={styles.ringTrack} cx="18" cy="18" r="16" pathLength={100} />
        <circle
          className={styles.ringProgress}
          cx="18"
          cy="18"
          r="16"
          pathLength={100}
          strokeDasharray={`${clamped} 100`}
        />
      </svg>
      <span className={styles.ringValue}>{value}</span>
    </div>
  );
}

function Bars({ values }: { values: number[] }) {
  if (values.length === 0) return null;
  const max = Math.max(...values, 1);
  return (
    <div className={styles.bars} role="img" aria-label="Trend">
      {values.map((raw, index) => (
        <span
          key={index}
          className={styles.bar}
          style={{ height: `${Math.max(8, (raw / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}

function Dots({ total, filled }: { total: number; filled: number }) {
  const count = Math.min(total, 35);
  return (
    <div className={styles.dots} role="img" aria-label={`${filled} of ${total}`}>
      {Array.from({ length: count }, (_, index) => (
        <span key={index} className={cx(styles.dotItem, index < filled && styles.dotFilled)} />
      ))}
    </div>
  );
}
