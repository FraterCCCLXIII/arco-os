import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import { Avatar } from "../../primitives/Avatar";
import type { PhoneContact } from "./types";
import styles from "./ContactRow.module.css";

export interface ContactRowProps {
  contact: PhoneContact;
  active?: boolean;
  onClick?: () => void;
}

export function ContactRow({ contact, active = false, onClick }: ContactRowProps) {
  return (
    <button type="button" className={cx("lf-focusable", styles.row, active && styles.rowActive)} onClick={onClick}>
      <Avatar name={contact.name} src={contact.avatarSrc} size="md" />
      <span className={styles.body}>
        <span className={styles.nameRow}>
          <span className={styles.name}>{contact.name}</span>
          {contact.favorite && (
            <span className={styles.star} aria-label="Favorite">
              <Icon name="star" size={12} />
            </span>
          )}
        </span>
        <span className={styles.meta}>
          {contact.phone}
          {contact.company && ` · ${contact.company}`}
        </span>
      </span>
    </button>
  );
}
