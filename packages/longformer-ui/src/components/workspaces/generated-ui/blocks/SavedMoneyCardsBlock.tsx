import { SavedMoneyCard } from "../../../primitives/SavedMoneyCard";
import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

export function SavedMoneyCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "savedMoneyCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.dashboardCardGrid}>
        {block.cards.map((card) => (
          <SavedMoneyCard
            key={card.id}
            title={card.title}
            subtitle={card.subtitle}
            icon={card.icon}
            chartValues={card.chartValues}
            labels={card.labels}
            timeframes={card.timeframes}
            activeTimeframe={card.activeTimeframe}
            yMax={card.yMax}
            externalLink={card.externalLink}
          />
        ))}
      </div>
    </div>
  );
}
