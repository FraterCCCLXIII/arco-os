import { FlowReportCard } from "../../../primitives/FlowReportCard";
import styles from "../blocks.tailwind";
import type { GeneratedBlock } from "../types";

export function FlowReportCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "flowReportCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.dashboardCardGrid}>
        {block.cards.map((card) => (
          <FlowReportCard
            key={card.id}
            title={card.title}
            icon={card.icon}
            sources={card.sources}
            targets={card.targets}
            links={card.links}
            externalLink={card.externalLink}
          />
        ))}
      </div>
    </div>
  );
}
