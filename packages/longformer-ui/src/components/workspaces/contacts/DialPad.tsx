import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { IconButton } from "../../primitives/IconButton";
import { DIAL_PAD_KEYS, DIAL_PAD_LETTERS, type DialPadKey } from "./types";
import styles from "./DialPad.module.css";

export interface DialPadProps {
  value: string;
  onChange: (value: string) => void;
  onCall?: () => void;
  label?: string;
  className?: string;
}

/** A phone-style numeric keypad — tap keys to compose a number, then call. */
export function DialPad({ value, onChange, onCall, label = "Dial", className }: DialPadProps) {
  function append(key: DialPadKey) {
    onChange(value + key);
  }

  function backspace() {
    onChange(value.slice(0, -1));
  }

  return (
    <div className={cx(styles.pad, className)}>
      <div className={styles.display} aria-live="polite">
        {value || <span className={styles.placeholder}>Enter number</span>}
      </div>
      <div className={styles.grid}>
        {DIAL_PAD_KEYS.flat().map((key, index) =>
          key ? (
            <button
              key={key}
              type="button"
              className={cx("lf-focusable", styles.key)}
              onClick={() => append(key)}
            >
              <span className={styles.keyDigit}>{key}</span>
              {DIAL_PAD_LETTERS[key] && <span className={styles.keyLetters}>{DIAL_PAD_LETTERS[key]}</span>}
            </button>
          ) : (
            <span key={`spacer-${index}`} className={styles.keySpacer} />
          ),
        )}
      </div>
      <div className={styles.actions}>
        <IconButton icon="delete" label="Backspace" size="sm" disabled={value.length === 0} onClick={backspace} />
        <button
          type="button"
          className={cx("lf-focusable", styles.callButton)}
          aria-label={label}
          disabled={value.length === 0}
          onClick={onCall}
        >
          <Icon name="phone-call" size={20} />
        </button>
        <span className={styles.actionSpacer} aria-hidden="true" />
      </div>
    </div>
  );
}
