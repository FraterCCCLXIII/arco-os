import { useCallback, useRef, useState, type ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon, type IconName } from "../../../icons";
import styles from "./DeviceCard.tailwind";

export type DeviceCardTone = "success" | "warning" | "accent" | "neutral";

export interface DeviceCardProps {
  title: ReactNode;
  subtitle?: ReactNode;
  status?: ReactNode;
  statusTone?: DeviceCardTone;
  icon: IconName;
  iconTone?: DeviceCardTone;
  /** 0–100 fill amount for the state overlay bar. */
  progress?: number;
  onProgressChange?: (progress: number) => void;
  progressSide?: "left" | "right";
  className?: string;
}

function clampProgress(value: number) {
  return Math.max(0, Math.min(100, value));
}

/**
 * A smart-home device tile with an optional draggable progress fill and a
 * trailing circular device icon.
 */
export function DeviceCard({
  title,
  subtitle,
  status,
  statusTone = "success",
  icon,
  iconTone = "warning",
  progress,
  onProgressChange,
  progressSide = "left",
  className,
}: DeviceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isInteractive = progress !== undefined && onProgressChange !== undefined;
  const clampedProgress = progress !== undefined ? clampProgress(progress) : undefined;

  const progressFromClientX = useCallback(
    (clientX: number) => {
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect?.width) return clampedProgress ?? 0;

      const ratio =
        progressSide === "right"
          ? (rect.right - clientX) / rect.width
          : (clientX - rect.left) / rect.width;

      return clampProgress(Math.round(ratio * 100));
    },
    [clampedProgress, progressSide],
  );

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isInteractive || !onProgressChange) return;

      event.preventDefault();
      const target = event.currentTarget;
      target.setPointerCapture(event.pointerId);
      setIsDragging(true);
      document.body.style.userSelect = "none";
      onProgressChange(progressFromClientX(event.clientX));

      function onPointerMove(ev: PointerEvent) {
        if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
        frameRef.current = requestAnimationFrame(() => {
          onProgressChange?.(progressFromClientX(ev.clientX));
        });
      }

      function onPointerUp(ev: PointerEvent) {
        if (frameRef.current !== null) {
          cancelAnimationFrame(frameRef.current);
          frameRef.current = null;
        }
        document.body.style.userSelect = "";
        setIsDragging(false);
        target.releasePointerCapture(ev.pointerId);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
      }

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    },
    [isInteractive, onProgressChange, progressFromClientX],
  );

  return (
    <div
      ref={cardRef}
      className={cx(styles.card, isInteractive && styles.interactive, isDragging && styles.dragging, className)}
      onPointerDown={isInteractive ? onPointerDown : undefined}
      role={isInteractive ? "slider" : undefined}
      aria-label={isInteractive ? String(title) : undefined}
      aria-valuemin={isInteractive ? 0 : undefined}
      aria-valuemax={isInteractive ? 100 : undefined}
      aria-valuenow={isInteractive ? clampedProgress : undefined}
    >
      {clampedProgress !== undefined && (
        <span
          className={cx(styles.progress, progressSide === "right" && styles.progressRight)}
          style={{ width: `${clampedProgress}%` }}
          aria-hidden="true"
        />
      )}

      <div className={styles.content}>
        <div className={styles.body}>
          <div className={styles.title}>{title}</div>
          {(subtitle || status) && (
            <div className={styles.meta}>
              {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
              {status && <span className={cx(styles.status, styles[statusTone])}>{status}</span>}
            </div>
          )}
        </div>

        <span className={cx(styles.iconTile, styles[`icon-${iconTone}`])}>
          <Icon name={icon} size={16} />
        </span>
      </div>
    </div>
  );
}
