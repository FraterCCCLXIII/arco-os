import { useEffect, useMemo, useState } from "react";
import {
  AppShell,
  NavRail,
  NavSidebar,
  SidebarUserFooter,
  ChatWorkspace,
  NotesWorkspace,
  EmailWorkspace,
  GeneratedUIWorkspace,
  TasksWorkspace,
  NotificationsWorkspace,
  MessagesWorkspace,
  SlackWorkspace,
  ContactsWorkspace,
  AppsWorkspace,
  MARKETPLACE_CATEGORIES,
  CalendarWorkspace,
  MiniCalendar,
  FilesWorkspace,
  EditorToolbar,
  ChatContextPanel,
  type ChatContextDrawerTab,
  DesktopWorkspace,
  HoverAppTray,
  HoverStatusBar,
  CreateAppModal,
  FloatingChat,
  ThemeProvider,
  useTheme,
  IconButton,
  Icon,
  SettingsWorkspace,
  WalletWorkspace,
  BankCryptoWorkspace,
  type ChatMessage,
  type TaskItem,
  type NotificationItem,
  type DirectMessage,
  type FileItem,
  type BlockFormat,
  type TextMark,
  type TextAlign,
  type PromptChipItem,
  type AppsSubpage,
  type MarketplaceCategoryId,
  type CreateAppPayload,
  type SlackMessage,
  useSurfaceManager,
} from "longformer-ui";
import { activeConversation, demoUsage, promptChips, assistantPromptChips, assistantConversationTabs } from "./mock-data/chat";
import { demoDiffHunks } from "./mock-data/context-drawer";
import { notesBlocks } from "./mock-data/notes";
import { threadMessages, threads } from "./mock-data/email";
import { generatedSchema } from "./mock-data/generated";
import { initialTasks } from "./mock-data/tasks";
import { initialNotifications } from "./mock-data/notifications";
import { messageContacts, messageThreads } from "./mock-data/messages";
import {
  slackChannelMessages,
  slackChannelTopics,
  slackChannels,
  slackDirectMessageThreads,
  slackDirectMessages,
  slackMembers,
  slackNavItems,
  slackSenderToMemberId,
  slackWorkspaces,
} from "./mock-data/slack";
import { phoneContacts } from "./mock-data/contacts";
import { calendarEvents } from "./mock-data/calendar";
import { fileFolders } from "./mock-data/files";
import { chatConversations, mailFolders, privatePages, recentPages, teamspacePages } from "./mock-data/sidebar";
import { createWindowForApp, desktopApps, desktopIcons, initialSurfaceWindows } from "./mock-data/desktop";
import { bankingWidgetTiles } from "./mock-data/banking-widgets";
import { financeWidgetTiles } from "./mock-data/finance-widgets";
import { fitnessWidgetTiles } from "./mock-data/fitness-widgets";
import { widgetDashboardTiles } from "./mock-data/widget-dashboard";
import {
  buildInstalledApps,
  buildMarketplaceApps,
  initialInstalledAppIds,
} from "./mock-data/apps";
import {
  createCustomApp,
  createCustomAppWindow,
  toDesktopApp,
  type CustomApp,
} from "./mock-data/custom-apps";
import { settingsData } from "./mock-data/settings";
import { walletExpenses } from "./mock-data/wallet";
import { bankDashboardData, cryptoWalletData } from "./mock-data/bank-crypto";

type WorkspaceId =
  | "chat"
  | "messages"
  | "slack"
  | "contacts"
  | "notes"
  | "email"
  | "calendar"
  | "files"
  | "generated"
  | "tasks"
  | "notifications"
  | "desktop"
  | "apps"
  | "settings"
  | "wallet"
  | "bank-crypto";

const WORKSPACES: {
  id: WorkspaceId;
  label: string;
  icon: "chat" | "users" | "contact" | "notebook" | "mail" | "calendar" | "folder" | "sparkles" | "check" | "bell" | "monitor" | "app-window" | "hash" | "settings" | "wallet" | "dollar-sign";
}[] = [
  { id: "chat", label: "Chat", icon: "chat" },
  { id: "messages", label: "Messages", icon: "users" },
  { id: "slack", label: "Groups", icon: "hash" },
  { id: "contacts", label: "Contacts", icon: "contact" },
  { id: "notes", label: "Notes", icon: "notebook" },
  { id: "email", label: "Email", icon: "mail" },
  { id: "calendar", label: "Calendar", icon: "calendar" },
  { id: "files", label: "Files", icon: "folder" },
  { id: "wallet", label: "Wallet", icon: "wallet" },
  { id: "bank-crypto", label: "Bank / Crypto", icon: "dollar-sign" },
  { id: "tasks", label: "Tasks", icon: "check" },
  { id: "notifications", label: "Notifications", icon: "bell" },
  { id: "apps", label: "Apps", icon: "app-window" },
  { id: "settings", label: "Settings", icon: "settings" },
  { id: "desktop", label: "Desktop", icon: "monitor" },
  { id: "generated", label: "Generated UI", icon: "sparkles" },
];

