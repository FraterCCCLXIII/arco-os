import { TranslationCard } from "../../../primitives/TranslationCard";
import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

export function TranslationCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "translationCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.dashboardWideGrid}>
        {block.cards.map((card) => (
          <TranslationCard key={card.id} panels={card.panels} />
        ))}
      </div>
    </div>
  );
}
