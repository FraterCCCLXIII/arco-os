import { useState, type ReactNode } from "react";
import {
  AppsWorkspace,
  BankCryptoWorkspace,
  CalendarSidebar,
  CalendarWorkspace,
  ChatWorkspace,
  ChatSidebar,
  ComposerDrawer,
  ComposerDrawerStack,
  ComposerErrorList,
  ComposerFileChangeActions,
  ComposerFileChangeList,
  ComposerNotice,
  ComposerQueuedList,
  ComposerTaskList,
  type ComposerDrawerToggle,
  type ConversationTabItem,
  ContactsWorkspace,
  EditorToolbar,
  EmailWorkspace,
  FilesWorkspace,
  DesignSystemWorkspace,
  Icon,
  MARKETPLACE_CATEGORIES,
  MessagesWorkspace,
  MiniCalendar,
  NavSidebar,
  NotesWorkspace,
  NotificationsWorkspace,
  SettingsWorkspace,
  SidebarUserFooter,
  SlackWorkspace,
  SocialWorkspace,
  ScheduleWorkspace,
  ScrollArea,
  TasksWorkspace,
  WalletWorkspace,
  MusicWorkspace,
  VisionWorkspace,
  ReaderWorkspace,
  MapsWorkspace,
  CameraWorkspace,
  WeatherWorkspace,
  CalculatorWorkspace,
  BrowserWorkspace,
  PhoneWorkspace,
  ServerWorkspace,
  OrchestratorWorkspace,
  TicketsWorkspace,
  TranscribeWorkspace,
  LifePlanningWorkspace,
  PsycheWorkspace,
  SheetsWorkspace,
  ExtensionsWorkspace,
  PassportWorkspace,
  BentoWorkspace,
  AppPortWorkspace,
  ComposerWorkspace,
  GeneratorWorkspace,
  WireframeWorkspace,
  NodalWorkspace,
  CreativeStudioWorkspace,
  AdaptiveWorkspaceWindowContent,
  type AppsSubpage,
  type BlockFormat,
  type ChatMessage,
  type DirectMessage,
  type FileItem,
  type MarketplaceCategoryId,
  type NotificationItem,
  type ScheduleItem,
  type ScheduleProject,
  type ScheduleStatusFilter,
  type ScheduleView,
  type SlackMessage,
  type TaskItem,
  type TextAlign,
  type TextMark,
} from "longformer-ui";
import type { WorkspaceId } from "./workspace-config";
import { workspaceNavItem } from "./workspace-config";
import type { SocialNetworkId } from "longformer-ui";
import { primaryUser, teamMembers } from "./demo-personas";
import {
  agentTaskDrawerTitle,
  agentTaskItems,
  errorMessageDrawerTitle,
  errorMessageItems,
  fileChangeDrawerTitle,
  fileChangeItems,
  queuedMessageDrawerTitle,
  queuedMessageItems,
} from "./mock-data/chat";

type DemoDrawerVisibility = {
  fileChanges: boolean;
  errors: boolean;
  queued: boolean;
  tasks: boolean;
};

