import { Icon } from "../../../icons";
import { Avatar } from "../../primitives/Avatar";
import { IconButton } from "../../primitives/IconButton";
import type { PhoneContact } from "./types";
import styles from "./ContactDetail.tailwind";

export interface ContactDetailProps {
  contact?: PhoneContact;
  onCall?: (contact: PhoneContact) => void;
  onMessage?: (contact: PhoneContact) => void;
  onEmail?: (contact: PhoneContact) => void;
}

export function ContactDetail({ contact, onCall, onMessage, onEmail }: ContactDetailProps) {
  if (!contact) {
    return (
      <div className={styles.empty}>
        <Icon name="contact" size={28} />
        <div className={styles.emptyTitle}>Select a contact</div>
        <div className={styles.emptyHint}>Pick someone from the list or dial a number on the right.</div>
      </div>
    );
  }

  return (
    <div className={styles.detail}>
      <div className={styles.hero}>
        <Avatar name={contact.name} src={contact.avatarSrc} size="lg" />
        <div className={styles.heroName}>{contact.name}</div>
        {(contact.title || contact.company) && (
          <div className={styles.heroMeta}>
            {[contact.title, contact.company].filter(Boolean).join(" · ")}
          </div>
        )}
        <div className={styles.actions}>
          <IconButton icon="phone-call" label={`Call ${contact.name}`} variant="primary" onClick={() => onCall?.(contact)} />
          <IconButton icon="chat" label={`Message ${contact.name}`} onClick={() => onMessage?.(contact)} />
          {contact.email && (
            <IconButton icon="mail" label={`Email ${contact.name}`} onClick={() => onEmail?.(contact)} />
          )}
        </div>
      </div>
      <div className={styles.fields}>
        <div className={styles.field}>
          <div className={styles.fieldLabel}>{contact.phoneLabel ?? "Phone"}</div>
          <button type="button" className={styles.fieldValue} onClick={() => onCall?.(contact)}>
            {contact.phone}
          </button>
        </div>
        {contact.email && (
          <div className={styles.field}>
            <div className={styles.fieldLabel}>Email</div>
            <button type="button" className={styles.fieldValue} onClick={() => onEmail?.(contact)}>
              {contact.email}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
