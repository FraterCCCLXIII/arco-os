import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Card } from "../Card";
import { Chip } from "../Chip";
import styles from "./FilterSectionCard.tailwind";

export interface FilterSectionOption {
  id: string;
  label: ReactNode;
  selected?: boolean;
}

export interface FilterSectionCardProps {
  label: ReactNode;
  options: FilterSectionOption[];
  onOptionToggle?: (id: string) => void;
  className?: string;
}

/**
 * A labeled filter section with a row of pill toggles — the pattern used in
 * stock, marketplace, and search refinement sheets.
 */
export function FilterSectionCard({ label, options, onOptionToggle, className }: FilterSectionCardProps) {
  return (
    <Card padding="md" className={cx(styles.card, className)}>
      <div className={styles.label}>{label}</div>
      <div className={styles.options}>
        {options.map((option) => (
          <Chip
            key={option.id}
            active={option.selected}
            onClick={onOptionToggle ? () => onOptionToggle(option.id) : undefined}
          >
            {option.label}
          </Chip>
        ))}
      </div>
    </Card>
  );
}
