import { useEffect, useMemo, useRef } from "react";
import { Icon } from "../../../icons";
import { IconButton } from "../../primitives/IconButton";
import { ScrollArea } from "../../primitives/ScrollArea";
import { ResizablePane } from "../../primitives/ResizablePane";
import { SidebarPane } from "../../shell/NavSidebar";
import { EmptyState } from "../../primitives/EmptyState";
import {
  SlackComposer,
  SlackMessageList,
  SlackProfilePanel,
  SlackSidebar,
  SlackWorkspaceRail,
} from "./SlackParts";
import type {
  SlackChannel,
  SlackDirectMessage,
  SlackMember,
  SlackMessage,
  SlackNavItem,
  SlackWorkspaceItem,
} from "./types";
import styles from "./SlackWorkspace.module.css";

export interface SlackWorkspaceProps {
  workspaces: SlackWorkspaceItem[];
  activeWorkspaceId: string;
  onSelectWorkspace: (id: string) => void;
  workspaceName: string;
  navItems: SlackNavItem[];
  channels: SlackChannel[];
  directMessages: SlackDirectMessage[];
  activeConversationId?: string;
  onSelectConversation: (id: string) => void;
  conversationTitle: string;
  conversationTopic?: string;
  messages: SlackMessage[];
  composerValue: string;
  onComposerChange: (value: string) => void;
  onSubmit: () => void;
  unreadMentionCount?: number;
  profileMember?: SlackMember | null;
  profileOpen?: boolean;
  onProfileClose?: () => void;
  onOpenProfile?: (memberId: string) => void;
  currentUser: { name: string; avatarSrc?: string; status?: "online" | "away" | "offline" };
  disabled?: boolean;
  sidebarWidth?: number;
  defaultSidebarWidth?: number;
  onSidebarWidthChange?: (width: number) => void;
  profilePaneWidth?: number;
  defaultProfilePaneWidth?: number;
  onProfilePaneWidthChange?: (width: number) => void;
}

/**
 * Slack-style team messaging workspace: workspace rail, channel/DM sidebar,
 * threaded channel view with rich composer, and optional member profile panel.
 */
export function SlackWorkspace({
  workspaces,
  activeWorkspaceId,
  onSelectWorkspace,
  workspaceName,
  navItems,
  channels,
  directMessages,
  activeConversationId,
  onSelectConversation,
  conversationTitle,
  conversationTopic,
  messages,
  composerValue,
  onComposerChange,
  onSubmit,
  unreadMentionCount,
  profileMember,
  profileOpen = false,
  onProfileClose,
  onOpenProfile,
  currentUser,
  disabled = false,
  sidebarWidth,
  defaultSidebarWidth = 260,
  onSidebarWidthChange,
  profilePaneWidth,
  defaultProfilePaneWidth = 320,
  onProfilePaneWidthChange,
}: SlackWorkspaceProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasConversation = Boolean(activeConversationId);

  const composerPlaceholder = useMemo(() => {
    if (channels.some((channel) => channel.id === activeConversationId)) {
      return `Message #${conversationTitle.replace(/^#/, "")}`;
    }
    return `Message ${conversationTitle}`;
  }, [activeConversationId, channels, conversationTitle]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, activeConversationId]);

  return (
    <div className={styles.workspace}>
      <SlackWorkspaceRail
        workspaces={workspaces}
        activeWorkspaceId={activeWorkspaceId}
        onSelectWorkspace={onSelectWorkspace}
      />

      <SidebarPane
        width={sidebarWidth}
        defaultWidth={defaultSidebarWidth}
        onWidthChange={onSidebarWidthChange}
        minWidth={220}
        maxWidth={360}
        className={styles.sidebarResizable}
        paneClassName={styles.sidebarPane}
        handleLabel="Resize channels sidebar"
      >
        <SlackSidebar
          workspaceName={workspaceName}
          navItems={navItems}
          channels={channels}
          directMessages={directMessages}
          activeConversationId={activeConversationId}
          onSelectConversation={onSelectConversation}
          unreadMentionCount={unreadMentionCount}
          currentUser={currentUser}
        />
      </SidebarPane>

      <div className={styles.main}>
        {!hasConversation ? (
          <div className={styles.emptyPane}>
            <EmptyState
              icon={<Icon name="hash" size={22} />}
              title="Pick a channel or DM"
              description="Choose a conversation from the sidebar to start reading and replying."
            />
          </div>
        ) : (
          <>
            <header className={styles.channelHeader}>
              <div className={styles.channelHeaderIdentity}>
                <div className={styles.channelHeaderTitle}>
                  {channels.some((channel) => channel.id === activeConversationId) && (
                    <Icon name="hash" size={16} />
                  )}
                  {conversationTitle.replace(/^#/, "")}
                </div>
                {conversationTopic && <div className={styles.channelHeaderTopic}>{conversationTopic}</div>}
              </div>
              <div className={styles.channelHeaderActions}>
                <IconButton icon="users" label="View members" size="sm" />
                <IconButton icon="search" label="Search in conversation" size="sm" />
                <IconButton icon="phone" label="Start huddle" size="sm" />
                <IconButton icon="more-vertical" label="More actions" size="sm" />
              </div>
            </header>

            <ScrollArea ref={scrollRef} className={styles.threadScroll}>
              <SlackMessageList messages={messages} onOpenProfile={onOpenProfile} />
            </ScrollArea>

            <div className={styles.composerDock}>
              <SlackComposer
                value={composerValue}
                onChange={onComposerChange}
                onSubmit={onSubmit}
                placeholder={composerPlaceholder}
                disabled={disabled}
              />
            </div>
          </>
        )}
      </div>

      {profileOpen && profileMember && onProfileClose && (
        <ResizablePane
          width={profilePaneWidth}
          defaultWidth={defaultProfilePaneWidth}
          onWidthChange={onProfilePaneWidthChange}
          minWidth={280}
          maxWidth={420}
          handleSide="left"
          className={styles.profileResizable}
          paneClassName={styles.profilePane}
          handleLabel="Resize profile panel"
        >
          <ScrollArea className={styles.profileScroll}>
            <SlackProfilePanel member={profileMember} onClose={onProfileClose} />
          </ScrollArea>
        </ResizablePane>
      )}
    </div>
  );
}
