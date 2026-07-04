import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cx } from "../../../utils/cx";
import { getPortalContainer } from "../../../utils/getPortalContainer";
import { Icon } from "../../../icons";
import styles from "./UsagePopover.tailwind";

export interface UsageStats {
  /** Context used, in thousands of tokens (e.g. 596.3). */
  contextUsedK: number;
  /** Context limit, in thousands of tokens (e.g. 200). */
  contextLimitK: number;
  /** 5-hour plan usage, 0–100. */
  fiveHourPercent: number;
  /** Weekly plan usage across all models, 0–100. */
  weeklyPercent: number;
}

export interface UsagePopoverProps {
  stats: UsageStats;
  onPlanUsageClick?: () => void;
  className?: string;
}

function formatTokensK(value: number): string {
  return `${value.toFixed(1)}k`;
}

function contextPercent(usedK: number, limitK: number): number {
  if (limitK <= 0) return 0;
  return Math.round((usedK / limitK) * 100);
}

function dotTone(percent: number): "normal" | "warning" | "danger" {
  if (percent >= 100) return "danger";
  if (percent >= 80) return "warning";
  return "normal";
}

function usageLabel(percent: number): string {
  if (percent >= 100) return "Context over limit";
  return `${percent}% context`;
}

function getPanelPosition(trigger: HTMLButtonElement | null) {
  const rect = trigger?.getBoundingClientRect();
  if (!rect) return undefined;
  return {
    bottom: window.innerHeight - rect.top + 8,
    right: window.innerWidth - rect.right,
  };
}

/** Usage indicator + popover — context window meter and plan limits. */
export function UsagePopover({ stats, onPlanUsageClick, className }: UsagePopoverProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [panelStyle, setPanelStyle] = useState<{ bottom: number; right: number }>();
  const percent = contextPercent(stats.contextUsedK, stats.contextLimitK);
  const overLimit = percent >= 100;
  const fillWidth = Math.min(100, percent);
  const tone = dotTone(percent);
  const label = usageLabel(percent);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (wrapperRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!open) {
      setPanelStyle(undefined);
      return;
    }

    function updatePosition() {
      setPanelStyle(getPanelPosition(triggerRef.current));
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  function handleToggle() {
    setOpen((value) => !value);
  }

  const resolvedPanelStyle = open ? panelStyle ?? getPanelPosition(triggerRef.current) : undefined;

  const panel =
    open && resolvedPanelStyle ? (
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Usage"
        className={styles.panel}
        style={{ bottom: resolvedPanelStyle.bottom, right: resolvedPanelStyle.right }}
      >
        <div className={styles.section}>
          <div className={styles.row}>
            <span className={styles.label}>Context window</span>
            <span className={styles.value}>
              {formatTokensK(stats.contextUsedK)} / {formatTokensK(stats.contextLimitK)} ({percent}%)
              <Icon name="chevron-right" size={12} />
            </span>
          </div>
          <div className={styles.progressTrack} aria-hidden="true">
            <div
              className={cx(styles.progressFill, overLimit && styles.progressFillOver)}
              style={{ width: `${fillWidth}%` }}
            />
          </div>
        </div>

        <div className={styles.divider} role="separator" />

        <div className={styles.section}>
          <button type="button" className={styles.planUsageButton} onClick={onPlanUsageClick}>
            <span className={styles.label}>Plan usage</span>
            <Icon name="arrow-up-right" size={14} className={styles.planUsageIcon} />
          </button>

          <div className={styles.usageRows}>
            <div className={styles.row}>
              <span className={styles.label}>5-hour limit</span>
              <span className={styles.valueMuted}>{stats.fiveHourPercent}%</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Weekly · all models</span>
              <span className={styles.valueMuted}>{stats.weeklyPercent}%</span>
            </div>
          </div>
        </div>
      </div>
    ) : null;

  return (
    <div className={cx(styles.wrapper, className)} ref={wrapperRef}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-label={`View usage: ${label}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={handleToggle}
      >
        <span
          className={cx(
            styles.triggerDot,
            tone === "warning" && styles.triggerDotWarning,
            tone === "danger" && styles.triggerDotDanger,
          )}
          aria-hidden="true"
        />
        <span
          className={cx(
            styles.triggerLabel,
            tone === "warning" && styles.triggerLabelWarning,
            tone === "danger" && styles.triggerLabelDanger,
          )}
        >
          {label}
        </span>
      </button>

      {panel && createPortal(panel, getPortalContainer())}
    </div>
  );
}
