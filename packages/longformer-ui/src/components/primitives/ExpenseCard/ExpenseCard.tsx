import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Avatar } from "../Avatar";
import { Icon, type IconName } from "../../../icons";
import styles from "./ExpenseCard.module.css";

export type ExpenseCardTone = "success" | "warning" | "accent" | "danger" | "neutral";

export interface ExpenseCardProps {
  tone?: ExpenseCardTone;
  category: ReactNode;
  merchant: ReactNode;
  amount: ReactNode;
  avatarName?: string;
  icon?: IconName;
  className?: string;
}

/** A colorful expense row with brand icon, category, merchant, and amount. */
export function ExpenseCard({
  tone = "success",
  category,
  merchant,
  amount,
  avatarName,
  icon,
  className,
}: ExpenseCardProps) {
  return (
    <div className={cx(styles.card, styles[tone], className)}>
      <div className={styles.iconWrap}>
        {avatarName ? (
          <Avatar name={avatarName} size="md" />
        ) : icon ? (
          <span className={styles.iconTile}>
            <Icon name={icon} size={16} />
          </span>
        ) : null}
      </div>

      <div className={styles.body}>
        <div className={styles.category}>{category}</div>
        <div className={styles.footer}>
          <div className={styles.merchant}>{merchant}</div>
          <div className={styles.amount}>{amount}</div>
        </div>
      </div>
    </div>
  );
}
