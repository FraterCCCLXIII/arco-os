import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { Card } from "../Card";
import styles from "./MusicPlayerCard.module.css";

export interface MusicPlayerCardProps {
  title: ReactNode;
  artist?: ReactNode;
  sourceLabel?: ReactNode;
  imageTone?: "accent" | "neutral" | "warning";
  progress?: number;
  elapsed?: ReactNode;
  duration?: ReactNode;
  playing?: boolean;
  className?: string;
}

/** Compact now-playing card with album art, transport controls, and progress bar. */
export function MusicPlayerCard({
  title,
  artist,
  sourceLabel,
  imageTone = "neutral",
  progress = 35,
  elapsed,
  duration,
  playing = false,
  className,
}: MusicPlayerCardProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <Card padding="lg" className={cx(styles.card, className)}>
      <div className={styles.main}>
        <div className={cx(styles.art, styles[`art-${imageTone}`])} aria-hidden="true" />
        <div className={styles.meta}>
          <div className={styles.title}>{title}</div>
          {artist && <div className={styles.artist}>{artist}</div>}
          {sourceLabel && (
            <div className={styles.source}>
              <Icon name="sparkles" size={12} />
              {sourceLabel}
            </div>
          )}
        </div>
      </div>

      <div className={styles.controls} aria-label="Playback controls">
        <button type="button" className={styles.controlButton} aria-label="Shuffle">
          <Icon name="shuffle" size={14} />
        </button>
        <button type="button" className={styles.controlButton} aria-label="Previous">
          <Icon name="skip-back" size={16} />
        </button>
        <button type="button" className={cx(styles.controlButton, styles.playButton)} aria-label={playing ? "Pause" : "Play"}>
          <Icon name={playing ? "pause" : "play"} size={18} />
        </button>
        <button type="button" className={styles.controlButton} aria-label="Next">
          <Icon name="skip-forward" size={16} />
        </button>
        <button type="button" className={styles.controlButton} aria-label="Repeat">
          <Icon name="repeat" size={14} />
        </button>
      </div>

      <div className={styles.progressRow}>
        {elapsed && <span className={styles.time}>{elapsed}</span>}
        <div className={styles.progressTrack} aria-hidden="true">
          <span className={styles.progressFill} style={{ width: `${clampedProgress}%` }} />
        </div>
        {duration && <span className={styles.time}>{duration}</span>}
      </div>
    </Card>
  );
}