interface DocFormatState {
  blockFormat: BlockFormat;
  marks: TextMark[];
  align: TextAlign;
}

const initialDocFormat: DocFormatState = { blockFormat: "paragraph", marks: [], align: "left" };

const MODEL_OPTIONS = [
  { id: "gpt-5.5", label: "GPT-5.5 Medium" },
  { id: "claude-4.6", label: "Claude 4.6 Sonnet" },
  { id: "sonnet-5", label: "Sonnet 5" },
  { id: "composer-2.5", label: "Composer 2.5 Fast" },
];

const APP_WORKSPACE: Partial<Record<string, WorkspaceId>> = {
  finder: "files",
  browser: "chat",
  mail: "email",
  notes: "notes",
  longformer: "chat",
  terminal: "desktop",
  settings: "settings",
  chat: "chat",
  messages: "messages",
  contacts: "contacts",
  email: "email",
  calendar: "calendar",
  files: "files",
  tasks: "tasks",
  notifications: "notifications",
  desktop: "desktop",
  slack: "slack",
  zoom: "contacts",
  phone: "contacts",
  linear: "tasks",
  notion: "notes",
  figma: "generated",
  github: "desktop",
  docker: "desktop",
  spotify: "desktop",
  "1password": "desktop",
  analytics: "generated",
};

