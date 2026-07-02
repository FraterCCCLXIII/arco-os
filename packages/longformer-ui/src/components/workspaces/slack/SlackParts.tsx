import { Fragment } from "react";
import { cx } from "../../../utils/cx";
import { Icon, type IconName } from "../../../icons";
import { Avatar } from "../../primitives/Avatar";
import { IconButton } from "../../primitives/IconButton";
import { CountBadge } from "../../primitives/Badge";
import {
  NavSidebar,
  NavSidebarSectionAction,
  SidebarUserFooterBar,
} from "../../shell/NavSidebar";
import { Textarea } from "../../primitives/Textarea";
import type { SlackMember, SlackMessage, SlackNavItem } from "./types";
import styles from "./SlackWorkspace.module.css";

export interface SlackComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export function SlackComposer({
  value,
  onChange,
  onSubmit,
  placeholder = "Message #general",
  disabled = false,
}: SlackComposerProps) {
  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (value.trim().length > 0) onSubmit();
    }
  }

  return (
    <div className={styles.composer}>
      <div className={styles.composerToolbar}>
        <IconButton icon="bold" label="Bold" size="sm" />
        <IconButton icon="italic" label="Italic" size="sm" />
        <IconButton icon="strikethrough" label="Strikethrough" size="sm" />
        <IconButton icon="link" label="Insert link" size="sm" />
        <IconButton icon="list-ordered" label="Numbered list" size="sm" />
        <IconButton icon="list" label="Bulleted list" size="sm" />
        <IconButton icon="quote" label="Quote" size="sm" />
        <IconButton icon="code" label="Code block" size="sm" />
      </div>
      <Textarea
        className={styles.composerInput}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        maxHeight={160}
        aria-label="Message"
      />
      <div className={styles.composerFooter}>
        <div className={styles.composerActions}>
          <IconButton icon="plus" label="Add" size="sm" />
          <IconButton icon="attach" label="Attach file" size="sm" />
          <IconButton icon="mic" label="Record clip" size="sm" />
        </div>
        <IconButton
          icon="send"
          label="Send message"
          variant="primary"
          size="sm"
          disabled={disabled || value.trim().length === 0}
          onClick={onSubmit}
        />
      </div>
    </div>
  );
}

function renderMessageContent(content: string) {
  const parts = content.split(/(@[\w\s]+|https?:\/\/[^\s]+)/g);
  return parts.map((part, index) => {
    if (part.startsWith("@")) {
      return (
        <span key={`${part}-${index}`} className={styles.mention}>
          {part}
        </span>
      );
    }
    if (/^https?:\/\//.test(part)) {
      return (
        <a key={`${part}-${index}`} href={part} className={styles.link} target="_blank" rel="noreferrer">
          {part}
        </a>
      );
    }
    return <Fragment key={`${part}-${index}`}>{part}</Fragment>;
  });
}

export interface SlackMessageListProps {
  messages: SlackMessage[];
  onOpenProfile?: (senderId: string) => void;
}

export function SlackMessageList({ messages, onOpenProfile }: SlackMessageListProps) {
  return (
    <div className={styles.threadInner}>
      <div className={styles.dayDivider}>Today</div>
      {messages.map((message) => (
        <article key={message.id} className={styles.message}>
          <Avatar name={message.senderName} src={message.senderAvatarSrc} size="md" />
          <div className={styles.messageBody}>
            <div className={styles.messageHead}>
              {onOpenProfile ? (
                <button
                  type="button"
                  className={styles.messageSenderButton}
                  onClick={() => onOpenProfile(message.senderId)}
                >
                  {message.senderName}
                </button>
              ) : (
                <span className={styles.messageSender}>{message.senderName}</span>
              )}
              <time className={styles.messageTimestamp}>{message.timestamp}</time>
            </div>
            <div>{renderMessageContent(message.content)}</div>
          </div>
        </article>
      ))}
    </div>
  );
}

export interface SlackProfilePanelProps {
  member: SlackMember;
  onClose: () => void;
}

export function SlackProfilePanel({ member, onClose }: SlackProfilePanelProps) {
  return (
    <>
      <div className={styles.profileHeader}>
        Profile
        <IconButton icon="close" label="Close profile" size="sm" onClick={onClose} />
      </div>
      <div className={styles.profileHero}>
        <div className={styles.profileAvatarWrap}>
          <Avatar name={member.name} src={member.avatarSrc} size="lg" status={member.status} />
          {member.deactivated && <div className={styles.profileDeactivated}>Deactivated account</div>}
        </div>
        <div className={styles.profileName}>{member.name}</div>
        {member.title && <div className={styles.profileTitle}>{member.title}</div>}
      </div>
      <div className={styles.profileActions}>
        <button type="button" className={styles.profilePrimaryAction}>
          View message history
        </button>
        <IconButton icon="more-vertical" label="More profile actions" size="sm" />
      </div>
      {member.email && (
        <section className={styles.profileSection}>
          <h3 className={styles.profileSectionTitle}>Contact information</h3>
          <div className={styles.profileField}>{member.email}</div>
        </section>
      )}
      <section className={styles.profileSection}>
        <h3 className={styles.profileSectionTitle}>Recent DMs</h3>
        <button type="button" className={styles.profileLink}>
          See all conversations with {member.name}
        </button>
      </section>
    </>
  );
}

