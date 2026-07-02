import type { ReactNode } from "react";
import {
  AppsWorkspace,
  BankCryptoWorkspace,
  CalendarWorkspace,
  ChatWorkspace,
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
  TasksWorkspace,
  WalletWorkspace,
  MusicWorkspace,
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
import type { SocialNetworkId } from "longformer-ui";

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
  notesBlocks: unknown[];
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
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  handleToday: () => void;
  selectedDate?: string;
  setSelectedDate: (date?: string) => void;
  calendarEvents: unknown[];
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
  walletExpenses: unknown[];
  bankDashboardData: unknown;
  cryptoWalletData: unknown;
  musicUser: unknown;
  musicLibraryItems: unknown[];
  musicQuickAccess: unknown[];
  musicFeatured: unknown;
  musicMixes: unknown[];
  musicNowPlaying: unknown;
  generatedSchema: unknown;
  threads: { id: string; starred?: boolean }[];
  activeThreadId: string;
  setActiveThreadId: (id: string) => void;
  starred: Set<string>;
  setStarred: React.Dispatch<React.SetStateAction<Set<string>>>;
  activeThread?: { subject?: string; messages?: unknown[] };
  mailFolders: { id: string; label: string; icon: string }[];
  chatConversations: { id: string; label: string; meta?: string }[];
  renderDesktopWorkspace?: () => ReactNode;
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
        <NavSidebar
          primaryAction={{ label: "New chat", icon: "plus", onClick: () => vm.setComposerValue("") }}
          quickLinks={[
            { id: "search", label: "Search", icon: "search" },
            { id: "scheduled", label: "Scheduled", icon: "calendar" },
            { id: "plugins", label: "Plugins", icon: "grid" },
          ]}
          sections={[
            {
              id: "conversations",
              title: "Conversations",
              items: vm.chatConversations.map((c) => ({ id: c.id, label: c.label, trailing: c.meta })),
            },
          ]}
          footer={<SidebarUserFooter name="Paul Bloch" meta="Longformer · Plus" />}
        />
      ) : undefined;
      main = (
        <ChatWorkspace
          messages={vm.messages}
          composerValue={vm.composerValue}
          onComposerChange={vm.setComposerValue}
          onSubmit={vm.handleSubmit}
          promptChips={vm.promptChips}
          onPromptChipSelect={(item) => vm.setComposerValue(item.label)}
          model={vm.model}
          modelOptions={vm.modelMenuItems}
          usage={vm.demoUsage}
          thinkingLevel="High"
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
          workspaceName="All Hands"
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
          currentUser={{ name: "Paul Bloch", status: "online" }}
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
          currentUser={{ name: "Paul Bloch", handle: "@paulblochxp" }}
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
          footer={<SidebarUserFooter name="Paul Bloch" meta="Longformer · Plus" />}
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
          ]}
          sections={[
            {
              id: "recents",
              title: "Recents",
              items: vm.recentPages.map((page) => ({
                id: page.id,
                label: page.label,
                leading: <Icon name="notebook" size={14} />,
                trailing: page.meta,
                active: page.id === vm.activePageId,
                onClick: () => vm.setActivePageId(page.id),
              })),
            },
            {
              id: "private",
              title: "Private",
              items: vm.privatePages.map((page) => ({
                id: page.id,
                label: page.label,
                leading: <Icon name="notebook" size={14} />,
                active: page.id === vm.activePageId,
                onClick: () => vm.setActivePageId(page.id),
              })),
            },
            {
              id: "teamspaces",
              title: "Teamspaces",
              items: vm.teamspacePages.map((page) => ({
                id: page.id,
                label: page.label,
                leading: <Icon name="folder" size={14} />,
                active: page.id === vm.activePageId,
                onClick: () => vm.setActivePageId(page.id),
              })),
            },
          ]}
          footer={<SidebarUserFooter name="Paul Bloch" meta="Longformer · Plus" />}
        />
      ) : undefined;
      main = (
        <NotesWorkspace
          breadcrumb={[{ label: "Longformer" }, { label: "Brainstorming" }, { label: "Addressing User Feedback" }]}
          title="Addressing User Feedback"
          collaborators={[{ name: "Paul Bloch" }, { name: "Dana Cho" }, { name: "Marcus Webb" }]}
          blocks={vm.notesBlocks as never}
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
      sidebar = undefined;
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
          calendar={
            <MiniCalendar
              month={vm.calendarMonth}
              year={vm.calendarYear}
              onPrevMonth={vm.handlePrevMonth}
              onNextMonth={vm.handleNextMonth}
              onToday={vm.handleToday}
              selectedDate={vm.selectedDate}
              onSelectDate={vm.setSelectedDate}
              highlightedDates={vm.tasks.map((task) => task.dueDateISO).filter((iso): iso is string => Boolean(iso))}
            />
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

    case "calendar":
      sidebar = undefined;
      main = (
        <CalendarWorkspace
          month={vm.calendarMonth}
          year={vm.calendarYear}
          events={vm.calendarEvents as never}
          onPrevMonth={vm.handlePrevMonth}
          onNextMonth={vm.handleNextMonth}
          onToday={vm.handleToday}
          selectedDate={vm.selectedDate}
          onSelectDate={vm.setSelectedDate}
          onNewEvent={() => undefined}
        />
      );
      break;

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
          footer={<SidebarUserFooter name="Paul Bloch" meta="Visual Designer · Longformer" />}
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
      main = <SettingsWorkspace data={vm.settingsData as never} />;
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
          footer={<SidebarUserFooter name="Paul Bloch" meta="paul@longformer.dev" />}
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
        />
      );
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
): ReactNode | null {
  if (appId === "desktop") return null;
  const { main } = buildWorkspaceLayout({ ...vm, workspaceId: appId as WorkspaceId }, { includeSidebar: false });
  return main;
}
