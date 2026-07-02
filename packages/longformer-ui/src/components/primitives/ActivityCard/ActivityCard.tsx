import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon, type IconName } from "../../../icons";
import { Avatar } from "../Avatar";
import { Badge, type BadgeTone } from "../Badge";
import { Card } from "../Card";
import styles from "./ActivityCard.module.css";

export type ActivityStatusTone = "success" | "warning" | "danger";

export interface ActivityCardProps {
  icon?: IconName;
  avatarName?: string;
  avatarSrc?: string;
  title: ReactNode;
  status: { label: ReactNode; tone: ActivityStatusTone };
  category?: ReactNode;
  amount: ReactNode;
  time: ReactNode;
  className?: string;
}

const statusIcons: Record<ActivityStatusTone, IconName> = {
  success: "check",
  warning: "loader",
  danger: "close",
};

const statusBadgeTone: Record<ActivityStatusTone, BadgeTone> = {
  success: "success",
  warning: "warning",
  danger: "danger",
};

/**
 * A compact activity row for feeds like transaction history — leading identity,
 * a status pill, and amount/time on the trailing edge.
 */
export function ActivityCard({
  icon,
  avatarName,
  avatarSrc,
  title,
  status,
  category,
  amount,
  time,
  className,
}: ActivityCardProps) {
  return (
    <Card padding="md" className={cx(styles.card, className)}>
      <div className={styles.leading}>
        {avatarName ? (
          <Avatar name={avatarName} src={avatarSrc} size="md" />
        ) : icon ? (
          <span className={styles.iconTile}>
            <Icon name={icon} size={16} />
          </span>
        ) : null}
      </div>

      <div className={styles.body}>
        <div className={styles.title}>{title}</div>
        <div className={styles.meta}>
          <Badge tone={statusBadgeTone[status.tone]} className={styles.statusBadge}>
            <Icon name={statusIcons[status.tone]} size={10} />
            {status.label}
          </Badge>
          {category && <span className={styles.category}>{category}</span>}
        </div>
      </div>

      <div className={styles.trailing}>
        <div className={styles.amount}>{amount}</div>
        <div className={styles.time}>{time}</div>
      </div>
    </Card>
  );
}
