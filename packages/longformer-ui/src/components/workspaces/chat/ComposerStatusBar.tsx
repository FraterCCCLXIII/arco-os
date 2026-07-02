import { cx } from "../../../utils/cx";
import { UsagePopover, type UsageStats } from "./UsagePopover";
import styles from "./ComposerStatusBar.module.css";

export interface ComposerStatusBarProps {
  usage: UsageStats;
  onPlanUsageClick?: () => void;
  className?: string;
}

/** Thin footer row under the composer with the usage indicator and popover. */
export function ComposerStatusBar({
  usage,
  onPlanUsageClick,
  className,
}: ComposerStatusBarProps) {
  return (
    <div className={cx(styles.bar, className)}>
      <UsagePopover stats={usage} onPlanUsageClick={onPlanUsageClick} />
    </div>
  );
}
