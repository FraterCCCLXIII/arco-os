import { SubscribersChartCard } from "../../../primitives/SubscribersChartCard";
import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

export function SubscribersChartCardsBlock({
  block,
}: {
  block: Extract<GeneratedBlock, { type: "subscribersChartCards" }>;
}) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.dashboardCardGrid}>
        {block.cards.map(({ id, ...card }) => (
          <SubscribersChartCard key={id} {...card} />
        ))}
      </div>
    </div>
  );
}
