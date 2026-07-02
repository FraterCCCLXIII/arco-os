import { useState } from "react";
import { Button } from "../../primitives/Button";
import { IconButton } from "../../primitives/IconButton";
import { Input } from "../../primitives/Input";
import { Modal } from "../../primitives/Modal";
import { RichTextEditor, type RichTextContent } from "./RichTextEditor";
import styles from "./EmailComposeModal.module.css";

export interface EmailDraft {
  to: string;
  cc?: string;
  subject: string;
  body: RichTextContent;
}

export interface EmailComposeModalProps {
  open: boolean;
  onClose: () => void;
  onSend?: (draft: EmailDraft) => void;
  defaultTo?: string;
  defaultSubject?: string;
}

/** New message modal with address fields and a rich text body editor. */
export function EmailComposeModal({
  open,
  onClose,
  onSend,
  defaultTo = "",
  defaultSubject = "",
}: EmailComposeModalProps) {
  const [to, setTo] = useState(defaultTo);
  const [cc, setCc] = useState("");
  const [subject, setSubject] = useState(defaultSubject);
  const [showCc, setShowCc] = useState(false);

  function resetFields() {
    setTo(defaultTo);
    setCc("");
    setSubject(defaultSubject);
    setShowCc(false);
  }

  function handleClose() {
    resetFields();
    onClose();
  }

  function handleSend(content: RichTextContent) {
    if (!to.trim() || !subject.trim()) return;
    onSend?.({
      to: to.trim(),
      cc: cc.trim() || undefined,
      subject: subject.trim(),
      body: content,
    });
    handleClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="New message"
      className={styles.modal}
      footer={
        <div className={styles.footerActions}>
          <Button variant="secondary" size="sm" onClick={handleClose}>
            Discard
          </Button>
        </div>
      }
    >
      <div className={styles.form}>
        <div className={styles.fieldRow}>
          <label className={styles.fieldLabel} htmlFor="email-compose-to">
            To
          </label>
          <Input
            id="email-compose-to"
            className={styles.fieldInput}
            value={to}
            onChange={(event) => setTo(event.target.value)}
            placeholder="Recipient"
          />
          {!showCc && (
            <Button variant="ghost" size="sm" onClick={() => setShowCc(true)}>
              Cc
            </Button>
          )}
        </div>
        {showCc && (
          <div className={styles.fieldRow}>
            <label className={styles.fieldLabel} htmlFor="email-compose-cc">
              Cc
            </label>
            <Input
              id="email-compose-cc"
              className={styles.fieldInput}
              value={cc}
              onChange={(event) => setCc(event.target.value)}
              placeholder="Cc recipients"
            />
          </div>
        )}
        <div className={styles.fieldRow}>
          <label className={styles.fieldLabel} htmlFor="email-compose-subject">
            Subject
          </label>
          <Input
            id="email-compose-subject"
            className={styles.fieldInput}
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Subject"
          />
        </div>
        <RichTextEditor
          className={styles.editor}
          placeholder="Write your message…"
          ariaLabel="Email body"
          minHeight={180}
          maxHeight={320}
          sendLabel="Send message"
          onSend={handleSend}
          footerActions={<IconButton icon="attach" label="Attach file" size="sm" />}
        />
      </div>
    </Modal>
  );
}
