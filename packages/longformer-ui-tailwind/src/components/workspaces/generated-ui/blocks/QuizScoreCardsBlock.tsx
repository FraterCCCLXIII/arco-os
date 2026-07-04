import { QuizScoreCard } from "../../../primitives/QuizScoreCard";
import styles from "../blocks.tailwind";
import type { GeneratedBlock } from "../types";

export function QuizScoreCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "quizScoreCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.dashboardCardGrid}>
        {block.cards.map(({ id, ...card }) => (
          <QuizScoreCard key={id} {...card} />
        ))}
      </div>
    </div>
  );
}
