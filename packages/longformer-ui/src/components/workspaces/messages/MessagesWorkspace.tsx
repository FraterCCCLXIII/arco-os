import { useEffect, useMemo, useRef } from "react";
import { Icon } from "../../../icons";
import { Avatar } from "../../primitives/Avatar";
import { IconButton } from "../../primitives/IconButton";
import { ScrollArea } from "../../primitives/ScrollArea";
import { ResizablePane } from "../../primitives/ResizablePane";
import { EmptyState } from "../../primitives/EmptyState";
import { ContactListItem } from "./ContactListItem";
import { DirectMessageBubble } from "./DirectMessageBubble";
import { MessageComposer } from "./MessageComposer";
import { PRESENCE_LABEL, type DirectMessage, type MessageContact } from "./types";
import styles from "./MessagesWorkspace.module.css";

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
  disabled = false,
  listPaneWidth,
  defaultListPaneWidth = 320,
  onListPaneWidthChange,
}: MessagesWorkspaceProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeContact = useMemo(
    () => contacts.find((contact) => contact.id === activeContactId),
    [contacts, activeContactId]
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className={styles.workspace}>
      <ResizablePane
        width={listPaneWidth}
        defaultWidth={defaultListPaneWidth}
        onWidthChange={onListPaneWidthChange}
        minWidth={240}
        maxWidth={480}
        handleSide="right"
        className={styles.listResizable}
        paneClassName={styles.list}
        handleLabel="Resize contacts list"
      >
        <div className={styles.listHeader}>{contactsTitle}</div>
        <ScrollArea className={styles.listScroll}>
          {contacts.map((contact) => (
            <ContactListItem
              key={contact.id}
              contact={contact}
              active={contact.id === activeContactId}
              onClick={() => onSelectContact(contact.id)}
            />
          ))}
        </ScrollArea>
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
