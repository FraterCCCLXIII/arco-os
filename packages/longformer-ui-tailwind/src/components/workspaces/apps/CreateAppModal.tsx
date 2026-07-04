/**
 * Create-app modal — pick a starter template and name a new launcher entry.
 * Opened from the bottom tray plus control; the parent owns persistence and launch.
 */
import { useEffect, useState } from "react";
import { Icon } from "../../../icons";
import { Button } from "../../primitives/Button";
import { Input } from "../../primitives/Input";
import { Modal } from "../../primitives/Modal";
import { cx } from "../../../utils/cx";
import { APP_TEMPLATES, type AppTemplateId, type CreateAppPayload } from "./types";
import styles from "./CreateAppModal.tailwind";

export interface CreateAppModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: CreateAppPayload) => void;
}

/** Modal wizard for naming a new app and choosing one of the built-in templates. */
export function CreateAppModal({ open, onClose, onCreate }: CreateAppModalProps) {
  const [name, setName] = useState("");
  const [templateId, setTemplateId] = useState<AppTemplateId>("dashboard");

  useEffect(() => {
    if (!open) return;
    setName("");
    setTemplateId("dashboard");
  }, [open]);

  const selectedTemplate = APP_TEMPLATES.find((template) => template.id === templateId);

  function handleCreate() {
    const trimmed = name.trim();
    onCreate({
      name: trimmed || selectedTemplate?.label || "New App",
      templateId,
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create New App"
      className={styles.panel}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreate}>
            <Icon name="plus" size={14} />
            Create App
          </Button>
        </>
      }
    >
      <div className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="create-app-name">
            App name
          </label>
          <Input
            id="create-app-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={selectedTemplate?.label ?? "My App"}
            autoFocus
          />
          <p className={styles.hint}>Leave blank to use the template name.</p>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Choose a template</span>
          <div className={styles.templateGrid} role="listbox" aria-label="App templates">
            {APP_TEMPLATES.map((template) => {
              const selected = template.id === templateId;
              return (
                <button
                  key={template.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={cx(styles.templateCard, selected && styles.templateCardSelected, "lf-focusable")}
                  onClick={() => setTemplateId(template.id)}
                >
                  <span className={styles.templateIcon}>
                    <Icon name={template.icon} size={18} />
                  </span>
                  <span className={styles.templateLabel}>{template.label}</span>
                  <span className={styles.templateDescription}>{template.description}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}
