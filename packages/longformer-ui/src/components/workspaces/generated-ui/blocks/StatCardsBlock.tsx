import { StatCard } from "../../../primitives/StatCard";
import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

export function StatCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "statCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.statCardGrid}>
        {block.cards.map((card) => (
          <StatCard
            key={card.id}
            icon={card.icon}
            label={card.label}
            value={card.value}
            caption={card.caption}
            tone={card.tone}
            visualization={card.visualization}
          />
        ))}
      </div>
    </div>
  );
}
