import { SpentThisMonthCard } from "../../../primitives/SpentThisMonthCard";
import styles from "../blocks.tailwind";
import type { GeneratedBlock } from "../types";

export function SpentThisMonthCardsBlock({
  block,
}: {
  block: Extract<GeneratedBlock, { type: "spentThisMonthCards" }>;
}) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.dashboardCardGrid}>
        {block.cards.map(({ id, ...card }) => (
          <SpentThisMonthCard key={id} {...card} />
        ))}
      </div>
    </div>
  );
}
