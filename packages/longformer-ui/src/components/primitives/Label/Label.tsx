import { forwardRef, type LabelHTMLAttributes } from "react";
import { cx } from "../../../utils/cx";
import styles from "./Label.module.css";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /** Visually muted helper copy below the label text. */
  hint?: string;
}

/** Accessible form field label aligned with Longformer typography tokens. */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, children, hint, ...rest },
  ref,
) {
  return (
    <label ref={ref} className={cx(styles.label, className)} {...rest}>
      <span className={styles.text}>{children}</span>
      {hint ? <span className={styles.hint}>{hint}</span> : null}
    </label>
  );
});
