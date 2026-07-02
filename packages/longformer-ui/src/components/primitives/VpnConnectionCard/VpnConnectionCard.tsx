import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { Card } from "../Card";
import styles from "./VpnConnectionCard.module.css";

export interface VpnConnectionCardProps {
  active?: boolean;
  statusLabel?: ReactNode;
  location?: ReactNode;
  ipAddress?: ReactNode;
  timeConnected?: ReactNode;
  download?: { label: ReactNode; value: ReactNode; chartValues?: number[] };
  upload?: { label: ReactNode; value: ReactNode; chartValues?: number[] };
  className?: string;
}

/** VPN status card — map backdrop, power toggle, connection metadata, and throughput mini-charts. */
export function VpnConnectionCard({
  active = true,
  statusLabel = "On",
  location,
  ipAddress,
  timeConnected,
  download,
  upload,
  className,
}: VpnConnectionCardProps) {
  return (
    <Card padding="none" className={cx(styles.card, className)}>
      <div className={styles.mapArea}>
        <div className={styles.mapGlow} aria-hidden="true" />
        <div className={cx(styles.toggle, active && styles.toggleActive)}>
          <Icon name="lock" size={20} />
          <span>{statusLabel}</span>
        </div>
      </div>

      <div className={styles.details}>
        {location && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Location</span>
            <span className={styles.detailValue}>{location}</span>
          </div>
        )}
        {ipAddress && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>IP Address</span>
            <span className={styles.detailValue}>{ipAddress}</span>
          </div>
        )}
        {timeConnected && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Time Connected</span>
            <span className={styles.detailValue}>{timeConnected}</span>
          </div>
        )}
      </div>

      {(download || upload) && (
        <div className={styles.speedGrid}>
          {download && <SpeedTile label={download.label} value={download.value} chartValues={download.chartValues} tone="accent" />}
          {upload && <SpeedTile label={upload.label} value={upload.value} chartValues={upload.chartValues} tone="success" />}
        </div>
      )}
    </Card>
  );
}

function SpeedTile({
  label,
  value,
  chartValues,
  tone,
}: {
  label: ReactNode;
  value: ReactNode;
  chartValues?: number[];
  tone: "accent" | "success";
}) {
  return (
    <div className={cx(styles.speedTile, styles[`speed-${tone}`])}>
      <div className={styles.speedLabel}>{label}</div>
      <div className={styles.speedValue}>{value}</div>
      {chartValues && chartValues.length > 0 && (
        <svg className={styles.speedChart} viewBox="0 0 80 24" preserveAspectRatio="none" aria-hidden="true">
          <polyline
            className={styles.speedLine}
            points={chartValues
              .map((v, i) => {
                const max = Math.max(...chartValues, 1);
                const x = (i / Math.max(chartValues.length - 1, 1)) * 80;
                const y = 24 - (v / max) * 20 - 2;
                return `${x},${y}`;
              })
              .join(" ")}
            fill="none"
          />
        </svg>
      )}
    </div>
  );
}