export interface SlackSidebarProps {
  workspaceName: string;
  navItems: SlackNavItem[];
  channels: Array<{ id: string; name: string; unread?: boolean; mentionCount?: number }>;
  directMessages: Array<{ id: string; name: string; avatarSrc?: string; status?: "online" | "away" | "offline"; unreadCount?: number; isGroup?: boolean }>;
  activeConversationId?: string;
  onSelectConversation: (id: string) => void;
  unreadMentionCount?: number;
  currentUser: { name: string; avatarSrc?: string; status?: "online" | "away" | "offline" };
}

const NAV_ICON: Record<SlackNavItem["icon"], IconName> = {
  home: "home",
  chat: "chat",
  bell: "bell",
  folder: "folder",
  bookmark: "bookmark",
};

export function SlackSidebar({
  workspaceName,
  navItems,
  channels,
  directMessages,
  activeConversationId,
  onSelectConversation,
  unreadMentionCount = 0,
  currentUser,
}: SlackSidebarProps) {
  const sections = [
    {
      id: "nav",
      items: navItems.map((item) => ({
        id: item.id,
        label: item.label,
        leading: <Icon name={NAV_ICON[item.icon]} size={15} />,
        trailing: item.badgeCount ? <CountBadge count={item.badgeCount} /> : undefined,
        active: item.active,
        className: styles.navListItem,
      })),
    },
    ...(unreadMentionCount > 0
      ? [
          {
            id: "mentions",
            beforeItems: (
              <button type="button" className={styles.unreadMentions}>
                Unread mentions
                <CountBadge count={unreadMentionCount} />
              </button>
            ),
            items: [],
          },
        ]
      : []),
    {
      id: "channels",
      title: "Channels",
      action: <NavSidebarSectionAction label="Add channel" />,
      items: channels.map((channel) => ({
        id: channel.id,
        label: channel.name,
        leading: <span className={styles.channelHash}>#</span>,
        trailing: channel.mentionCount ? <CountBadge count={channel.mentionCount} /> : undefined,
        active: channel.id === activeConversationId,
        className: cx(styles.channelListItem, channel.unread && styles.unreadListItem),
        onClick: () => onSelectConversation(channel.id),
      })),
    },
    {
      id: "dms",
      title: "Direct messages",
      action: <NavSidebarSectionAction label="Start direct message" />,
      items: directMessages.map((dm) => ({
        id: dm.id,
        label: dm.name,
        leading: (
          <span className={styles.dmAvatar}>
            <Avatar name={dm.name} src={dm.avatarSrc} size="sm" status={dm.isGroup ? undefined : dm.status} />
          </span>
        ),
        trailing: dm.unreadCount ? <CountBadge count={dm.unreadCount} /> : undefined,
        active: dm.id === activeConversationId,
        className: cx(styles.dmListItem, (dm.unreadCount ?? 0) > 0 && styles.unreadListItem),
        onClick: () => onSelectConversation(dm.id),
      })),
    },
  ];

  return (
    <NavSidebar
      className={styles.sidebarNav}
      header={
        <div className={styles.sidebarHeader}>
          <button type="button" className={styles.sidebarTitle}>
            <span className={styles.sidebarTitleText}>{workspaceName}</span>
          </button>
          <div className={styles.sidebarHeaderActions}>
            <IconButton icon="settings" label="Workspace settings" size="sm" />
            <IconButton icon="edit" label="New message" size="sm" />
          </div>
        </div>
      }
      sections={sections}
      footer={
        <SidebarUserFooterBar
          name={currentUser.name}
          meta="Active"
          avatarSrc={currentUser.avatarSrc}
          status={currentUser.status ?? "online"}
          actions={
            <>
              <IconButton icon="mic" label="Mute microphone" size="sm" />
              <IconButton icon="phone" label="Start huddle" size="sm" />
              <IconButton icon="settings" label="User settings" size="sm" />
            </>
          }
        />
      }
    />
  );
}

export interface SlackWorkspaceRailProps {
  workspaces: Array<{ id: string; label: string; initials: string; accent?: string; unreadCount?: number }>;
  activeWorkspaceId: string;
  onSelectWorkspace: (id: string) => void;
}

export function SlackWorkspaceRail({ workspaces, activeWorkspaceId, onSelectWorkspace }: SlackWorkspaceRailProps) {
  return (
    <aside className={styles.rail} aria-label="Workspaces">
      <div className={styles.railWorkspaces}>
        {workspaces.map((workspace) => (
          <button
            key={workspace.id}
            type="button"
            className={cx(styles.railWorkspace, workspace.id === activeWorkspaceId && styles.railWorkspaceActive)}
            style={workspace.accent ? ({ ["--ws-accent" as string]: workspace.accent } as React.CSSProperties) : undefined}
            title={workspace.label}
            aria-label={workspace.label}
            aria-current={workspace.id === activeWorkspaceId ? "true" : undefined}
            onClick={() => onSelectWorkspace(workspace.id)}
          >
            {workspace.initials}
            {workspace.unreadCount ? <span className={styles.railBadge}>{workspace.unreadCount}</span> : null}
          </button>
        ))}
      </div>
      <div className={styles.railFooter}>
        <button type="button" className={styles.railAdd} aria-label="Add workspace">
          +
        </button>
      </div>
    </aside>
  );
}
