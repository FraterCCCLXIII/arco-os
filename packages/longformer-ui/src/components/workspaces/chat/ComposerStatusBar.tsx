import { cx } from "../../../utils/cx";
import { UsagePopover, type UsageStats } from "./UsagePopover";
import styles from "./ComposerStatusBar.module.css";

export interface ComposerStatusBarProps {
  model?: string;
  thinkingLevel?: string;
  usage: UsageStats;
  onPlanUsageClick?: () => void;
  className?: string;
}

/** Thin footer row under the composer — model, thinking mode, and usage popover. */
export function ComposerStatusBar({
  model,
  thinkingLevel,
  usage,
  onPlanUsageClick,
  className,
}: ComposerStatusBarProps) {
  return (
    <div className={cx(styles.bar, className)}>
      <div className={styles.left}>
        {model && <span className={styles.model}>{model}</span>}
        {thinkingLevel && <span className={styles.thinking}>{thinkingLevel}</span>}
      </div>
      <div className={styles.right}>
        <UsagePopover stats={usage} onPlanUsageClick={onPlanUsageClick} />
      </div>
    </div>
  );
}
