import { useRef, useState } from "react";
import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { IconButton, Switch } from "../../primitives";
import { useDismissLayer } from "../../../utils/useDismissLayer";
import menuStyles from "../../primitives/Menu/Menu.module.css";
import styles from "./ComposerAttachMenu.module.css";

export interface ComposerDrawerToggle {
  id: string;
  label: string;
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
}

export interface ComposerAttachMenuProps {
  onAddFile?: () => void;
  drawerToggles?: ComposerDrawerToggle[];
  disabled?: boolean;
  className?: string;
}

/** Plus-button menu for attaching files and toggling composer drawer panels. */
export function ComposerAttachMenu({
  onAddFile,
  drawerToggles,
  disabled = false,
  className,
}: ComposerAttachMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useDismissLayer(open, () => setOpen(false), wrapperRef);

  function handleAddFile() {
    onAddFile?.();
    setOpen(false);
  }

  return (
    <div className={cx(styles.wrapper, className)} ref={wrapperRef}>
      <IconButton
        icon="plus"
        label="Add or attach"
        size="sm"
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      />

      {open ? (
        <div
          role="menu"
          aria-label="Attach and panels"
          className={cx(menuStyles.panel, menuStyles.panelTop, menuStyles.alignStart, styles.panel)}
        >
          <button
            type="button"
            role="menuitem"
            className={cx("lf-focusable", menuStyles.item)}
            onClick={handleAddFile}
          >
            <span className={menuStyles.itemIcon} aria-hidden="true">
              <Icon name="attach" size={15} />
            </span>
            <span className={menuStyles.itemLabel}>Add File</span>
          </button>

          {drawerToggles && drawerToggles.length > 0 ? (
            <>
              <div className={menuStyles.separator} role="separator" />
              <div className={styles.sectionLabel}>Panels</div>
              {drawerToggles.map((toggle) => (
                <div key={toggle.id} className={styles.toggleRow}>
                  <span className={styles.toggleLabel}>{toggle.label}</span>
                  <Switch
                    checked={toggle.visible}
                    onChange={(event) => toggle.onVisibleChange(event.target.checked)}
                    aria-label={toggle.label}
                  />
                </div>
              ))}
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
