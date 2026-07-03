import { cx } from "../../../utils/cx";
import { Chip } from "../../primitives/Chip";
import type { PromptChipItem } from "./types";
import styles from "./PromptChips.module.css";

export interface PromptChipsProps {
  items: PromptChipItem[];
  onSelect: (item: PromptChipItem) => void;
}

/** Horizontally scrollable quick-start prompt suggestions. */
export function PromptChips({ items, onSelect }: PromptChipsProps) {
  return (
    <div className={cx("lf-scrollbar-hidden", styles.wrapper)}>
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
