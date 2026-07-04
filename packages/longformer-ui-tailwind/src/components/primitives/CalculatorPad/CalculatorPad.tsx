import { cx } from "../../../utils/cx";
import { CALCULATOR_KEYS, type CalculatorKeyDef } from "./types";
import { useCalculator } from "./useCalculator";
import styles from "./CalculatorPad.tailwind";

export interface CalculatorPadProps {
  className?: string;
  /** Show the vintage Datamath-style brand strip above the display. */
  branded?: boolean;
  /** Optional controlled display value — when set, key presses call `onPress` instead of managing state internally. */
  value?: string;
  onPress?: (key: string) => void;
}

function keyClassName(key: CalculatorKeyDef) {
  return cx(
    "lf-focusable",
    styles.key,
    key.variant === "numeric" && styles.keyNumeric,
    key.variant === "function" && styles.keyFunction,
    key.variant === "operator" && styles.keyOperator,
    key.variant === "equals" && styles.keyEquals,
    key.rowSpan && key.rowSpan > 1 && styles.keyRowSpan,
  );
}

/** Retro Datamath-style calculator keypad with LED display and chain arithmetic. */
export function CalculatorPad({ className, branded = true, value, onPress }: CalculatorPadProps) {
  const internal = useCalculator();
  const display = value ?? internal.display;

  function handlePress(key: string) {
    if (onPress) {
      onPress(key);
      return;
    }
    internal.press(key);
  }

  return (
    <div className={cx(styles.pad, className)} role="group" aria-label="Calculator">
      {branded && (
        <div className={styles.brand} aria-hidden="true">
          <span className={styles.brandName}>Datamath</span>
          <span className={styles.brandMark}>TI</span>
        </div>
      )}

      <div className={styles.display} aria-live="polite" aria-label={`Display ${display}`}>
        {display}
      </div>

      <div className={styles.keypad}>
        <div className={styles.grid}>
          {CALCULATOR_KEYS.flat().map((key, index) =>
            key ? (
              <button
                key={key.value}
                type="button"
                className={keyClassName(key)}
                aria-label={key.label}
                onClick={() => handlePress(key.value)}
              >
                {key.label}
              </button>
            ) : (
              <span key={`spacer-${index}`} className={styles.keySpacer} aria-hidden="true" />
            ),
          )}
        </div>
      </div>
    </div>
  );
}
