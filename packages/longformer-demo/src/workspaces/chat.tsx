/**
 * Chat workspace layout — the primary agent conversation surface, plus the
 * demo-only composer drawers (file changes, errors, queue, tasks) that
 * preview how a live agent run will dock progress under the composer.
 */
import { useState, type ReactNode } from "react";
import {
  ChatSidebar,
  ChatWorkspace,
  ComposerDrawer,
  ComposerDrawerStack,
  ComposerErrorList,
  ComposerFileChangeActions,
  ComposerFileChangeList,
  ComposerNotice,
  ComposerQueuedList,
  ComposerTaskList,
  type ComposerDrawerToggle,
  type ChatMessage,
  type ComposerTypeaheadItem,
  type ConversationTabItem,
  type UsageStats,
} from "longformer-ui";
import { primaryUser } from "../demo-personas";
import {
  agentTaskDrawerTitle,
  agentTaskItems,
  errorMessageDrawerTitle,
  errorMessageItems,
  fileChangeDrawerTitle,
  fileChangeItems,
  queuedMessageDrawerTitle,
  queuedMessageItems,
} from "../mock-data/chat";
import type { WorkspaceLayoutBuilder } from "./types";

type DemoDrawerVisibility = {
  fileChanges: boolean;
  errors: boolean;
  queued: boolean;
  tasks: boolean;
};

// Hidden by default: these drawers show mock agent-run content until a real
// run feeds them. They can be previewed via the composer's + attach menu.
const defaultDrawerVisibility: DemoDrawerVisibility = {
  fileChanges: false,
  errors: false,
  queued: false,
  tasks: false,
};

interface DemoChatWorkspaceProps {
  messages: ChatMessage[];
  composerValue: string;
  onComposerChange: (value: string) => void;
  onSubmit: () => void;
  tabs: ConversationTabItem[];
  activeTabId: string;
  onTabChange: (id: string) => void;
  onTabClose?: (id: string) => void;
  onNewConversation?: () => void;
  promptChips: { id: string; label: string }[];
  onPromptChipSelect: (item: { id: string; label: string }) => void;
  model: string;
  modelMenuItems: { id: string; label: string; onSelect?: () => void }[];
  usage: UsageStats;
  projectLabel?: ReactNode;
  navItems?: { id: string; label: string }[];
  activeNavId?: string;
  onNavChange?: (id: string) => void;
  onMessageCopy?: (message: ChatMessage) => void;
  onMessageEdit?: (message: ChatMessage) => void;
  onMessageRestore?: (message: ChatMessage) => void;
  onAgentMessageCopy?: (message: ChatMessage) => void;
  onAgentRegenerate?: (message: ChatMessage) => void;
  onAgentThumbsUp?: (message: ChatMessage) => void;
  onAgentThumbsDown?: (message: ChatMessage) => void;
  onAgentShare?: (message: ChatMessage) => void;
  onAgentFork?: (message: ChatMessage) => void;
  typeaheadItems?: ComposerTypeaheadItem[];
  onTypeaheadSelect?: (item: ComposerTypeaheadItem) => void;
}