const defaultDrawerVisibility: DemoDrawerVisibility = {
  fileChanges: true,
  errors: true,
  queued: true,
  tasks: true,
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
  usage: import("longformer-ui").UsageStats;
  projectLabel?: ReactNode;
  navItems?: { id: string; label: string }[];
  activeNavId?: string;
  onNavChange?: (id: string) => void;
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

export interface WorkspaceLayoutOptions {
  /** Include workspace sidebars (false for desktop window embedding). */
  includeSidebar?: boolean;
}

export interface WorkspaceLayoutViewModel {
  workspaceId: WorkspaceId;
  setWorkspaceId: (id: WorkspaceId) => void;
  messages: ChatMessage[];
  composerValue: string;
  setComposerValue: (value: string) => void;
  handleSubmit: () => void;
  promptChips: { id: string; label: string }[];
  model: string;
  modelMenuItems: { id: string; label: string; onSelect?: () => void }[];
  demoUsage: import("longformer-ui").UsageStats;
  messageContacts: { id: string; name: string }[];
  activeContactId: string;
  setActiveContactId: (id: string) => void;
  directMessages: Record<string, DirectMessage[]>;
  messageComposerValue: string;
  setMessageComposerValue: (value: string) => void;
  handleSendMessage: () => void;
  slackWorkspaces: unknown[];
  activeSlackWorkspaceId: string;
  setActiveSlackWorkspaceId: (id: string) => void;
  slackNavItems: unknown[];
  slackChannels: unknown[];
  slackDirectMessages: unknown[];
  activeSlackConversationId: string;
  setActiveSlackConversationId: (id: string) => void;
  activeSlackConversationTitle: string;
  activeSlackConversationTopic?: string;
  slackMessages: Record<string, SlackMessage[]>;
  slackComposerValue: string;
  setSlackComposerValue: (value: string) => void;
  handleSlackSubmit: () => void;
  activeSlackProfileMember: unknown;
  setSlackProfileMemberId: (id: string | null) => void;
  handleOpenSlackProfile: (senderId: string) => void;
  socialNetworks: unknown[];
  activeSocialNetworkId: SocialNetworkId;
  setActiveSocialNetworkId: (id: SocialNetworkId) => void;
  twitterNavItems: unknown[];
  facebookShortcuts: unknown[];
  facebookStories: unknown[];
  socialPosts: unknown[];
  socialTrends: unknown[];
  socialNews: unknown[];
  socialSuggestions: unknown[];
  socialBirthdays: unknown;
  socialContactsOnline: unknown[];
  socialComposerValue: string;
  setSocialComposerValue: (value: string) => void;
  handleSocialSubmit: () => void;
  socialFeedTab: string;
  setSocialFeedTab: (tab: string) => void;
  phoneContacts: { id: string; name: string; phone: string }[];
  activePhoneContactId: string;
  setActivePhoneContactId: (id: string) => void;
  contactSearch: string;
  setContactSearch: (value: string) => void;
  dialValue: string;
  setDialValue: (value: string) => void;
  appsSubpage: AppsSubpage;
  setAppsSubpage: (page: AppsSubpage) => void;
  marketplaceCategory: MarketplaceCategoryId;
  setMarketplaceCategory: (id: MarketplaceCategoryId) => void;
  installedApps: unknown[];
  marketplaceApps: unknown[];
  appSearch: string;
  setAppSearch: (value: string) => void;
  runningAppIds: Set<string>;
  handleTrayLaunchApp: (appId: string) => void;
  handleInstallApp: (appId: string) => void;
  recentPages: { id: string; label: string; meta?: string }[];
  privatePages: { id: string; label: string }[];
  teamspacePages: { id: string; label: string }[];
  activePageId: string;
  setActivePageId: (id: string) => void;
  resolveNoteId: (pageId: string) => string;
  activeNote: import("longformer-ui").NotePage;
  notesGraphNodes: import("longformer-ui").NotesGraphNode[];
  notesGraphEdges: import("longformer-ui").NotesGraphEdge[];
  notesView: import("longformer-ui").NotesView;
  setNotesView: (view: import("longformer-ui").NotesView) => void;
  graphPanelOpen: boolean;
  setGraphPanelOpen: (open: boolean) => void;
  handleNoteSelect: (noteId: string) => void;
  activeNoteBacklinks: number;
  activeNoteWordCount: number;
  docFormat: { blockFormat: BlockFormat; marks: TextMark[]; align: TextAlign };
  handleBlockFormatChange: (format: BlockFormat) => void;
  handleToggleMark: (mark: TextMark) => void;
  handleAlignChange: (align: TextAlign) => void;
  docHistoryIndex: number;
  docHistoryLength: number;
  handleDocUndo: () => void;
  handleDocRedo: () => void;
  tasks: TaskItem[];
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>;
  calendarMonth: number;
  calendarYear: number;
  calendarView: import("longformer-ui").CalendarView;
  setCalendarView: (view: import("longformer-ui").CalendarView) => void;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  handlePrevDay: () => void;
  handleNextDay: () => void;
  handlePrevYear: () => void;
  handleNextYear: () => void;
  handleToday: () => void;
  handleCalendarMonthChange: (month: number, year: number) => void;
  selectedDate?: string;
  setSelectedDate: (date?: string) => void;
  calendarEvents: unknown[];
  calendarSources: unknown[];
  enabledCalendarSourceIds: string[];
  handleToggleCalendarSource: (sourceId: string) => void;
  scheduleItems: ScheduleItem[];
  setScheduleItems: React.Dispatch<React.SetStateAction<ScheduleItem[]>>;
  scheduleProjects: ScheduleProject[];
  scheduleView: ScheduleView;
  setScheduleView: (view: ScheduleView) => void;
  scheduleStatusFilter: ScheduleStatusFilter;
  setScheduleStatusFilter: (filter: ScheduleStatusFilter) => void;
  selectedScheduleItem: ScheduleItem | null;
  setSelectedScheduleItem: (item: ScheduleItem | null) => void;
  selectedScheduleProjectId?: string;
  setSelectedScheduleProjectId: (id?: string) => void;
  weekStartISO: string;
  handlePrevWeek: () => void;
  handleNextWeek: () => void;
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  filesBreadcrumb: { label: string; onClick?: () => void }[];
  currentFolder: { items: FileItem[] };
  folders: Record<string, { label: string; items: FileItem[] }>;
  handleOpenFile: (file: FileItem) => void;
  handleToggleStarFile: (id: string) => void;
  handleNewFile: () => void;
  settingsData: unknown;
  desktopWallpaperUrl: string;
  setDesktopWallpaperUrl: (url: string) => void;
  walletExpenses: unknown[];
  bankDashboardData: unknown;
  cryptoWalletData: unknown;
  musicUser: unknown;
  musicLibraryItems: unknown[];
  musicQuickAccess: unknown[];
  musicFeatured: unknown;
  musicMixes: unknown[];
  musicNowPlaying: unknown;
  visionUser: unknown;
  visionFeatured: unknown;
  visionRows: unknown[];
  visionNowPlaying: unknown;
  readerBooks: unknown[];
  mapsSavedPlaces: unknown[];
  mapsDestinations: unknown[];
  mapsRoute: unknown;
  cameraGallery: unknown[];
  weatherLocations: unknown[];
  weatherCurrent: unknown;
  weatherForecast: unknown[];
  serverWorkspaceData: unknown;
  orchestratorWorkspaceData: unknown;
  ticketsWorkspaceData: unknown;
  transcribeWorkspaceData: unknown;
  lifePlanningWorkspaceData: unknown;
  psycheWorkspaceData: unknown;
  sheetsWorkspaceData: unknown;
  extensionsWorkspaceData: unknown;
  passportWorkspaceData: unknown;
  generatedSchema: unknown;
  threads: { id: string; starred?: boolean }[];
  activeThreadId: string;
  setActiveThreadId: (id: string) => void;
  starred: Set<string>;
  setStarred: React.Dispatch<React.SetStateAction<Set<string>>>;
  activeThread?: { subject?: string; messages?: unknown[] };
  mailFolders: { id: string; label: string; icon: string }[];
  emailComposeOpen: boolean;
  setEmailComposeOpen: (open: boolean) => void;
  handleSendEmailReply: (content: { plain: string; html: string }) => void;
  handleSendEmail: (draft: import("longformer-ui").EmailDraft) => void;
  chatConversations: { id: string; label: string; meta?: string; project?: string }[];
  chatTabs: ConversationTabItem[];
  activeChatTabId: string;
  setActiveChatTabId: (id: string) => void;
  handleChatTabClose: (id: string) => void;
  handleChatNewTab: () => void;
  chatNavItems: { id: string; label: string }[];
  chatNavId: string;
  setChatNavId: (id: string) => void;
  chatConversationTitle?: string;
  renderDesktopWorkspace?: () => ReactNode;
}

function selectCalendarDate(
  iso: string,
  month: number,
  year: number,
  onMonthChange: (month: number, year: number) => void,
  onSelectDate: (date: string) => void,
) {
  const [yearPart, monthPart] = iso.split("-").map(Number);
  const targetMonth = monthPart - 1;
  if (targetMonth !== month || yearPart !== year) {
    onMonthChange(targetMonth, yearPart);
  }
  onSelectDate(iso);
}

export function buildWorkspaceLayout(
  vm: WorkspaceLayoutViewModel,
  options: WorkspaceLayoutOptions = {},
): { sidebar?: ReactNode; main: ReactNode } {
  const { includeSidebar = true } = options;
  const workspaceId = vm.workspaceId;
  let sidebar: ReactNode;
  let main: ReactNode;

  switch (workspaceId) {
    case "chat":
      sidebar = includeSidebar ? (
        <ChatSidebar
          conversations={vm.chatConversations}
          activeConversationId={vm.activeChatTabId}
          onConversationSelect={vm.setActiveChatTabId}
          openConversationIds={vm.chatTabs.map((tab) => tab.id)}
          onNewChat={() => vm.setComposerValue("")}
          footerName={primaryUser.name}
          footerMeta="Longformer · Plus"
        />
      ) : undefined;
      main = (
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
        />
      );
      break;

    case "messages":
      sidebar = undefined;
      main = (
        <MessagesWorkspace
          contacts={vm.messageContacts}
          activeContactId={vm.activeContactId}
          onSelectContact={vm.setActiveContactId}
          messages={vm.directMessages[vm.activeContactId] ?? []}
          composerValue={vm.messageComposerValue}
          onComposerChange={vm.setMessageComposerValue}
          onSubmit={vm.handleSendMessage}
        />
      );
      break;

    case "slack":
      sidebar = undefined;
      main = (
        <SlackWorkspace
          workspaces={vm.slackWorkspaces as never}
          activeWorkspaceId={vm.activeSlackWorkspaceId}
          onSelectWorkspace={vm.setActiveSlackWorkspaceId}
          navItems={vm.slackNavItems as never}
          channels={vm.slackChannels as never}
          directMessages={vm.slackDirectMessages as never}
          activeConversationId={vm.activeSlackConversationId}
          onSelectConversation={(id) => {
            vm.setActiveSlackConversationId(id);
            vm.setSlackProfileMemberId(null);
          }}
          conversationTitle={vm.activeSlackConversationTitle}
          conversationTopic={vm.activeSlackConversationTopic}
          messages={vm.slackMessages[vm.activeSlackConversationId] ?? []}
          composerValue={vm.slackComposerValue}
          onComposerChange={vm.setSlackComposerValue}
          onSubmit={vm.handleSlackSubmit}
          unreadMentionCount={4}
          profileMember={vm.activeSlackProfileMember as never}
          profileOpen={Boolean(vm.activeSlackProfileMember)}
          onProfileClose={() => vm.setSlackProfileMemberId(null)}
          onOpenProfile={vm.handleOpenSlackProfile}
          currentUser={{ name: primaryUser.name, status: "online" }}
        />
      );
      break;

    case "social":
      sidebar = undefined;
      main = (
        <SocialWorkspace
          networks={vm.socialNetworks as never}
          activeNetworkId={vm.activeSocialNetworkId as never}
          onSelectNetwork={vm.setActiveSocialNetworkId}
          twitterNavItems={vm.twitterNavItems as never}
          facebookShortcuts={vm.facebookShortcuts as never}
          facebookStories={vm.facebookStories as never}
          posts={vm.socialPosts as never}
          trends={vm.socialTrends as never}
          news={vm.socialNews as never}
          suggestions={vm.socialSuggestions as never}
          birthdays={vm.socialBirthdays as never}
          contactsOnline={vm.socialContactsOnline as never}
          composerValue={vm.socialComposerValue}
          onComposerChange={vm.setSocialComposerValue}
          onComposerSubmit={vm.handleSocialSubmit}
          feedTab={vm.socialFeedTab}
          onFeedTabChange={vm.setSocialFeedTab}
          currentUser={{ name: primaryUser.name, handle: primaryUser.handle }}
        />
      );
      break;

    case "contacts":
      sidebar = undefined;
      main = (
        <ContactsWorkspace
          contacts={vm.phoneContacts}
          activeContactId={vm.activePhoneContactId}
          onSelectContact={vm.setActivePhoneContactId}
          searchQuery={vm.contactSearch}
          onSearchChange={vm.setContactSearch}
          dialValue={vm.dialValue}
          onDialChange={vm.setDialValue}
          onCall={() => undefined}
          onMessageContact={() => vm.setWorkspaceId("messages")}
          onEmailContact={() => vm.setWorkspaceId("email")}
        />
      );
      break;

    case "apps":
      sidebar = includeSidebar ? (
        <NavSidebar
          primaryAction={{
            label: "Browse marketplace",
            icon: "sparkles",
            onClick: () => {
              vm.setAppsSubpage("marketplace");
              vm.setMarketplaceCategory("featured");
            },
          }}
          quickLinks={[
            {
              id: "installed",
              label: "My apps",
              icon: "grid",
              active: vm.appsSubpage === "installed",
              onClick: () => vm.setAppsSubpage("installed"),
            },
            {
              id: "marketplace",
              label: "Marketplace",
              icon: "sparkles",
              active: vm.appsSubpage === "marketplace",
              onClick: () => {
                vm.setAppsSubpage("marketplace");
                vm.setMarketplaceCategory("featured");
              },
            },
          ]}
          sections={
            vm.appsSubpage === "marketplace"
              ? [
                  {
                    id: "categories",
                    title: "Categories",
                    items: MARKETPLACE_CATEGORIES.map((category) => ({
                      id: category.id,
                      label: category.label,
                      leading: <Icon name="layers" size={14} />,
                      active: vm.marketplaceCategory === category.id,
                      onClick: () => vm.setMarketplaceCategory(category.id),
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
          footer={<SidebarUserFooter name={primaryUser.name} meta="Longformer · Plus" />}
        />
      ) : undefined;
      main = (
        <AppsWorkspace
          subpage={vm.appsSubpage}
          marketplaceCategory={vm.marketplaceCategory}
          installedApps={vm.installedApps as never}
          marketplaceApps={vm.marketplaceApps as never}
          searchQuery={vm.appSearch}
          onSearchChange={vm.setAppSearch}
          runningAppIds={vm.runningAppIds}
          onLaunchApp={vm.handleTrayLaunchApp}
          onInstallApp={vm.handleInstallApp}
          onNavigateSubpage={vm.setAppsSubpage}
        />
      );
      break;

    case "notes":
      sidebar = includeSidebar ? (
        <NavSidebar
          primaryAction={{ label: "New page", icon: "plus" }}
          quickLinks={[
            { id: "search", label: "Search", icon: "search" },
            { id: "home", label: "Home", icon: "grid" },
            {
              id: "graph",
              label: "Graph view",
              icon: "globe",
              active: vm.notesView === "graph",
              onClick: () => vm.setNotesView(vm.notesView === "graph" ? "editor" : "graph"),
            },
          ]}
          sections={[
            {
              id: "ideas",
              title: "Ideas",
              items: vm.recentPages
                .filter((page) => page.id === "writing-telepathy")
                .map((page) => ({
                  id: page.id,
                  label: page.label,
                  leading: <Icon name="notebook" size={14} />,
                  trailing: page.meta,
                  active: vm.resolveNoteId(page.id) === vm.activeNote.id,
                  onClick: () => {
                    vm.setActivePageId(page.id);
                    vm.setNotesView("editor");
                  },
                })),
            },
            {
              id: "recents",
              title: "Recents",
              items: vm.recentPages
                .filter((page) => page.id !== "writing-telepathy")
                .map((page) => ({
                  id: page.id,
                  label: page.label,
                  leading: <Icon name="notebook" size={14} />,
                  trailing: page.meta,
                  active: vm.resolveNoteId(page.id) === vm.activeNote.id,
                  onClick: () => {
                    vm.setActivePageId(page.id);
                    vm.setNotesView("editor");
                  },
                })),
            },
            {
              id: "private",
              title: "Private",
              items: vm.privatePages.map((page) => ({
                id: page.id,
                label: page.label,
                leading: <Icon name="notebook" size={14} />,
                active: vm.resolveNoteId(page.id) === vm.activeNote.id,
                onClick: () => {
                  vm.setActivePageId(page.id);
                  vm.setNotesView("editor");
                },
              })),
            },
            {
              id: "teamspaces",
              title: "Teamspaces",
              items: vm.teamspacePages.map((page) => ({
                id: page.id,
                label: page.label,
                leading: <Icon name="folder" size={14} />,
                active: vm.resolveNoteId(page.id) === vm.activeNote.id,
                onClick: () => {
                  vm.setActivePageId(page.id);
                  vm.setNotesView("editor");
                },
              })),
            },
          ]}
          footer={<SidebarUserFooter name={primaryUser.name} meta="Longformer · Plus" />}
        />
      ) : undefined;
      main = (
        <NotesWorkspace
          breadcrumb={[
            { label: "Longformer" },
            { label: vm.activeNote.folder ?? "Notes" },
            { label: vm.activeNote.title },
          ]}
          title={vm.activeNote.title}
          tags={vm.activeNote.tags}
          collaborators={[{ name: primaryUser.name }, { name: teamMembers.riley.name }, { name: teamMembers.jordan.name }]}
          blocks={vm.activeNote.blocks}
          graphNodes={vm.notesGraphNodes}
          graphEdges={vm.notesGraphEdges}
          activeNoteId={vm.activeNote.id}
          view={vm.notesView}
          graphPanelOpen={vm.graphPanelOpen}
          onToggleGraphPanel={() => vm.setGraphPanelOpen(!vm.graphPanelOpen)}
          onViewChange={vm.setNotesView}
          onNoteSelect={vm.handleNoteSelect}
          backlinkCount={vm.activeNoteBacklinks}
          wordCount={vm.activeNoteWordCount}
          toolbar={
            <EditorToolbar
              blockFormat={vm.docFormat.blockFormat}
              onBlockFormatChange={vm.handleBlockFormatChange}
              activeMarks={vm.docFormat.marks}
              onToggleMark={vm.handleToggleMark}
              onInsertLink={() => undefined}
              align={vm.docFormat.align}
              onAlignChange={vm.handleAlignChange}
              canUndo={vm.docHistoryIndex > 0}
              canRedo={vm.docHistoryIndex < vm.docHistoryLength - 1}
              onUndo={vm.handleDocUndo}
              onRedo={vm.handleDocRedo}
            />
          }
        />
      );
      break;

    case "tasks":
      sidebar = includeSidebar ? (
        <ScrollArea style={{ height: "100%", padding: "var(--lf-space-4) var(--lf-space-3)" }}>
          <MiniCalendar
            month={vm.calendarMonth}
            year={vm.calendarYear}
            onPrevMonth={vm.handlePrevMonth}
            onNextMonth={vm.handleNextMonth}
            onToday={vm.handleToday}
            selectedDate={vm.selectedDate}
            onSelectDate={(iso) =>
              selectCalendarDate(
                iso,
                vm.calendarMonth,
                vm.calendarYear,
                vm.handleCalendarMonthChange,
                vm.setSelectedDate,
              )
            }
            highlightedDates={vm.tasks.map((task) => task.dueDateISO).filter((iso): iso is string => Boolean(iso))}
          />
        </ScrollArea>
      ) : undefined;
      main = (
        <TasksWorkspace
          tasks={vm.tasks}
          onToggleComplete={(id) =>
            vm.setTasks((prev) =>
              prev.map((task) =>
                task.id === id
                  ? { ...task, status: task.status === "completed" ? "pending" : "completed" }
                  : task,
              ),
            )
          }
        />
      );
      break;

    case "notifications":
      sidebar = undefined;
      main = (
        <NotificationsWorkspace
          notifications={vm.notifications}
          onMarkAsRead={(id) =>
            vm.setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)))
          }
          onMarkAllAsRead={() => vm.setNotifications((prev) => prev.map((item) => ({ ...item, read: true })))}
        />
      );
      break;

    case "calendar": {
      const calendarHighlightedDates = Array.from(
        new Set(
          (vm.calendarEvents as { date: string; sourceId?: string }[])
            .filter((event) => !event.sourceId || vm.enabledCalendarSourceIds.includes(event.sourceId))
            .map((event) => event.date),
        ),
      );
      sidebar = includeSidebar ? (
        <ScrollArea style={{ height: "100%", padding: "var(--lf-space-4) var(--lf-space-3)" }}>
          <CalendarSidebar
            month={vm.calendarMonth}
            year={vm.calendarYear}
            onPrevMonth={vm.handlePrevMonth}
            onNextMonth={vm.handleNextMonth}
            onToday={vm.handleToday}
            selectedDate={vm.selectedDate}
            onSelectDate={(iso) =>
              selectCalendarDate(
                iso,
                vm.calendarMonth,
                vm.calendarYear,
                vm.handleCalendarMonthChange,
                vm.setSelectedDate,
              )
            }
            highlightedDates={calendarHighlightedDates}
            sources={vm.calendarSources as never}
            enabledSourceIds={vm.enabledCalendarSourceIds}
            onToggleSource={vm.handleToggleCalendarSource}
          />
        </ScrollArea>
      ) : undefined;
      main = (
        <CalendarWorkspace
          month={vm.calendarMonth}
          year={vm.calendarYear}
          view={vm.calendarView}
          onViewChange={vm.setCalendarView}
          weekStartISO={vm.weekStartISO}
          events={vm.calendarEvents as never}
          onPrevMonth={vm.handlePrevMonth}
          onNextMonth={vm.handleNextMonth}
          onPrevWeek={vm.handlePrevWeek}
          onNextWeek={vm.handleNextWeek}
          onPrevDay={vm.handlePrevDay}
          onNextDay={vm.handleNextDay}
          onPrevYear={vm.handlePrevYear}
          onNextYear={vm.handleNextYear}
          onToday={vm.handleToday}
          onMonthChange={vm.handleCalendarMonthChange}
          selectedDate={vm.selectedDate}
          onSelectDate={vm.setSelectedDate}
          sources={vm.calendarSources as never}
          enabledSourceIds={vm.enabledCalendarSourceIds}
          onNewEvent={() => undefined}
        />
      );
      break;
    }

    case "schedule":
      sidebar = includeSidebar ? (
        <NavSidebar
          quickLinks={[
            {
              id: "inbox",
              label: "Inbox",
              icon: "inbox",
              onClick: () => vm.setWorkspaceId("notifications"),
            },
            {
              id: "calendar",
              label: "Calendar",
              icon: "calendar",
              active: true,
            },
          ]}
          sections={[
            {
              id: "channels",
              title: "My channels",
              items: [
                { id: "dashboard", label: "Dashboard", leading: <Icon name="grid" size={14} /> },
                {
                  id: "tasks",
                  label: "Tasks",
                  leading: <Icon name="check" size={14} />,
                  onClick: () => vm.setWorkspaceId("tasks"),
                },
                {
                  id: "messages",
                  label: "Messages",
                  leading: <Icon name="chat" size={14} />,
                  onClick: () => vm.setWorkspaceId("messages"),
                },
                {
                  id: "groups",
                  label: "Groups",
                  leading: <Icon name="hash" size={14} />,
                  onClick: () => vm.setWorkspaceId("slack"),
                },
                {
                  id: "notifications",
                  label: "Notifications",
                  leading: <Icon name="bell" size={14} />,
                  onClick: () => vm.setWorkspaceId("notifications"),
                },
                {
                  id: "settings",
                  label: "Settings",
                  leading: <Icon name="settings" size={14} />,
                  onClick: () => vm.setWorkspaceId("settings"),
                },
              ],
            },
            {
              id: "favourites",
              title: "Favourites",
              items: vm.scheduleProjects.map((project) => ({
                id: project.id,
                label: project.name,
                leading: (
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      background: project.color,
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  />
                ),
                active: vm.selectedScheduleProjectId === project.id,
                onClick: () =>
                  vm.setSelectedScheduleProjectId(
                    vm.selectedScheduleProjectId === project.id ? undefined : project.id,
                  ),
              })),
            },
          ]}
          footer={<SidebarUserFooter name={primaryUser.name} meta="Visual Designer · Longformer" />}
        />
      ) : undefined;
      main = (
        <ScheduleWorkspace
          weekStartISO={vm.weekStartISO}
          month={vm.calendarMonth}
          year={vm.calendarYear}
          items={vm.scheduleItems}
          projects={vm.scheduleProjects}
          view={vm.scheduleView}
          onViewChange={vm.setScheduleView}
          statusFilter={vm.scheduleStatusFilter}
          onStatusFilterChange={vm.setScheduleStatusFilter}
          selectedProjectId={vm.selectedScheduleProjectId}
          onPrevWeek={vm.handlePrevWeek}
          onNextWeek={vm.handleNextWeek}
          onPrevMonth={vm.handlePrevMonth}
          onNextMonth={vm.handleNextMonth}
          onToday={vm.handleToday}
          selectedDate={vm.selectedDate}
          onSelectDate={vm.setSelectedDate}
          selectedItem={vm.selectedScheduleItem}
          onSelectItem={vm.setSelectedScheduleItem}
          onToggleComplete={(id) =>
            vm.setScheduleItems((prev) =>
              prev.map((item) =>
                item.id === id
                  ? { ...item, status: item.status === "closed" ? "backlog" : "closed" }
                  : item,
              ),
            )
          }
          onConfirmAttending={() => vm.setSelectedScheduleItem(null)}
          onDeclineAttending={() => vm.setSelectedScheduleItem(null)}
          onNewProject={() => undefined}
          unreadUpdates={3}
        />
      );
      break;

    case "files":
      sidebar = undefined;
      main = (
        <FilesWorkspace
          breadcrumb={vm.filesBreadcrumb}
          files={vm.currentFolder.items}
          folders={vm.folders as never}
          onOpenFile={vm.handleOpenFile}
          onToggleStar={vm.handleToggleStarFile}
          onNewFile={vm.handleNewFile}
        />
      );
      break;

    case "settings":
      sidebar = undefined;
      main = (
        <SettingsWorkspace
          data={vm.settingsData as never}
          desktopWallpaperUrl={vm.desktopWallpaperUrl}
          onDesktopWallpaperChange={vm.setDesktopWallpaperUrl}
        />
      );
      break;

    case "wallet":
      sidebar = undefined;
      main = <WalletWorkspace expenses={vm.walletExpenses as never} />;
      break;

    case "bank-crypto":
      sidebar = undefined;
      main = (
        <BankCryptoWorkspace
          bank={vm.bankDashboardData as never}
          crypto={vm.cryptoWalletData as never}
        />
      );
      break;

    case "music":
      sidebar = undefined;
      main = (
        <MusicWorkspace
          user={vm.musicUser as never}
          libraryItems={vm.musicLibraryItems as never}
          quickAccess={vm.musicQuickAccess as never}
          featured={vm.musicFeatured as never}
          mixes={vm.musicMixes as never}
          nowPlaying={vm.musicNowPlaying as never}
        />
      );
      break;

    case "vision":
      sidebar = undefined;
      main = (
        <VisionWorkspace
          user={vm.visionUser as never}
          featured={vm.visionFeatured as never}
          rows={vm.visionRows as never}
          nowPlaying={vm.visionNowPlaying as never}
        />
      );
      break;

    case "reader":
      sidebar = undefined;
      main = <ReaderWorkspace books={vm.readerBooks as never} />;
      break;

    case "maps":
      sidebar = undefined;
      main = (
        <MapsWorkspace
          savedPlaces={vm.mapsSavedPlaces as never}
          destinations={vm.mapsDestinations as never}
          route={vm.mapsRoute as never}
        />
      );
      break;

    case "camera":
      sidebar = undefined;
      main = <CameraWorkspace gallery={vm.cameraGallery as never} />;
      break;

    case "weather":
      sidebar = undefined;
      main = (
        <WeatherWorkspace
          locations={vm.weatherLocations as never}
          current={vm.weatherCurrent as never}
          forecast={vm.weatherForecast as never}
        />
      );
      break;

    case "calculator":
      sidebar = undefined;
      main = <CalculatorWorkspace />;
      break;

    case "browser":
      sidebar = undefined;
      main = <BrowserWorkspace />;
      break;

    case "phone":
      sidebar = undefined;
      main = (
        <PhoneWorkspace
          dialValue={vm.dialValue}
          onDialChange={vm.setDialValue}
          contacts={vm.phoneContacts as never}
          activeContact={
            vm.phoneContacts.find((contact) => contact.id === vm.activePhoneContactId) as never
          }
        />
      );
      break;

    case "server":
      sidebar = undefined;
      main = <ServerWorkspace data={vm.serverWorkspaceData as never} />;
      break;

    case "orchestrator":
      sidebar = undefined;
      main = <OrchestratorWorkspace data={vm.orchestratorWorkspaceData as never} />;
      break;

    case "tickets":
      sidebar = undefined;
      main = <TicketsWorkspace data={vm.ticketsWorkspaceData as never} />;
      break;

    case "transcribe":
      sidebar = undefined;
      main = <TranscribeWorkspace data={vm.transcribeWorkspaceData as never} />;
      break;

    case "life-planning":
      sidebar = undefined;
      main = <LifePlanningWorkspace data={vm.lifePlanningWorkspaceData as never} />;
      break;

    case "psyche":
      sidebar = undefined;
      main = <PsycheWorkspace data={vm.psycheWorkspaceData as never} />;
      break;

    case "sheets":
      sidebar = undefined;
      main = <SheetsWorkspace data={vm.sheetsWorkspaceData as never} />;
      break;

    case "extensions":
      sidebar = undefined;
      main = <ExtensionsWorkspace data={vm.extensionsWorkspaceData as never} />;
      break;

    case "passport":
      sidebar = undefined;
      main = <PassportWorkspace data={vm.passportWorkspaceData as never} />;
      break;

    case "bento":
      sidebar = undefined;
      main = <BentoWorkspace />;
      break;

    case "app-port":
      sidebar = undefined;
      main = <AppPortWorkspace />;
      break;

    case "composer":
      sidebar = undefined;
      main = <ComposerWorkspace />;
      break;

    case "generator":
      sidebar = undefined;
      main = <GeneratorWorkspace />;
      break;

    case "desktop":
      sidebar = undefined;
      main = vm.renderDesktopWorkspace?.() ?? null;
      break;

    case "email":
      sidebar = includeSidebar ? (
        <NavSidebar
          sections={[
            {
              id: "folders",
              title: "Mailboxes",
              items: vm.mailFolders.map((folder) => ({
                id: folder.id,
                label: folder.label,
                leading: <Icon name={folder.icon as never} size={15} />,
                active: folder.id === "inbox",
              })),
            },
          ]}
          footer={<SidebarUserFooter name={primaryUser.name} meta={primaryUser.email} />}
        />
      ) : undefined;
      main = (
        <EmailWorkspace
          threads={vm.threads.map((t) => ({ ...t, starred: vm.starred.has(t.id) })) as never}
          activeThreadId={vm.activeThreadId}
          onSelectThread={vm.setActiveThreadId}
          onToggleStar={(id) =>
            vm.setStarred((prev) => {
              const next = new Set(prev);
              if (next.has(id)) next.delete(id);
              else next.add(id);
              return next;
            })
          }
          activeSubject={vm.activeThread?.subject}
          activeMessages={vm.activeThread?.messages as never}
          composeOpen={vm.emailComposeOpen}
          onComposeOpenChange={vm.setEmailComposeOpen}
          onSendReply={vm.handleSendEmailReply}
          onSendEmail={vm.handleSendEmail}
        />
      );
      break;

    case "wireframe":
      sidebar = undefined;
      main = <WireframeWorkspace />;
      break;

    case "nodal":
      sidebar = undefined;
      main = <NodalWorkspace />;
      break;

    case "creative-studio":
      sidebar = undefined;
      main = <CreativeStudioWorkspace />;
      break;

    case "generated":
    default:
      sidebar = undefined;
      main = <DesignSystemWorkspace generatedSchema={vm.generatedSchema as never} />;
      break;
  }

  return { sidebar, main };
}

export function buildWorkspaceWindowContent(
  appId: string,
  vm: Omit<WorkspaceLayoutViewModel, "workspaceId" | "renderDesktopWorkspace">,
  viewport: import("longformer-ui").AppPortViewport = "desktop",
): ReactNode | null {
  if (appId === "desktop") return null;
  const { sidebar, main } = buildWorkspaceLayout(
    { ...vm, workspaceId: appId as WorkspaceId },
    { includeSidebar: true },
  );
  const nav = workspaceNavItem(appId as WorkspaceId);
  if (!nav) return main;

  return (
    <AdaptiveWorkspaceWindowContent
      viewport={viewport}
      title={nav.label}
      icon={nav.icon}
      sidebar={sidebar}
      main={main}
    />
  );
}
