import { TargetChartCard } from "../../../primitives/TargetChartCard";
import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

export function TargetChartCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "targetChartCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.dashboardCardGrid}>
        {block.cards.map((card) => (
          <TargetChartCard
            key={card.id}
            title={card.title}
            icon={card.icon}
            months={card.months}
            yLabels={card.yLabels}
            actualValues={card.actualValues}
            targetEnd={card.targetEnd}
            externalLink={card.externalLink}
          />
        ))}
      </div>
    </div>
  );
}
