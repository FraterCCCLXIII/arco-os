import { FearGreedCard } from "../../../primitives/FearGreedCard";
import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

export function FearGreedCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "fearGreedCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.dashboardCardGrid}>
        {block.cards.map((card) => (
          <FearGreedCard
            key={card.id}
            title={card.title}
            icon={card.icon}
            score={card.score}
            label={card.label}
            caption={card.caption}
            leftPercent={card.leftPercent}
            rightPercent={card.rightPercent}
            actionLabel={card.actionLabel}
          />
        ))}
      </div>
    </div>
  );
}
