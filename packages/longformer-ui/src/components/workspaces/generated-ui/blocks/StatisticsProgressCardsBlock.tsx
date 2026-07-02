import { StatisticsProgressCard } from "../../../primitives/StatisticsProgressCard";
import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

export function StatisticsProgressCardsBlock({
  block,
}: {
  block: Extract<GeneratedBlock, { type: "statisticsProgressCards" }>;
}) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.dashboardCardGrid}>
        {block.cards.map(({ id, ...card }) => (
          <StatisticsProgressCard key={id} {...card} />
        ))}
      </div>
    </div>
  );
}
