import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { SPECIAL_PAGE_OPTIONS, type SpecialPageId } from "./special-pages";
import styles from "./SpecialPagePicker.module.css";

export interface SpecialPagePickerProps {
  page: SpecialPageId;
  onPageChange: (page: SpecialPageId) => void;
  className?: string;
}

/** Dropdown for previewing full-screen special pages inside the device frame. */
export function SpecialPagePicker({ page, onPageChange, className }: SpecialPagePickerProps) {
  return (
    <label className={cx(styles.picker, className)}>
      <select
        className={cx("lf-focusable", styles.select)}
        value={page}
        aria-label="Special page preview"
        onChange={(event) => onPageChange(event.target.value as SpecialPageId)}
      >
        {SPECIAL_PAGE_OPTIONS.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
      <Icon name="chevron-down" size={12} className={styles.chevron} aria-hidden="true" />
    </label>
  );
}
