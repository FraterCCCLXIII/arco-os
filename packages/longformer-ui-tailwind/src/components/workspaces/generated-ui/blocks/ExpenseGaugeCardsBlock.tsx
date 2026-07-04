import { ExpenseGaugeCard } from "../../../primitives/ExpenseGaugeCard";
import styles from "../blocks.tailwind";
import type { GeneratedBlock } from "../types";

export function ExpenseGaugeCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "expenseGaugeCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.dashboardCardGrid}>
        {block.cards.map(({ id, ...card }) => (
          <ExpenseGaugeCard key={id} {...card} />
        ))}
      </div>
    </div>
  );
}
