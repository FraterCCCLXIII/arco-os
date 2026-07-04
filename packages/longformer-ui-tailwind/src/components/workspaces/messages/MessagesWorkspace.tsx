import { useMemo, useEffect, useRef, useState } from "react";
import { Icon } from "../../../icons";
import { Avatar } from "../../primitives/Avatar";
import { Button } from "../../primitives/Button";
import { IconButton } from "../../primitives/IconButton";
import { Input } from "../../primitives/Input";
import { ScrollArea } from "../../primitives/ScrollArea";
import { ResizablePane } from "../../primitives/ResizablePane";
import { EmptyState } from "../../primitives/EmptyState";
import { ListPane } from "../../shell/ListPane";
import listPaneStyles from "../../shell/ListPane/ListPane.tailwind";
import { ContactListItem } from "./ContactListItem";
import { DirectMessageBubble } from "./DirectMessageBubble";
import { MessageComposer } from "./MessageComposer";
import { PRESENCE_LABEL, type DirectMessage, type MessageContact } from "./types";
import styles from "./MessagesWorkspace.tailwind";

export interface MessagesWorkspaceProps {
  contactsTitle?: string;
  contacts: MessageContact[];
  activeContactId?: string;
  onSelectContact: (id: string) => void;
  messages: DirectMessage[];
  composerValue: string;
  onComposerChange: (value: string) => void;
  onSubmit: () => void;
  onCall?: (contactId: string) => void;
  onVideoCall?: (contactId: string) => void;
  onCompose?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  disabled?: boolean;
  listPaneWidth?: number;
  defaultListPaneWidth?: number;
  onListPaneWidthChange?: (width: number) => void;
}

/**
 * A direct-messaging workspace — contacts/presence list + a threaded
 * conversation pane with call/video actions, mirroring Messenger/iMessage/
 * Skype/Zoom chat rather than the AI Chat workspace's single agent transcript.
 */
export function MessagesWorkspace({
  contactsTitle = "Messages",
  contacts,
  activeContactId,
  onSelectContact,
  messages,
  composerValue,
  onComposerChange,
  onSubmit,
  onCall,
  onVideoCall,
  onCompose,
  searchQuery: searchQueryProp,
  onSearchChange,
  disabled = false,
  listPaneWidth,
  defaultListPaneWidth = 320,
  onListPaneWidthChange,
}: MessagesWorkspaceProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [internalSearch, setInternalSearch] = useState("");
  const searchQuery = searchQueryProp ?? internalSearch;
  const setSearchQuery = onSearchChange ?? setInternalSearch;

  const activeContact = useMemo(
    () => contacts.find((contact) => contact.id === activeContactId),
    [contacts, activeContactId],
  );

  const filteredContacts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return contacts;

    return contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(query) ||
        contact.lastMessage?.toLowerCase().includes(query),
    );
  }, [contacts, searchQuery]);

  const { unreadContacts, readContacts } = useMemo(() => {
    const unread = filteredContacts.filter((contact) => (contact.unreadCount ?? 0) > 0);
    const read = filteredContacts.filter((contact) => (contact.unreadCount ?? 0) === 0);
    return { unreadContacts: unread, readContacts: read };
  }, [filteredContacts]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  function renderContactList(items: MessageContact[]) {
    return items.map((contact) => (
      <ContactListItem
        key={contact.id}
        contact={contact}
        active={contact.id === activeContactId}
        onClick={() => onSelectContact(contact.id)}
      />
    ));
  }

  return (
    <div className={styles.workspace}>
      <ResizablePane
        width={listPaneWidth}
        defaultWidth={defaultListPaneWidth}
        onWidthChange={onListPaneWidthChange}
        minWidth={260}
        maxWidth={480}
        handleSide="right"
        className={styles.listResizable}
        handleLabel="Resize contacts list"
      >
        <ListPane
          className={styles.listPane}
          bodyClassName={listPaneStyles.bodyInset}
          title={
            <>
              <Icon name="users" size={16} />
              {contactsTitle}
            </>
          }
          headerActions={
            <Button variant="primary" size="md" onClick={onCompose}>
              <Icon name="plus" size={16} />
              New message
            </Button>
          }
          toolbar={
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search conversations"
              aria-label="Search conversations"
              startSlot={<Icon name="search" size={14} />}
            />
          }
        >
          <ScrollArea className={styles.listScroll}>
            <div className={styles.listInner}>
              {filteredContacts.length === 0 ? (
                <EmptyState
                  icon={<Icon name="search" size={20} />}
                  title="No conversations found"
                  description="Try a different name or message preview."
                />
              ) : (
                <>
                  {unreadContacts.length > 0 && (
                    <section className={styles.listSection}>
                      <h3 className={styles.listSectionLabel}>Unread</h3>
                      {renderContactList(unreadContacts)}
                    </section>
                  )}
                  {readContacts.length > 0 && (
                    <section className={styles.listSection}>
                      {unreadContacts.length > 0 && (
                        <h3 className={styles.listSectionLabel}>
                          {searchQuery.trim() ? "Results" : "Recent"}
                        </h3>
                      )}
                      {renderContactList(readContacts)}
                    </section>
                  )}
                </>
              )}
            </div>
          </ScrollArea>
        </ListPane>
      </ResizablePane>
      <div className={styles.thread}>
        {!activeContact ? (
          <div className={styles.emptyPane}>
            <EmptyState
              icon={<Icon name="users" size={22} />}
              title="No conversation selected"
              description="Pick someone from the left to start messaging."
            />
          </div>
        ) : (
          <>
            <div className={styles.threadHeader}>
              <div className={styles.threadHeaderIdentity}>
                <Avatar
                  name={activeContact.name}
                  src={activeContact.avatarSrc}
                  size="md"
                  status={activeContact.isGroup ? undefined : activeContact.status}
                />
                <div>
                  <div className={styles.threadName}>{activeContact.name}</div>
                  {!activeContact.isGroup && activeContact.status && (
                    <div className={styles.threadStatus}>{PRESENCE_LABEL[activeContact.status]}</div>
                  )}
                </div>
              </div>
              <div className={styles.threadHeaderActions}>
                <IconButton icon="phone" label="Call" size="sm" onClick={() => onCall?.(activeContact.id)} />
                <IconButton icon="video" label="Video call" size="sm" onClick={() => onVideoCall?.(activeContact.id)} />
                <IconButton icon="more-vertical" label="More options" size="sm" />
              </div>
            </div>
            <ScrollArea ref={scrollRef} className={styles.threadScroll}>
              <div className={styles.threadInner}>
                {messages.map((message, index) => {
                  const own = message.senderId === "me";
                  const previous = messages[index - 1];
                  const showSender = !own && Boolean(activeContact.isGroup) && previous?.senderId !== message.senderId;
                  return (
                    <DirectMessageBubble key={message.id} message={message} own={own} showSender={showSender} />
                  );
                })}
              </div>
            </ScrollArea>
            <div className={styles.composerDock}>
              <MessageComposer
                value={composerValue}
                onChange={onComposerChange}
                onSubmit={onSubmit}
                disabled={disabled}
                placeholder={`Message ${activeContact.name}…`}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
