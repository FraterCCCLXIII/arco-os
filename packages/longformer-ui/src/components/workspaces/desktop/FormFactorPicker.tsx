import { cx } from "../../../utils/cx";
import { FORM_FACTOR_LABEL, type FormFactor } from "../../../surface-manager";
import styles from "./FormFactorPicker.module.css";

export interface FormFactorPickerProps {
  formFactor: FormFactor;
  onFormFactorChange: (formFactor: FormFactor) => void;
  className?: string;
  items?: FormFactor[];
}

export const DEVICE_FORM_FACTOR_ORDER: FormFactor[] = ["desktop", "tablet", "phone", "watch"];

const FORM_FACTOR_ORDER: FormFactor[] = [...DEVICE_FORM_FACTOR_ORDER, "widget"];

/** Segmented control for switching simulated device form factors. */
export function FormFactorPicker({
  formFactor,
  onFormFactorChange,
  className,
  items = FORM_FACTOR_ORDER,
}: FormFactorPickerProps) {
  return (
    <div className={cx(styles.picker, className)} role="tablist" aria-label="Form factor">
      {items.map((value) => (
        <button
          key={value}
          type="button"
          role="tab"
          className={cx("lf-focusable", styles.tab, formFactor === value && styles.tabActive)}
          aria-selected={formFactor === value}
          onClick={() => onFormFactorChange(value)}
        >
          {FORM_FACTOR_LABEL[value]}
        </button>
      ))}
    </div>
  );
}
