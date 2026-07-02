import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import styles from "./VideoPlayerCard.module.css";

export interface VideoPlayerCardProps {
  elapsed?: ReactNode;
  duration?: ReactNode;
  progress?: number;
  ended?: boolean;
  imageTone?: "accent" | "neutral" | "warning";
  watchAgainLabel?: ReactNode;
  className?: string;
}

/** Portrait video player with end-state overlay and streaming-style controls. */
export function VideoPlayerCard({
  elapsed = "1:43",
  duration = "1:43",
  progress = 100,
  ended = true,
  imageTone = "neutral",
  watchAgainLabel = "Watch again",
  className,
}: VideoPlayerCardProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const timeLabel =
    elapsed != null && duration != null ? (
      <>
        {elapsed}
        <span className={styles.timeDivider} aria-hidden="true">
          {" / "}
        </span>
        {duration}
      </>
    ) : (
      elapsed ?? duration
    );

  return (
    <div className={cx(styles.player, className)}>
      <div className={cx(styles.poster, styles[`poster-${imageTone}`])} aria-hidden="true" />

      {ended && (
        <div className={styles.endOverlay}>
          <button type="button" className={cx(styles.watchAgain, "lf-focusable")}>
            {watchAgainLabel}
          </button>
        </div>
      )}

      <div className={styles.controls}>
        <div className={styles.progressTrack} aria-hidden="true">
          <span className={styles.progressFill} style={{ width: `${clampedProgress}%` }} />
        </div>

        <div className={styles.controlRow} aria-label="Video playback controls">
          <button type="button" className={cx(styles.controlButton, "lf-focusable")} aria-label="Replay">
            <Icon name="replay" size={18} />
          </button>

          <span className={styles.time}>{timeLabel}</span>

          <div className={styles.utilityControls}>
            <button type="button" className={cx(styles.controlButton, "lf-focusable")} aria-label="Captions">
              <span className={styles.captionsLabel}>CC</span>
            </button>
            <button type="button" className={cx(styles.controlButton, "lf-focusable")} aria-label="Volume">
              <Icon name="volume" size={18} />
            </button>
            <button type="button" className={cx(styles.controlButton, "lf-focusable")} aria-label="Settings">
              <Icon name="settings" size={18} />
            </button>
            <button type="button" className={cx(styles.controlButton, "lf-focusable")} aria-label="Picture in picture">
              <Icon name="picture-in-picture" size={18} />
            </button>
            <button type="button" className={cx(styles.controlButton, "lf-focusable")} aria-label="Fullscreen">
              <Icon name="maximize" size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
