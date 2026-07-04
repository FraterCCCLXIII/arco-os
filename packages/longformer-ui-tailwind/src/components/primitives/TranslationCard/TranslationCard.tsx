import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { Card } from "../Card";
import styles from "./TranslationCard.tailwind";

export interface TranslationPanel {
  language: ReactNode;
  flag?: ReactNode;
  text: ReactNode;
}

export interface TranslationCardProps {
  panels: [TranslationPanel, TranslationPanel];
  className?: string;
}

/** Side-by-side translation card with language headers and utility actions. */
export function TranslationCard({ panels, className }: TranslationCardProps) {
  return (
    <Card padding="lg" className={cx(styles.card, className)}>
      <div className={styles.grid}>
        {panels.map((panel, index) => (
          <div key={index} className={styles.panel}>
            <div className={styles.panelHeader}>
              {panel.flag && <span className={styles.flag}>{panel.flag}</span>}
              <span className={styles.language}>{panel.language}</span>
              <Icon name="chevron-down" size={14} />
            </div>
            <div className={styles.text}>{panel.text}</div>
          </div>
        ))}
      </div>
      <div className={styles.actions} aria-label="Translation tools">
        <button type="button" className={styles.actionButton} aria-label="Microphone">
          <Icon name="mic" size={16} />
        </button>
        <button type="button" className={styles.actionButton} aria-label="Volume">
          <Icon name="volume" size={16} />
        </button>
        <button type="button" className={styles.actionButton} aria-label="Copy">
          <Icon name="copy" size={16} />
        </button>
        <button type="button" className={styles.actionButton} aria-label="Share">
          <Icon name="external-link" size={16} />
        </button>
      </div>
    </Card>
  );
}
