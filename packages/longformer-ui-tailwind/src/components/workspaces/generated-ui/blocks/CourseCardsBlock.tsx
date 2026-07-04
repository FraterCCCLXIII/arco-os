import { CourseCard } from "../../../primitives/CourseCard";
import styles from "../blocks.tailwind";
import type { GeneratedBlock } from "../types";

function noop() {}

export function CourseCardsBlock({ block }: { block: Extract<GeneratedBlock, { type: "courseCards" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.courseCardGrid}>
        {block.cards.map((card) => (
          <CourseCard
            key={card.id}
            variant={card.variant}
            title={card.title}
            subtitle={card.subtitle}
            instructor={card.instructor}
            progress={card.progress}
            actionLabel={card.actionLabel}
            tone={card.tone}
            onClick={noop}
          />
        ))}
      </div>
    </div>
  );
}