function LongformerApp() {
  const { toggleTheme, theme } = useTheme();
  const [workspaceId, setWorkspaceId] = useState<WorkspaceId>("chat");

  const [messages, setMessages] = useState<ChatMessage[]>(activeConversation);
  const [composerValue, setComposerValue] = useState("");
  const [model, setModel] = useState("Sonnet 5");
  const [activeThreadId, setActiveThreadId] = useState<string>(threads[0].id);
  const [starred, setStarred] = useState<Set<string>>(
    () => new Set(threads.filter((t) => t.starred).map((t) => t.id))
  );
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [activePageId, setActivePageId] = useState<string>(recentPages[0].id);
  const [activeContactId, setActiveContactId] = useState<string>(messageContacts[0].id);
  const [messageComposerValue, setMessageComposerValue] = useState("");
  const [directMessages, setDirectMessages] = useState<Record<string, DirectMessage[]>>(messageThreads);
  const [activePhoneContactId, setActivePhoneContactId] = useState<string>(phoneContacts[0].id);
  const [contactSearch, setContactSearch] = useState("");
  const [dialValue, setDialValue] = useState(phoneContacts[0].phone);

  const [activeSlackWorkspaceId, setActiveSlackWorkspaceId] = useState<string>(slackWorkspaces[0].id);
  const [activeSlackConversationId, setActiveSlackConversationId] = useState<string>("ch-events");
  const [slackMessages, setSlackMessages] = useState<Record<string, SlackMessage[]>>(() => ({
    ...slackChannelMessages,
    ...slackDirectMessageThreads,
  }));
  const [slackComposerValue, setSlackComposerValue] = useState("");
  const [slackProfileMemberId, setSlackProfileMemberId] = useState<string | null>(null);

  const today = useMemo(() => new Date(), []);
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);

  const [assistantOpen, setAssistantOpen] = useState(false);
  const [contextDrawerOpen, setContextDrawerOpen] = useState(true);
  const [contextDrawerTab, setContextDrawerTab] = useState<ChatContextDrawerTab>("browser");
  const [contextPanelWidth, setContextPanelWidth] = useState(400);
  const [contextDrawerWidth, setContextDrawerWidth] = useState(340);
  const [floatingChatOpen, setFloatingChatOpen] = useState(false);
  const [appDrawerOpen, setAppDrawerOpen] = useState(false);
  const [assistantTabs, setAssistantTabs] = useState(() => [...assistantConversationTabs]);
  const [activeAssistantTabId, setActiveAssistantTabId] = useState(assistantConversationTabs[2].id);
  const [assistantTabMessages, setAssistantTabMessages] = useState<Record<string, ChatMessage[]>>(() =>
    Object.fromEntries(assistantConversationTabs.map((tab) => [tab.id, []]))
  );
  const [assistantComposerValue, setAssistantComposerValue] = useState("");

  const [docHistory, setDocHistory] = useState<DocFormatState[]>([initialDocFormat]);
  const [docHistoryIndex, setDocHistoryIndex] = useState(0);
  const docFormat = docHistory[docHistoryIndex];

  const [folders, setFolders] = useState(fileFolders);
  const [folderPath, setFolderPath] = useState<string[]>(["root"]);
  const currentFolderId = folderPath[folderPath.length - 1];
  const currentFolder = folders[currentFolderId];

  const surface = useSurfaceManager({
    formFactor: "desktop",
    shell: "macos",
    initialWindows: initialSurfaceWindows,
  });
  const [navRailExpanded, setNavRailExpanded] = useState(false);

  const [appsSubpage, setAppsSubpage] = useState<AppsSubpage>("installed");
  const [marketplaceCategory, setMarketplaceCategory] = useState<MarketplaceCategoryId>("featured");
  const [appSearch, setAppSearch] = useState("");
  const [installedAppIds, setInstalledAppIds] = useState<Set<string>>(() => new Set(initialInstalledAppIds));
  const [customApps, setCustomApps] = useState<CustomApp[]>([]);
  const [createAppOpen, setCreateAppOpen] = useState(false);

  const customDesktopApps = useMemo(() => customApps.map(toDesktopApp), [customApps]);
  const allDesktopApps = useMemo(() => [...desktopApps, ...customDesktopApps], [customDesktopApps]);

  const installedApps = useMemo(
    () => buildInstalledApps(installedAppIds, customApps),
    [installedAppIds, customApps],
  );
  const marketplaceApps = useMemo(() => buildMarketplaceApps(installedAppIds), [installedAppIds]);

  const activeThread = threadMessages[activeThreadId];

  const modelMenuItems = useMemo(
    () => MODEL_OPTIONS.map((option) => ({ id: option.id, label: option.label, onSelect: () => setModel(option.label) })),
    []
  );

  function handleSubmit() {
    if (!composerValue.trim()) return;
    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: composerValue,
      timestamp: "Just now",
    };
    setMessages((prev) => [...prev, userMessage]);
    setComposerValue("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "agent",
          content: "Got it — this is a static demo, so I can't actually run that yet, but here's where the reply would stream in.",
          timestamp: "Just now",
        },
      ]);
    }, 400);
  }

  function handleAssistantSubmit() {
    if (!assistantComposerValue.trim()) return;
    const userMessage: ChatMessage = {
      id: `au-${Date.now()}`,
      role: "user",
      content: assistantComposerValue,
      timestamp: "Just now",
    };
    setAssistantTabMessages((prev) => ({
      ...prev,
      [activeAssistantTabId]: [...(prev[activeAssistantTabId] ?? []), userMessage],
    }));
    setAssistantComposerValue("");
    setTimeout(() => {
      setAssistantTabMessages((prev) => ({
        ...prev,
        [activeAssistantTabId]: [
          ...(prev[activeAssistantTabId] ?? []),
          {
            id: `aa-${Date.now()}`,
            role: "agent",
            content: "This is a static demo panel, so I can't fetch anything real yet — wire this up to your agent backend to get live answers about whatever workspace is open.",
            timestamp: "Just now",
          },
        ],
      }));
    }, 400);
  }

  function handleAssistantNewTab() {
    const id = `assistant-tab-${Date.now()}`;
    setAssistantTabs((prev) => [...prev, { id, label: "New conversation", icon: "sparkles", closable: true }]);
    setAssistantTabMessages((prev) => ({ ...prev, [id]: [] }));
    setActiveAssistantTabId(id);
  }

  function handleAssistantTabClose(id: string) {
    setAssistantTabs((prev) => {
      const next = prev.filter((tab) => tab.id !== id);
      if (next.length === 0) return prev;
      if (activeAssistantTabId === id) {
        setActiveAssistantTabId(next[next.length - 1].id);
      }
      return next;
    });
    setAssistantTabMessages((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function handleAssistantPromptChip(item: PromptChipItem) {
    setAssistantComposerValue(item.label);
  }

  function handleSendMessage() {
    if (!messageComposerValue.trim()) return;
    const newMessage: DirectMessage = {
      id: `dm-${Date.now()}`,
      senderId: "me",
      content: messageComposerValue,
      timestamp: "Just now",
    };
    setDirectMessages((prev) => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] ?? []), newMessage],
    }));
    setMessageComposerValue("");
  }

  function handleSlackSubmit() {
    if (!slackComposerValue.trim() || !activeSlackConversationId) return;
    const newMessage: SlackMessage = {
      id: `slack-${Date.now()}`,
      senderId: "me",
      senderName: "Paul Bloch",
      content: slackComposerValue,
      timestamp: "Just now",
    };
    setSlackMessages((prev) => ({
      ...prev,
      [activeSlackConversationId]: [...(prev[activeSlackConversationId] ?? []), newMessage],
    }));
    setSlackComposerValue("");
  }

  function handleOpenSlackProfile(senderId: string) {
    const memberId = slackSenderToMemberId[senderId];
    if (memberId) setSlackProfileMemberId(memberId);
  }

  const activeSlackChannel = slackChannels.find((channel) => channel.id === activeSlackConversationId);
  const activeSlackDm = slackDirectMessages.find((dm) => dm.id === activeSlackConversationId);
  const activeSlackConversationTitle = activeSlackChannel
    ? activeSlackChannel.name
    : activeSlackDm?.name ?? "Conversation";
  const activeSlackConversationTopic = activeSlackChannel ? slackChannelTopics[activeSlackChannel.id] : undefined;
  const activeSlackProfileMember = slackProfileMemberId ? slackMembers[slackProfileMemberId] ?? null : null;

  function pushDocFormat(next: DocFormatState) {
    setDocHistory((prev) => [...prev.slice(0, docHistoryIndex + 1), next]);
    setDocHistoryIndex((index) => index + 1);
  }

  function handleToggleMark(mark: TextMark) {
    const marks = docFormat.marks.includes(mark)
      ? docFormat.marks.filter((m) => m !== mark)
      : [...docFormat.marks, mark];
    pushDocFormat({ ...docFormat, marks });
  }

  function handleBlockFormatChange(blockFormat: BlockFormat) {
    pushDocFormat({ ...docFormat, blockFormat });
  }

  function handleAlignChange(align: TextAlign) {
    pushDocFormat({ ...docFormat, align });
  }

  function handleDocUndo() {
    setDocHistoryIndex((index) => Math.max(0, index - 1));
  }

  function handleDocRedo() {
    setDocHistoryIndex((index) => Math.min(docHistory.length - 1, index + 1));
  }

  function handlePrevMonth() {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((year) => year - 1);
    } else {
      setCalendarMonth((month) => month - 1);
    }
  }

  function handleNextMonth() {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((year) => year + 1);
    } else {
      setCalendarMonth((month) => month + 1);
    }
  }

  function handleToday() {
    setCalendarMonth(today.getMonth());
    setCalendarYear(today.getFullYear());
    setSelectedDate(undefined);
  }

  function handleOpenFile(file: FileItem) {
    if (file.kind === "folder" && folders[file.id]) {
      setFolderPath((prev) => [...prev, file.id]);
    }
  }

  function handleToggleStarFile(id: string) {
    setFolders((prev) => ({
      ...prev,
      [currentFolderId]: {
        ...prev[currentFolderId],
        items: prev[currentFolderId].items.map((item) => (item.id === id ? { ...item, starred: !item.starred } : item)),
      },
    }));
  }

  function handleNewFile() {
    const newFile: FileItem = {
      id: `new-${Date.now()}`,
      name: "Untitled document",
      kind: "doc",
      sizeLabel: "0 KB",
      owner: { name: "Paul Bloch" },
      modifiedLabel: "Just now",
    };
    setFolders((prev) => ({
      ...prev,
      [currentFolderId]: { ...prev[currentFolderId], items: [newFile, ...prev[currentFolderId].items] },
    }));
  }

  function handleLaunchDesktopApp(appId: string) {
    const app = allDesktopApps.find((a) => a.id === appId);
    if (!app) return;
    const customApp = customApps.find((item) => item.id === appId);
    if (customApp) {
      surface.open(createCustomAppWindow(customApp, surface.windows.length));
      return;
    }
    surface.openApp(app, createWindowForApp);
  }

  function handleSelectDesktopIcon(iconId: string) {
    const icon = desktopIcons.find((item) => item.id === iconId);
    if (icon) handleLaunchDesktopApp(icon.appId);
  }

  function handleCloseDesktopWindow(windowId: string) {
    surface.close(windowId);
  }

  function handleMinimizeDesktopWindow(windowId: string) {
    surface.minimize(windowId);
  }

  function handleMinimizeAllPhoneWindows() {
    surface.windows
      .filter((window) => window.layer === "base" && window.state !== "minimized")
      .forEach((window) => surface.minimize(window.id));
  }

  function handleTrayLaunchApp(appId: string) {
    if (workspaceId === "desktop") {
      handleLaunchDesktopApp(appId);
      return;
    }
    if (customApps.some((app) => app.id === appId)) {
      setWorkspaceId("desktop");
      queueMicrotask(() => handleLaunchDesktopApp(appId));
      return;
    }
    const target = APP_WORKSPACE[appId];
    if (target === "desktop") {
      setWorkspaceId("desktop");
      queueMicrotask(() => handleLaunchDesktopApp(appId));
    } else if (target) {
      setWorkspaceId(target);
    }
  }

  function handleInstallApp(appId: string) {
    setInstalledAppIds((prev) => new Set([...prev, appId]));
  }

  function handleCreateApp(payload: CreateAppPayload) {
    const app = createCustomApp(payload);
    setCustomApps((prev) => [...prev, app]);
    setInstalledAppIds((prev) => new Set([...prev, app.id]));
    setCreateAppOpen(false);

    if (workspaceId !== "desktop") {
      setWorkspaceId("desktop");
    }
    queueMicrotask(() => handleLaunchDesktopApp(app.id));
  }

  function openCreateAppModal() {
    setCreateAppOpen(true);
  }

  function handleTrayFocusWindow(windowId: string) {
    setWorkspaceId("desktop");
    surface.restore(windowId);
    surface.focus(windowId);
  }

  const filesBreadcrumb = folderPath.map((id, index) => ({
    label: folders[id]?.label ?? id,
    onClick: index < folderPath.length - 1 ? () => setFolderPath(folderPath.slice(0, index + 1)) : undefined,
  }));

  const rail = (
    <NavRail
      items={WORKSPACES}
      activeId={workspaceId}
      onSelect={(id) => setWorkspaceId(id as WorkspaceId)}
      expanded={navRailExpanded}
      onExpandedChange={setNavRailExpanded}
      brand="L"
      footer={
        <>
          <IconButton
            icon="sparkles"
            label={assistantOpen ? "Hide AI conversation" : "Ask Longformer"}
            aria-pressed={assistantOpen}
            onClick={() => setAssistantOpen((open) => !open)}
          />
          <IconButton
            icon={theme === "dark" ? "sun" : "moon"}
            label="Toggle theme"
            onClick={toggleTheme}
          />
        </>
      }
    />
  );

  let sidebar: React.ReactNode;
  let main: React.ReactNode;

  if (workspaceId === "chat") {
    sidebar = (
      <NavSidebar
        primaryAction={{ label: "New chat", icon: "plus", onClick: () => setMessages([]) }}
        quickLinks={[
          { id: "search", label: "Search", icon: "search" },
          { id: "scheduled", label: "Scheduled", icon: "calendar" },
          { id: "plugins", label: "Plugins", icon: "grid" },
        ]}
        sections={[
          {
            id: "conversations",
            title: "Conversations",
            items: chatConversations.map((c) => ({ id: c.id, label: c.label, trailing: c.meta })),
          },
        ]}
        footer={<SidebarUserFooter name="Paul Bloch" meta="Longformer · Plus" />}
      />
    );
    main = (
      <ChatWorkspace
        messages={messages}
        composerValue={composerValue}
        onComposerChange={setComposerValue}
        onSubmit={handleSubmit}
        promptChips={promptChips}
        onPromptChipSelect={(item) => setComposerValue(item.label)}
        model={model}
        modelOptions={modelMenuItems}
        usage={demoUsage}
        thinkingLevel="High"
      />
    );
  } else if (workspaceId === "messages") {
    sidebar = undefined;
    main = (
      <MessagesWorkspace
        contacts={messageContacts}
        activeContactId={activeContactId}
        onSelectContact={setActiveContactId}
        messages={directMessages[activeContactId] ?? []}
        composerValue={messageComposerValue}
        onComposerChange={setMessageComposerValue}
        onSubmit={handleSendMessage}
      />
    );
  } else if (workspaceId === "slack") {
    sidebar = undefined;
    main = (
      <SlackWorkspace
        workspaces={slackWorkspaces}
        activeWorkspaceId={activeSlackWorkspaceId}
        onSelectWorkspace={setActiveSlackWorkspaceId}
        workspaceName="All Hands"
        navItems={slackNavItems}
        channels={slackChannels}
        directMessages={slackDirectMessages}
        activeConversationId={activeSlackConversationId}
        onSelectConversation={(id) => {
          setActiveSlackConversationId(id);
          setSlackProfileMemberId(null);
        }}
        conversationTitle={activeSlackConversationTitle}
        conversationTopic={activeSlackConversationTopic}
        messages={slackMessages[activeSlackConversationId] ?? []}
        composerValue={slackComposerValue}
        onComposerChange={setSlackComposerValue}
        onSubmit={handleSlackSubmit}
        unreadMentionCount={4}
        profileMember={activeSlackProfileMember}
        profileOpen={Boolean(activeSlackProfileMember)}
        onProfileClose={() => setSlackProfileMemberId(null)}
        onOpenProfile={handleOpenSlackProfile}
        currentUser={{ name: "Paul Bloch", status: "online" }}
      />
    );
  } else if (workspaceId === "contacts") {
    sidebar = undefined;
    main = (
      <ContactsWorkspace
        contacts={phoneContacts}
        activeContactId={activePhoneContactId}
        onSelectContact={setActivePhoneContactId}
        searchQuery={contactSearch}
        onSearchChange={setContactSearch}
        dialValue={dialValue}
        onDialChange={setDialValue}
        onCall={() => undefined}
        onMessageContact={() => setWorkspaceId("messages")}
        onEmailContact={() => setWorkspaceId("email")}
      />
    );
  } else if (workspaceId === "apps") {
    sidebar = (
      <NavSidebar
        primaryAction={{
          label: "Browse marketplace",
          icon: "sparkles",
          onClick: () => {
            setAppsSubpage("marketplace");
            setMarketplaceCategory("featured");
          },
        }}
        quickLinks={[
          {
            id: "installed",
            label: "My apps",
            icon: "grid",
            active: appsSubpage === "installed",
            onClick: () => setAppsSubpage("installed"),
          },
          {
            id: "marketplace",
            label: "Marketplace",
            icon: "sparkles",
            active: appsSubpage === "marketplace",
            onClick: () => {
              setAppsSubpage("marketplace");
              setMarketplaceCategory("featured");
            },
          },
        ]}
        sections={
          appsSubpage === "marketplace"
            ? [
                {
                  id: "categories",
                  title: "Categories",
                  items: MARKETPLACE_CATEGORIES.map((category) => ({
                    id: category.id,
                    label: category.label,
                    leading: <Icon name="layers" size={14} />,
                    active: marketplaceCategory === category.id,
                    onClick: () => setMarketplaceCategory(category.id),
                  })),
                },
              ]
            : [
                {
                  id: "collections",
                  title: "Collections",
                  items: [
                    {
                      id: "recent",
                      label: "Recently used",
                      leading: <Icon name="refresh" size={14} />,
                    },
                    {
                      id: "pinned",
                      label: "Pinned to dock",
                      leading: <Icon name="star" size={14} />,
                    },
                  ],
                },
              ]
        }
        footer={<SidebarUserFooter name="Paul Bloch" meta="Longformer · Plus" />}
      />
    );
    main = (
      <AppsWorkspace
        subpage={appsSubpage}
        marketplaceCategory={marketplaceCategory}
        installedApps={installedApps}
        marketplaceApps={marketplaceApps}
        searchQuery={appSearch}
        onSearchChange={setAppSearch}
        runningAppIds={new Set(surface.windows.filter((w) => w.state !== "minimized").map((w) => w.appId))}
        onLaunchApp={handleTrayLaunchApp}
        onInstallApp={handleInstallApp}
        onNavigateSubpage={setAppsSubpage}
      />
    );
  } else if (workspaceId === "notes") {
    sidebar = (
      <NavSidebar
        primaryAction={{ label: "New page", icon: "plus" }}
        quickLinks={[
          { id: "search", label: "Search", icon: "search" },
          { id: "home", label: "Home", icon: "grid" },
        ]}
        sections={[
          {
            id: "recents",
            title: "Recents",
            items: recentPages.map((page) => ({
              id: page.id,
              label: page.label,
              leading: <Icon name="notebook" size={14} />,
              trailing: page.meta,
              active: page.id === activePageId,
              onClick: () => setActivePageId(page.id),
            })),
          },
          {
            id: "private",
            title: "Private",
            items: privatePages.map((page) => ({
              id: page.id,
              label: page.label,
              leading: <Icon name="notebook" size={14} />,
              active: page.id === activePageId,
              onClick: () => setActivePageId(page.id),
            })),
          },
          {
            id: "teamspaces",
            title: "Teamspaces",
            items: teamspacePages.map((page) => ({
              id: page.id,
              label: page.label,
              leading: <Icon name="folder" size={14} />,
              active: page.id === activePageId,
              onClick: () => setActivePageId(page.id),
            })),
          },
        ]}
        footer={<SidebarUserFooter name="Paul Bloch" meta="Longformer · Plus" />}
      />
    );
    main = (
      <NotesWorkspace
        breadcrumb={[{ label: "Longformer" }, { label: "Brainstorming" }, { label: "Addressing User Feedback" }]}
        title="Addressing User Feedback"
        collaborators={[{ name: "Paul Bloch" }, { name: "Dana Cho" }, { name: "Marcus Webb" }]}
        blocks={notesBlocks}
        toolbar={
          <EditorToolbar
            blockFormat={docFormat.blockFormat}
            onBlockFormatChange={handleBlockFormatChange}
            activeMarks={docFormat.marks}
            onToggleMark={handleToggleMark}
            onInsertLink={() => undefined}
            align={docFormat.align}
            onAlignChange={handleAlignChange}
            canUndo={docHistoryIndex > 0}
            canRedo={docHistoryIndex < docHistory.length - 1}
            onUndo={handleDocUndo}
            onRedo={handleDocRedo}
          />
        }
      />
    );
  } else if (workspaceId === "tasks") {
    sidebar = undefined;
    main = (
      <TasksWorkspace
        tasks={tasks}
        onToggleComplete={(id) =>
          setTasks((prev) =>
            prev.map((task) =>
              task.id === id
                ? { ...task, status: task.status === "completed" ? "pending" : "completed" }
                : task
            )
          )
        }
        calendar={
          <MiniCalendar
            month={calendarMonth}
            year={calendarYear}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onToday={handleToday}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            highlightedDates={tasks.map((task) => task.dueDateISO).filter((iso): iso is string => Boolean(iso))}
          />
        }
      />
    );
  } else if (workspaceId === "notifications") {
    sidebar = undefined;
    main = (
      <NotificationsWorkspace
        notifications={notifications}
        onMarkAsRead={(id) =>
          setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)))
        }
        onMarkAllAsRead={() => setNotifications((prev) => prev.map((item) => ({ ...item, read: true })))}
      />
    );
  } else if (workspaceId === "calendar") {
    sidebar = undefined;
    main = (
      <CalendarWorkspace
        month={calendarMonth}
        year={calendarYear}
        events={calendarEvents}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        onNewEvent={() => undefined}
      />
    );
  } else if (workspaceId === "files") {
    sidebar = undefined;
    main = (
      <FilesWorkspace
        breadcrumb={filesBreadcrumb}
        files={currentFolder.items}
        folders={folders}
        onOpenFile={handleOpenFile}
        onToggleStar={handleToggleStarFile}
        onNewFile={handleNewFile}
      />
    );
  } else if (workspaceId === "settings") {
    sidebar = undefined;
    main = <SettingsWorkspace data={settingsData} />;
  } else if (workspaceId === "wallet") {
    sidebar = undefined;
    main = <WalletWorkspace expenses={walletExpenses} />;
  } else if (workspaceId === "bank-crypto") {
    sidebar = undefined;
    main = <BankCryptoWorkspace bank={bankDashboardData} crypto={cryptoWalletData} />;
  } else if (workspaceId === "desktop") {
    sidebar = undefined;
    main = (
      <DesktopWorkspace
        shell={surface.shell}
        onShellChange={surface.setShell}
        formFactor={surface.formFactor}
        onFormFactorChange={surface.setFormFactor}
        policy={surface.policy}
        apps={allDesktopApps}
        desktopIcons={desktopIcons}
        surfaceWindows={surface.renderableWindows}
        windows={surface.legacyWindows}
        activeWindowId={surface.activeWindowId}
        wallpaperLabel="Longformer"
        status={{ wifi: true, bluetooth: true, batteryPercent: 84 }}
        onLaunchApp={handleLaunchDesktopApp}
        onSelectDesktopIcon={handleSelectDesktopIcon}
        onFocusWindow={surface.focus}
        onCloseWindow={handleCloseDesktopWindow}
        onMinimizeWindow={handleMinimizeDesktopWindow}
        onMaximizeWindow={surface.maximize}
        onMoveWindow={surface.moveWindow}
        onResizeWindow={surface.resizeWindow}
        onPopPhoneStack={surface.pop}
        onMinimizeAll={handleMinimizeAllPhoneWindows}
        onNextGlance={surface.nextGlance}
        onPrevGlance={surface.prevGlance}
        widgetTiles={[...bankingWidgetTiles, ...financeWidgetTiles, ...fitnessWidgetTiles, ...widgetDashboardTiles]}
        onCreateApp={openCreateAppModal}
      />
    );
  } else if (workspaceId === "email") {
    sidebar = (
      <NavSidebar
        sections={[
          {
            id: "folders",
            title: "Mailboxes",
            items: mailFolders.map((folder) => ({
              id: folder.id,
              label: folder.label,
              leading: <Icon name={folder.icon} size={15} />,
              active: folder.id === "inbox",
            })),
          },
        ]}
        footer={<SidebarUserFooter name="Paul Bloch" meta="paul@longformer.dev" />}
      />
    );
    main = (
      <EmailWorkspace
        threads={threads.map((t) => ({ ...t, starred: starred.has(t.id) }))}
        activeThreadId={activeThreadId}
        onSelectThread={setActiveThreadId}
        onToggleStar={(id) =>
          setStarred((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
          })
        }
        activeSubject={activeThread?.subject}
        activeMessages={activeThread?.messages ?? []}
      />
    );
  } else {
    sidebar = undefined;
    main = <GeneratedUIWorkspace schema={generatedSchema} />;
  }

  const isChatWorkspace = workspaceId === "chat";
  const contextPanelOpen = isChatWorkspace || assistantOpen;
  const showContextDrawer = isChatWorkspace && contextDrawerOpen;
  const showContextConversation = assistantOpen;
  const contextPanelDefaultWidth =
    showContextConversation && showContextDrawer ? 640 : showContextDrawer ? 400 : 360;
  const contextPanelMaxWidth =
    showContextConversation && showContextDrawer ? 920 : showContextDrawer ? 640 : 480;

  useEffect(() => {
    setContextPanelWidth(contextPanelDefaultWidth);
  }, [contextPanelDefaultWidth]);

  return (
    <>
      <AppShell
        rail={rail}
        railResizable={navRailExpanded}
        sidebar={sidebar}
        main={main}
        contextPanel={
          contextPanelOpen ? (
            <ChatContextPanel
              showConversation={showContextConversation}
              tabs={assistantTabs}
              activeTabId={activeAssistantTabId}
              onTabChange={setActiveAssistantTabId}
              onTabClose={handleAssistantTabClose}
              messages={assistantTabMessages[activeAssistantTabId] ?? []}
              composerValue={assistantComposerValue}
              onComposerChange={setAssistantComposerValue}
              onSubmit={handleAssistantSubmit}
              onClose={() => setAssistantOpen(false)}
              onNewConversation={handleAssistantNewTab}
              promptChips={assistantPromptChips}
              onPromptChipSelect={handleAssistantPromptChip}
              model={model}
              modelOptions={modelMenuItems}
              drawerOpen={showContextDrawer}
              onDrawerOpenChange={setContextDrawerOpen}
              drawerTab={contextDrawerTab}
              onDrawerTabChange={setContextDrawerTab}
              drawerWidth={contextDrawerWidth}
              onDrawerWidthChange={setContextDrawerWidth}
              contextPanelWidth={contextPanelWidth}
              diffHunks={demoDiffHunks}
              activeDiffId="diff-gateway"
              folders={folders}
              rootFolderId="root"
            />
          ) : undefined
        }
        contextPanelCollapsed={!contextPanelOpen}
        contextPanelWidth={contextPanelWidth}
        onContextPanelWidthChange={setContextPanelWidth}
        defaultContextPanelWidth={contextPanelDefaultWidth}
        contextPanelMaxWidth={contextPanelMaxWidth}
      />
      <HoverStatusBar
        enabled={workspaceId !== "desktop"}
        shell={surface.shell}
        status={{
          wifi: true,
          bluetooth: true,
          batteryPercent: 84,
          activeAppLabel: WORKSPACES.find((item) => item.id === workspaceId)?.label ?? "Longformer",
        }}
      />
      <HoverAppTray
        enabled={workspaceId !== "desktop"}
        shell={surface.shell}
        formFactor={surface.formFactor}
        apps={allDesktopApps}
        windows={surface.legacyWindows}
        activeWindowId={surface.activeWindowId}
        onLaunchApp={handleTrayLaunchApp}
        onFocusWindow={handleTrayFocusWindow}
        onPopPhoneStack={surface.pop}
        onMinimizeAll={handleMinimizeAllPhoneWindows}
        onNextGlance={surface.nextGlance}
        onPrevGlance={surface.prevGlance}
        onCreateApp={openCreateAppModal}
        onOpenChange={setAppDrawerOpen}
      />
      <CreateAppModal open={createAppOpen} onClose={() => setCreateAppOpen(false)} onCreate={handleCreateApp} />
      <FloatingChat
        open={floatingChatOpen}
        onOpenChange={setFloatingChatOpen}
        appDrawerOpen={appDrawerOpen}
        messages={assistantTabMessages[activeAssistantTabId] ?? []}
        composerValue={assistantComposerValue}
        onComposerChange={setAssistantComposerValue}
        onSubmit={handleAssistantSubmit}
        onNewConversation={handleAssistantNewTab}
        promptChips={assistantPromptChips}
        onPromptChipSelect={handleAssistantPromptChip}
        model={model}
        modelOptions={modelMenuItems}
      />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" className="lf-app-root">
      <LongformerApp />
    </ThemeProvider>
  );
}
