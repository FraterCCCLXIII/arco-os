import { WeeklyStreakCard } from "../../../primitives/WeeklyStreakCard";
import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

export function WeeklyStreakCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "weeklyStreakCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.dashboardCardGrid}>
        {block.cards.map(({ id, ...card }) => (
          <WeeklyStreakCard key={id} {...card} />
        ))}
      </div>
    </div>
  );
}
