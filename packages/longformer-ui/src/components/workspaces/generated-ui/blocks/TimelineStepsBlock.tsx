import { TimelineStepCard } from "../../../primitives/TimelineStepCard";
import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

function noop() {}

export function TimelineStepsBlock({ block }: { block: Extract<GeneratedBlock, { type: "timelineSteps" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.timelineSteps}>
        {block.steps.map((step, index) => (
          <TimelineStepCard
            key={step.id}
            label={step.label}
            completed={step.completed}
            showConnector={step.showConnector ?? index < block.steps.length - 1}
            onClick={noop}
          />
        ))}
      </div>
    </div>
  );
}
