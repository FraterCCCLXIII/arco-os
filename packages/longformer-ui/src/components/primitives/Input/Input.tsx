import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../../utils/cx";
import styles from "./Input.module.css";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Leading icon/element, e.g. a search glyph. */
  startSlot?: ReactNode;
  endSlot?: ReactNode;
  invalid?: boolean;
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { startSlot, endSlot, invalid = false, className, wrapperClassName, ...rest },
  ref
) {
  return (
    <div className={cx(styles.wrapper, invalid && styles.invalid, wrapperClassName)}>
      {startSlot && <span className={styles.icon}>{startSlot}</span>}
      <input ref={ref} className={cx(styles.input, className)} {...rest} />
      {endSlot && <span className={styles.icon}>{endSlot}</span>}
    </div>
  );
});
