import { FilterSectionCard } from "../../../primitives/FilterSectionCard";
import styles from "../blocks.module.css";
import type { GeneratedBlock } from "../types";

function noop() {}

export function FilterSectionsBlock({ block }: { block: Extract<GeneratedBlock, { type: "filterSections" }> }) {
  return (
    <div className={styles.block}>
      {block.title && <div className={styles.blockTitle}>{block.title}</div>}
      <div className={styles.filterSectionList}>
        {block.sections.map((section) => (
          <FilterSectionCard
            key={section.id}
            label={section.label}
            options={section.options}
            onOptionToggle={noop}
          />
        ))}
      </div>
    </div>
  );
}
