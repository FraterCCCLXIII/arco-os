import { MetricChartCard } from "../../../primitives/MetricChartCard";
import styles from "../blocks.tailwind";
import type { GeneratedBlock } from "../types";

function noop() {}

export function MetricChartCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "metricChartCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.metricChartCardGrid}>
        {block.cards.map((card) => (
          <MetricChartCard
            key={card.id}
            label={card.label}
            value={card.value}
            change={card.change}
            chartValues={card.chartValues}
            timeframes={card.timeframes}
            activeTimeframe={card.activeTimeframe}
            onTimeframeChange={card.timeframes ? noop : undefined}
          />
        ))}
      </div>
    </div>
  );
}
