import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import styles from "./FormulaBar.module.css";

export interface FormulaBarProps {
  cellAddress: string;
  value: string;
  onChange?: (value: string) => void;
  onCommit?: (value: string) => void;
  className?: string;
}

/** Cell reference box plus formula input, like Google Sheets' fx bar. */
export function FormulaBar({ cellAddress, value, onChange, onCommit, className }: FormulaBarProps) {
  return (
    <div className={cx(styles.formulaBar, className)}>
      <div className={styles.addressBox} aria-label="Active cell">
        {cellAddress}
      </div>
      <div className={styles.fxWrap} aria-hidden="true">
        <Icon name="code" size={14} />
        <span className={styles.fxLabel}>fx</span>
      </div>
      <input
        type="text"
        className={cx("lf-focusable", styles.formulaInput)}
        aria-label="Cell formula"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onCommit?.(event.currentTarget.value);
            event.currentTarget.blur();
          }
        }}
        onBlur={(event) => onCommit?.(event.target.value)}
      />
    </div>
  );
}
