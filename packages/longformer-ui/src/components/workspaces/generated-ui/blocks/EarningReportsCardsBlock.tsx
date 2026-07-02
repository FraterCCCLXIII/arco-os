import { EarningReportsCard } from "../../../primitives/EarningReportsCard";
import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

export function EarningReportsCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "earningReportsCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.dashboardWideGrid}>
        {block.cards.map(({ id, ...card }) => (
          <EarningReportsCard key={id} {...card} />
        ))}
      </div>
    </div>
  );
}
