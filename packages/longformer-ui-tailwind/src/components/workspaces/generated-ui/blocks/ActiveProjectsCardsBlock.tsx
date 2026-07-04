import { ActiveProjectsCard } from "../../../primitives/ActiveProjectsCard";
import styles from "../blocks.tailwind";
import type { GeneratedBlock } from "../types";

export function ActiveProjectsCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "activeProjectsCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.dashboardWideGrid}>
        {block.cards.map(({ id, ...card }) => (
          <ActiveProjectsCard key={id} {...card} />
        ))}
      </div>
    </div>
  );
}
