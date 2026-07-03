import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../../utils/cx";
import styles from "./Switch.module.css";

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: ReactNode;
  /** Place the label before the track — common in settings rows and menu toggles. */
  labelPosition?: "start" | "end";
}

/** Toggle switch for boolean settings such as remember-me and feature flags. */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, labelPosition = "end", checked, className, id, disabled, ...rest },
  ref,
) {
  return (
    <label
      className={cx(
        styles.wrapper,
        label && labelPosition === "start" && styles.labelStart,
        disabled && styles.disabled,
        className,
      )}
      htmlFor={id}
    >
      <input
        ref={ref}
        id={id}
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        className={cx("lf-focusable", styles.input)}
        {...rest}
      />
      <span className={cx(styles.track, checked && styles.checked)} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
      {label ? <span className={styles.label}>{label}</span> : null}
    </label>
  );
});
