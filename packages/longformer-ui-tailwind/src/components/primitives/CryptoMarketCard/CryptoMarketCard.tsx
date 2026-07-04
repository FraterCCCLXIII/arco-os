import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Card } from "../Card";
import styles from "./CryptoMarketCard.tailwind";

export type CryptoMarketTone = "accent" | "success" | "warning" | "neutral";

export interface CryptoMarketRow {
  symbol: ReactNode;
  name: ReactNode;
  price: ReactNode;
  changePercent: ReactNode;
  direction?: "up" | "down";
  chartValues?: number[];
  tone?: CryptoMarketTone;
}

export interface CryptoMarketCardProps {
  rows: CryptoMarketRow[];
  className?: string;
}

/** Vertical crypto ticker — symbol tile, price delta, and inline sparkline per row. */
export function CryptoMarketCard({ rows, className }: CryptoMarketCardProps) {
  return (
    <Card padding="lg" className={cx(styles.card, className)}>
      {rows.map((row, index) => (
        <div key={index} className={styles.row}>
          <span className={cx(styles.symbol, row.tone && styles[`tone-${row.tone}`])}>{row.symbol}</span>
          <div className={styles.body}>
            <div className={styles.name}>{row.name}</div>
            <div className={styles.meta}>
              <span className={styles.price}>{row.price}</span>
              <span className={cx(styles.change, row.direction === "down" && styles.changeDown)}>{row.changePercent}</span>
            </div>
          </div>
          {row.chartValues && row.chartValues.length > 0 && (
            <MiniSparkline values={row.chartValues} positive={row.direction !== "down"} />
          )}
        </div>
      ))}
    </Card>
  );
}

function MiniSparkline({ values, positive }: { values: number[]; positive: boolean }) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);
  const width = 64;
  const height = 28;
  const points = values.map((raw, index) => {
    const x = (index / Math.max(values.length - 1, 1)) * width;
    const y = height - ((raw - min) / range) * (height - 6) - 3;
    return `${x},${y}`;
  });

  return (
    <svg
      className={cx(styles.sparkline, positive ? styles.sparklineUp : styles.sparklineDown)}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="Price trend"
    >
      <polyline className={styles.sparklineLine} points={points.join(" ")} fill="none" />
    </svg>
  );
}
