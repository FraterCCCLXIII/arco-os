import { cx } from "../../../utils/cx";
import { DESKTOP_SHELL_LABEL, type DesktopShell } from "./types";
import styles from "./ShellPicker.tailwind";

export interface ShellPickerProps {
  shell: DesktopShell;
  onShellChange: (shell: DesktopShell) => void;
  className?: string;
}

const SHELL_ORDER: DesktopShell[] = ["macos", "windows", "ios", "android", "chromeos"];

/** Segmented control for switching between OS shell themes inside the desktop workspace. */
export function ShellPicker({ shell, onShellChange, className }: ShellPickerProps) {
  return (
    <div className={cx(styles.picker, className)} role="tablist" aria-label="Desktop shell">
      {SHELL_ORDER.map((value) => (
        <button
          key={value}
          type="button"
          role="tab"
          className={cx("lf-focusable", styles.tab, shell === value && styles.tabActive)}
          aria-selected={shell === value}
          onClick={() => onShellChange(value)}
        >
          {DESKTOP_SHELL_LABEL[value]}
        </button>
      ))}
    </div>
  );
}
