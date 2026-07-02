import { MiniStatChartCard } from "../../../primitives/MiniStatChartCard";
import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

export function MiniStatChartCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "miniStatChartCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.dashboardCardGrid}>
        {block.cards.map(({ id, ...card }) => (
          <MiniStatChartCard key={id} {...card} />
        ))}
      </div>
    </div>
  );
}
