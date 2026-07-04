import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { splitTypeaheadSuggestion, type ComposerTypeaheadProps } from "./ComposerTypeahead.types";
import styles from "./ComposerTypeahead.module.css";

/** Bottom drawer of query completions shown while the user types in the composer. */
export function ComposerTypeahead({ value, items, activeIndex = -1, onSelect, className }: ComposerTypeaheadProps) {
  if (items.length === 0) return null;

  return (
    <div className={cx(styles.drawer, className)} role="listbox" aria-label="Suggestions">
      {items.map((item, index) => {
        const { prefix, completion } = splitTypeaheadSuggestion(value, item.text);

        return (
          <button
            key={item.id}
            type="button"
            role="option"
            aria-selected={index === activeIndex}
            className={cx("lf-focusable", styles.row, index === activeIndex && styles.rowActive)}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onSelect(item)}
          >
            <span className={styles.icon} aria-hidden="true">
              <Icon name="search" size={14} />
            </span>
            <span className={styles.text}>
              <span className={styles.prefix}>{prefix}</span>
              <span className={styles.completion}>{completion}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
