import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AppShell,
  NavRail,
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
  WorkspaceWindowShell,
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
import { createWindowForApp, desktopIcons, initialSurfaceWindows, isDesktopLaunchableWorkspace } from "./mock-data/desktop";
import { WORKSPACES, workspacesToDesktopApps, type WorkspaceId } from "./workspace-config";
import { buildWorkspaceLayout, buildWorkspaceWindowContent } from "./workspace-layout";
import { bankDashboardData, cryptoWalletData } from "./mock-data/bank-crypto";

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
  ...Object.fromEntries(WORKSPACES.map((workspace) => [workspace.id, workspace.id])),
  zoom: "contacts",
  linear: "tasks",
  notion: "notes",
  figma: "generated",
  github: "desktop",
  docker: "desktop",
  spotify: "desktop",
  "1password": "desktop",
  analytics: "generated",
} as Partial<Record<string, WorkspaceId>>;

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
  const allDesktopApps = useMemo(
    () => [...workspacesToDesktopApps(), ...customDesktopApps],
    [customDesktopApps],
  );

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
    if (appId === "desktop") return;

    const existing = surface.windows.find(
      (window) => window.appId === appId && window.state !== "minimized" && window.layer === "base",
    );
    if (existing) {
      surface.focus(existing.id);
      return;
    }

    const app = allDesktopApps.find((a) => a.id === appId);
    if (!app) return;
    const customApp = customApps.find((item) => item.id === appId);
    if (customApp) {
      surface.open(createCustomAppWindow(customApp, surface.windows.length));
      return;
    }
    if (!isDesktopLaunchableWorkspace(appId)) return;
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

  const workspaceViewModelBase = useMemo(
    () => ({
      setWorkspaceId,
      messages,
      composerValue,
      setComposerValue,
      handleSubmit,
      promptChips,
      model,
      modelMenuItems,
      demoUsage,
      messageContacts,
      activeContactId,
      setActiveContactId,
      directMessages,
      messageComposerValue,
      setMessageComposerValue,
      handleSendMessage,
      slackWorkspaces,
      activeSlackWorkspaceId,
      setActiveSlackWorkspaceId,
      slackNavItems,
      slackChannels,
      slackDirectMessages,
      activeSlackConversationId,
      setActiveSlackConversationId,
      activeSlackConversationTitle,
      activeSlackConversationTopic,
      slackMessages,
      slackComposerValue,
      setSlackComposerValue,
      handleSlackSubmit,
      activeSlackProfileMember,
      setSlackProfileMemberId,
      handleOpenSlackProfile,
      phoneContacts,
      activePhoneContactId,
      setActivePhoneContactId,
      contactSearch,
      setContactSearch,
      dialValue,
      setDialValue,
      appsSubpage,
      setAppsSubpage,
      marketplaceCategory,
      setMarketplaceCategory,
      installedApps,
      marketplaceApps,
      appSearch,
      setAppSearch,
      runningAppIds: new Set(surface.windows.filter((w) => w.state !== "minimized").map((w) => w.appId)),
      handleTrayLaunchApp,
      handleInstallApp,
      recentPages,
      privatePages,
      teamspacePages,
      activePageId,
      setActivePageId,
      notesBlocks,
      docFormat,
      handleBlockFormatChange,
      handleToggleMark,
      handleAlignChange,
      docHistoryIndex,
      docHistoryLength: docHistory.length,
      handleDocUndo,
      handleDocRedo,
      tasks,
      setTasks,
      calendarMonth,
      calendarYear,
      handlePrevMonth,
      handleNextMonth,
      handleToday,
      selectedDate,
      setSelectedDate,
      calendarEvents,
      notifications,
      setNotifications,
      filesBreadcrumb,
      currentFolder,
      folders,
      handleOpenFile,
      handleToggleStarFile,
      handleNewFile,
      settingsData,
      walletExpenses,
      bankDashboardData,
      cryptoWalletData,
      generatedSchema,
      threads,
      activeThreadId,
      setActiveThreadId,
      starred,
      setStarred,
      activeThread,
      mailFolders,
      chatConversations,
    }),
    [
      messages,
      composerValue,
      model,
      modelMenuItems,
      activeContactId,
      directMessages,
      messageComposerValue,
      activeSlackWorkspaceId,
      activeSlackConversationId,
      activeSlackConversationTitle,
      activeSlackConversationTopic,
      slackMessages,
      slackComposerValue,
      activeSlackProfileMember,
      activePhoneContactId,
      contactSearch,
      dialValue,
      appsSubpage,
      marketplaceCategory,
      installedApps,
      marketplaceApps,
      appSearch,
      surface.windows,
      activePageId,
      docFormat,
      docHistoryIndex,
      docHistory.length,
      tasks,
      calendarMonth,
      calendarYear,
      selectedDate,
      notifications,
      filesBreadcrumb,
      currentFolder,
      folders,
      activeThreadId,
      starred,
      activeThread,
    ],
  );

  const renderDesktopWindowContent = useCallback(
    (window: import("longformer-ui").SurfaceWindow) => {
      const content = buildWorkspaceWindowContent(window.appId, workspaceViewModelBase);
      if (!content) return null;
      return <WorkspaceWindowShell>{content}</WorkspaceWindowShell>;
    },
    [workspaceViewModelBase],
  );

  const renderDesktopWorkspace = useCallback(
    () => (
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
        renderWindowContent={renderDesktopWindowContent}
      />
    ),
    [
      allDesktopApps,
      renderDesktopWindowContent,
      surface.activeWindowId,
      surface.formFactor,
      surface.legacyWindows,
      surface.policy,
      surface.renderableWindows,
      surface.shell,
    ],
  );

  const { sidebar, main } = buildWorkspaceLayout(
    {
      ...workspaceViewModelBase,
      workspaceId,
      renderDesktopWorkspace,
    },
    { includeSidebar: true },
  );


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
