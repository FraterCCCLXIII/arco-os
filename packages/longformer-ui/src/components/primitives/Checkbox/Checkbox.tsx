import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import styles from "./Checkbox.module.css";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, checked, className, id, ...rest },
  ref
) {
  return (
    <label className={cx(styles.wrapper, className)} htmlFor={id}>
      <input ref={ref} id={id} type="checkbox" checked={checked} className={cx("lf-focusable", styles.input)} {...rest} />
      <span className={cx(styles.box, checked && styles.checked)} aria-hidden="true">
        {checked && <Icon name="check" size={12} strokeWidth={2.5} />}
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
});
