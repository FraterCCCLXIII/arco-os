import { cx } from "../../../utils/cx";
import { OMRON_CALCULATOR_KEYS, type CalculatorKeyDef } from "./types";
import { useCalculator } from "./useCalculator";
import styles from "./OmronCalculatorPad.tailwind";

export interface OmronCalculatorPadProps {
  className?: string;
  /** Show the Omron 86 brand pill in the orange header. */
  branded?: boolean;
  value?: string;
  onPress?: (key: string) => void;
}

function keyClassName(key: CalculatorKeyDef) {
  return cx(
    "lf-focusable",
    styles.key,
    key.variant === "numeric" ? styles.keyNumeric : styles.keyFunction,
  );
}

/** Omron 86-style calculator — orange header, VFD display, circular black/white keys. */
export function OmronCalculatorPad({ className, branded = true, value, onPress }: OmronCalculatorPadProps) {
  const internal = useCalculator();
  const display = value ?? internal.display;
  const isNegative = display.startsWith("-");

  function handlePress(key: string) {
    if (onPress) {
      onPress(key);
      return;
    }
    internal.press(key);
  }

  return (
    <div className={cx(styles.pad, className)} role="group" aria-label="Calculator">
      <div className={styles.header}>
        {branded && (
          <span className={styles.brand} aria-hidden="true">
            OMRON 86
          </span>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.displayWrap}>
          <div className={styles.displayLabels} aria-hidden="true">
            <span className={isNegative ? styles.displayLabelActive : undefined}>Minus</span>
            <span>×10⁸</span>
          </div>
          <div className={styles.display} aria-live="polite" aria-label={`Display ${display}`}>
            {display}
          </div>
        </div>

        <div className={styles.grid}>
          {OMRON_CALCULATOR_KEYS.flat().map((key) => (
            <button
              key={key.value}
              type="button"
              className={keyClassName(key)}
              aria-label={key.label}
              onClick={() => handlePress(key.value)}
            >
              {key.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
