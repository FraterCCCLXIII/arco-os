import { TaskChecklistCard } from "../../../primitives/TaskChecklistCard";
import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

export function TaskChecklistCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "taskChecklistCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.dashboardCardGrid}>
        {block.cards.map((card) => (
          <TaskChecklistCard
            key={card.id}
            tabs={card.tabs}
            activeTab={card.activeTab}
            title={card.title}
            items={card.items}
            progress={card.progress}
            progressLabel={card.progressLabel}
            memberNames={card.memberNames}
            actionLabel={card.actionLabel}
          />
        ))}
      </div>
    </div>
  );
}
