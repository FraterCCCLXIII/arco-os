/**
 * PromptChips — quick-start suggestions that wrap onto multiple lines when space
 * is tight, so the composer footer stays usable in narrow panels.
 */
import { Chip } from "../../primitives/Chip";
import type { PromptChipItem } from "./types";
import styles from "./PromptChips.module.css";

export interface PromptChipsProps {
  items: PromptChipItem[];
  onSelect: (item: PromptChipItem) => void;
}

/** Wrapping row of quick-start prompt suggestions. */
export function PromptChips({ items, onSelect }: PromptChipsProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        {items.map((item) => (
          <Chip key={item.id} icon={item.icon} onClick={() => onSelect(item)}>
            {item.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}
