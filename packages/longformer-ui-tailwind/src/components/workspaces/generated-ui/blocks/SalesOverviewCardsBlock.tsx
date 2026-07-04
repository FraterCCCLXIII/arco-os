import { SalesOverviewCard } from "../../../primitives/SalesOverviewCard";
import styles from "../blocks.tailwind";
import type { GeneratedBlock } from "../types";

export function SalesOverviewCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "salesOverviewCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.dashboardCardGrid}>
        {block.cards.map(({ id, ...card }) => (
          <SalesOverviewCard key={id} {...card} />
        ))}
      </div>
    </div>
  );
}