/** Chat workspace demo shell — drawer visibility toggles live in the + attach menu. */
function DemoChatWorkspace(props: DemoChatWorkspaceProps) {
  const [drawerVisibility, setDrawerVisibility] = useState<DemoDrawerVisibility>(defaultDrawerVisibility);

  function setDrawerVisible(id: keyof DemoDrawerVisibility, visible: boolean) {
    setDrawerVisibility((current) => ({ ...current, [id]: visible }));
  }

  const drawerToggles: ComposerDrawerToggle[] = [
    {
      id: "fileChanges",
      label: "File changes",
      visible: drawerVisibility.fileChanges,
      onVisibleChange: (visible) => setDrawerVisible("fileChanges", visible),
    },
    {
      id: "errors",
      label: "Errors",
      visible: drawerVisibility.errors,
      onVisibleChange: (visible) => setDrawerVisible("errors", visible),
    },
    {
      id: "queued",
      label: "Queued messages",
      visible: drawerVisibility.queued,
      onVisibleChange: (visible) => setDrawerVisible("queued", visible),
    },
    {
      id: "tasks",
      label: "Task progress",
      visible: drawerVisibility.tasks,
      onVisibleChange: (visible) => setDrawerVisible("tasks", visible),
    },
  ];

  return (
    <ChatWorkspace
      messages={props.messages}
      composerValue={props.composerValue}
      onComposerChange={props.onComposerChange}
      onSubmit={props.onSubmit}
      tabs={props.tabs}
      activeTabId={props.activeTabId}
      onTabChange={props.onTabChange}
      onTabClose={props.onTabClose}
      onNewConversation={props.onNewConversation}
      promptChips={props.promptChips}
      onPromptChipSelect={props.onPromptChipSelect}
      model={props.model}
      modelOptions={props.modelMenuItems}
      usage={props.usage}
      projectLabel={props.projectLabel}
      navItems={props.navItems}
      activeNavId={props.activeNavId}
      onNavChange={props.onNavChange}
      onMessageCopy={props.onMessageCopy}
      onMessageEdit={props.onMessageEdit}
      onMessageRestore={props.onMessageRestore}
      onAgentMessageCopy={props.onAgentMessageCopy}
      onAgentRegenerate={props.onAgentRegenerate}
      onAgentThumbsUp={props.onAgentThumbsUp}
      onAgentThumbsDown={props.onAgentThumbsDown}
      onAgentShare={props.onAgentShare}
      onAgentFork={props.onAgentFork}
      typeaheadItems={props.typeaheadItems}
      onTypeaheadSelect={props.onTypeaheadSelect}
      composerDrawer={
        <ComposerDrawerStack>
          {drawerVisibility.fileChanges ? (
            <ComposerDrawer
              title={fileChangeDrawerTitle}
              defaultOpen
              actions={
                <ComposerFileChangeActions onStop={() => undefined} onReview={() => undefined} />
              }
            >
              <ComposerFileChangeList items={fileChangeItems} />
            </ComposerDrawer>
          ) : null}
          {drawerVisibility.errors ? (
            <ComposerDrawer title={errorMessageDrawerTitle} tone="danger" defaultOpen={false}>
              <ComposerErrorList items={errorMessageItems} />
            </ComposerDrawer>
          ) : null}
          {drawerVisibility.queued ? (
            <ComposerDrawer title={queuedMessageDrawerTitle} defaultOpen={false}>
              <ComposerQueuedList items={queuedMessageItems} />
            </ComposerDrawer>
          ) : null}
          {drawerVisibility.tasks ? (
            <ComposerDrawer title={agentTaskDrawerTitle}>
              <ComposerTaskList items={agentTaskItems} />
            </ComposerDrawer>
          ) : null}
        </ComposerDrawerStack>
      }
      onAddFile={() => undefined}
      drawerToggles={drawerToggles}
      composerNotice={<DemoComposerNotice />}
    />
  );
}

/** Example of a dismissible bottom notification docked below the chat composer. */
function DemoComposerNotice() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <ComposerNotice actionLabel="Upgrade Plan" onDismiss={() => setDismissed(true)}>
      Upgrade to Team to unlock all of Longformer&rsquo;s features and more credits
    </ComposerNotice>
  );
}

export const buildChatLayout: WorkspaceLayoutBuilder = (vm, { includeSidebar }) => ({
  sidebar: includeSidebar ? (
    <ChatSidebar
      conversations={vm.chatConversations}
      activeConversationId={vm.activeChatTabId}
      onConversationSelect={vm.setActiveChatTabId}
      openConversationIds={vm.chatTabs.map((tab) => tab.id)}
      onNewChat={vm.handleChatNewTab}
      footerName={primaryUser.name}
      footerMeta="Longformer · Plus"
    />
  ) : undefined,
  main: (
    <DemoChatWorkspace
      messages={vm.messages}
      composerValue={vm.composerValue}
      onComposerChange={vm.setComposerValue}
      onSubmit={vm.handleSubmit}
      tabs={vm.chatTabs}
      activeTabId={vm.activeChatTabId}
      onTabChange={vm.setActiveChatTabId}
      onTabClose={vm.handleChatTabClose}
      onNewConversation={vm.handleChatNewTab}
      promptChips={vm.promptChips}
      onPromptChipSelect={(item) => vm.setComposerValue(item.label)}
      model={vm.model}
      modelMenuItems={vm.modelMenuItems}
      usage={vm.demoUsage}
      projectLabel="Longformer"
      navItems={vm.chatNavItems}
      activeNavId={vm.chatNavId}
      onNavChange={vm.setChatNavId}
      onMessageCopy={vm.handleChatMessageCopy}
      onMessageEdit={vm.handleChatMessageEdit}
      onMessageRestore={vm.handleChatMessageRestore}
      onAgentMessageCopy={vm.handleChatAgentMessageCopy}
      onAgentRegenerate={vm.handleChatAgentRegenerate}
      onAgentThumbsUp={(message) => vm.handleChatAgentFeedback(message, "up")}
      onAgentThumbsDown={(message) => vm.handleChatAgentFeedback(message, "down")}
      onAgentShare={vm.handleChatAgentShare}
      onAgentFork={vm.handleChatAgentFork}
      typeaheadItems={vm.composerTypeaheadItems}
      onTypeaheadSelect={vm.handleTypeaheadSelect}
    />
  ),
});
