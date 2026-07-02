import { useMemo, type ReactNode } from "react";
import { Icon } from "../../../icons";
import { Input } from "../../primitives/Input";
import { ScrollArea } from "../../primitives/ScrollArea";
import { ResizablePane } from "../../primitives/ResizablePane";
import { EmptyState } from "../../primitives/EmptyState";
import { ListPane } from "../../shell/ListPane";
import { ContactRow } from "./ContactRow";
import { ContactDetail } from "./ContactDetail";
import { DialPad } from "./DialPad";
import type { PhoneContact } from "./types";
import styles from "./ContactsWorkspace.module.css";

export interface ContactsWorkspaceProps {
  title?: string;
  contacts: PhoneContact[];
  activeContactId?: string;
  onSelectContact: (id: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  dialValue: string;
  onDialChange: (value: string) => void;
  onCall?: (phone: string, contact?: PhoneContact) => void;
  onMessageContact?: (contact: PhoneContact) => void;
  onEmailContact?: (contact: PhoneContact) => void;
  listPaneWidth?: number;
  defaultListPaneWidth?: number;
  onListPaneWidthChange?: (width: number) => void;
  dialPadWidth?: number;
  defaultDialPadWidth?: number;
  onDialPadWidthChange?: (width: number) => void;
  actions?: ReactNode;
}

/** A contacts workspace with list, detail, and a resizable phone dial pad column. */
export function ContactsWorkspace({
  title = "Contacts",
  contacts,
  activeContactId,
  onSelectContact,
  searchQuery = "",
  onSearchChange,
  dialValue,
  onDialChange,
  onCall,
  onMessageContact,
  onEmailContact,
  listPaneWidth,
  defaultListPaneWidth = 300,
  onListPaneWidthChange,
  dialPadWidth,
  defaultDialPadWidth = 280,
  onDialPadWidthChange,
  actions,
}: ContactsWorkspaceProps) {
  const activeContact = useMemo(
    () => contacts.find((contact) => contact.id === activeContactId),
    [contacts, activeContactId],
  );

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return contacts;
    return contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(query) ||
        contact.phone.includes(query) ||
        contact.email?.toLowerCase().includes(query) ||
        contact.company?.toLowerCase().includes(query),
    );
  }, [contacts, searchQuery]);

  function handleCallFromPad() {
    onCall?.(dialValue, activeContact);
  }

  function handleCallContact(contact: PhoneContact) {
    onDialChange(contact.phone);
    onCall?.(contact.phone, contact);
  }

  return (
    <div className={styles.workspace}>
      <ResizablePane
        width={listPaneWidth}
        defaultWidth={defaultListPaneWidth}
        onWidthChange={onListPaneWidthChange}
        minWidth={240}
        maxWidth={420}
        handleSide="right"
        className={styles.listResizable}
        handleLabel="Resize contacts list"
      >
        <ListPane
          title={
            <>
              <Icon name="contact" size={15} />
              {title}
            </>
          }
          headerActions={actions}
          toolbar={
            onSearchChange ? (
              <Input
                value={searchQuery}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search contacts"
                aria-label="Search contacts"
              />
            ) : undefined
          }
        >
          <ScrollArea className={styles.listScroll}>
            {filtered.length === 0 ? (
              <EmptyState icon={<Icon name="contact" size={22} />} title="No contacts found" description="Try a different search." />
            ) : (
              filtered.map((contact) => (
                <ContactRow
                  key={contact.id}
                  contact={contact}
                  active={contact.id === activeContactId}
                  onClick={() => {
                    onSelectContact(contact.id);
                    onDialChange(contact.phone);
                  }}
                />
              ))
            )}
          </ScrollArea>
        </ListPane>
      </ResizablePane>

      <div className={styles.detailPane}>
        <ContactDetail
          contact={activeContact}
          onCall={handleCallContact}
          onMessage={onMessageContact}
          onEmail={onEmailContact}
        />
      </div>

      <ResizablePane
        width={dialPadWidth}
        defaultWidth={defaultDialPadWidth}
        onWidthChange={onDialPadWidthChange}
        minWidth={220}
        maxWidth={360}
        handleSide="left"
        className={styles.dialResizable}
        paneClassName={styles.dialPane}
        handleLabel="Resize dial pad"
      >
        <div className={styles.dialHeader}>Keypad</div>
        <DialPad value={dialValue} onChange={onDialChange} onCall={handleCallFromPad} />
      </ResizablePane>
    </div>
  );
}
