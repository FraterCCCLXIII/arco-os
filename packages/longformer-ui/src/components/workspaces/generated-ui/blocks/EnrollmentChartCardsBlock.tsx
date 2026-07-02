import { EnrollmentChartCard } from "../../../primitives/EnrollmentChartCard";
import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

export function EnrollmentChartCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "enrollmentChartCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.dashboardWideGrid}>
        {block.cards.map(({ id, ...card }) => (
          <EnrollmentChartCard key={id} {...card} />
        ))}
      </div>
    </div>
  );
}
