import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon, type IconName } from "../../../icons";
import styles from "./ComposerNotice.module.css";

export type ComposerNoticeTone = "neutral" | "info" | "success" | "warning" | "danger";

export interface ComposerNoticeProps {
  children: ReactNode;
  tone?: ComposerNoticeTone;
  icon?: IconName;
  /** Inline text action, e.g. "Upgrade Plan". */
  actionLabel?: ReactNode;
  onAction?: () => void;
  /** When provided, renders a dismiss button. */
  onDismiss?: () => void;
  className?: string;
}

const TONE_CLASS: Record<ComposerNoticeTone, string | undefined> = {
  neutral: undefined,
  info: styles.toneInfo,
  success: styles.toneSuccess,
  warning: styles.toneWarning,
  danger: styles.toneDanger,
};

/**
 * Thin notification banner that docks to the bottom edge of the `Composer`
 * input surface — plan/usage upsells, context warnings, connection status.
 *
 * The top edge is intentionally square and padded so the composer card can
 * overlap it by one corner radius (see `Composer`'s notice slot).
 */
export function ComposerNotice({
  children,
  tone = "neutral",
  icon,
  actionLabel,
  onAction,
  onDismiss,
  className,
}: ComposerNoticeProps) {
  return (
    <div role="status" className={cx(styles.notice, TONE_CLASS[tone], className)}>
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          <Icon name={icon} size={14} />
        </span>
      )}
      <span className={styles.message}>{children}</span>
      {actionLabel && (
        <button type="button" className={cx("lf-focusable", styles.action)} onClick={onAction}>
          {actionLabel}
        </button>
      )}
      {onDismiss && (
        <button
          type="button"
          className={cx("lf-focusable", styles.dismiss)}
          aria-label="Dismiss notification"
          onClick={onDismiss}
        >
          <Icon name="close" size={14} />
        </button>
      )}
    </div>
  );
}
