import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { Card } from "../Card";
import { Divider } from "../Divider";
import styles from "./RouteCard.module.css";

export interface RouteStop {
  label: ReactNode;
  address: ReactNode;
}

export interface RouteCardProps {
  pickup: RouteStop;
  dropoff: RouteStop;
  className?: string;
}

/**
 * A pickup/drop-off card with a vertical route rail — common in ride-hailing
 * and delivery tracking flows.
 */
export function RouteCard({ pickup, dropoff, className }: RouteCardProps) {
  return (
    <Card padding="lg" className={cx(styles.card, className)}>
      <div className={styles.content}>
        <div className={styles.stops}>
          <div className={styles.stop}>
            <div className={styles.stopLabel}>{pickup.label}</div>
            <div className={styles.stopAddress}>{pickup.address}</div>
          </div>
          <Divider className={styles.divider} />
          <div className={styles.stop}>
            <div className={styles.stopLabel}>{dropoff.label}</div>
            <div className={styles.stopAddress}>{dropoff.address}</div>
          </div>
        </div>

        <div className={styles.rail} aria-hidden="true">
          <span className={cx(styles.railDot, styles.railDotPickup)}>
            <Icon name="chevron-down" size={12} />
          </span>
          <span className={styles.railLine} />
          <span className={cx(styles.railDot, styles.railDotDropoff)}>
            <Icon name="dot" size={10} />
          </span>
        </div>
      </div>
    </Card>
  );
}
