/**
 * Demo shell — composes the domain state slices (src/state/) into the
 * AppShell layout: nav rail, workspace sidebar/main, assistant context
 * panel, and the hover chrome used outside the desktop workspace.
 *
 * This file owns *composition only*: state lives in the slice hooks, mock
 * data in mock-data/, and workspace routing in workspaces/registry.tsx.
 * When the real agent backend lands, it replaces slices — not this shell.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import {
  AppShell,
  NavRail,
  NavRailBrandMark,
  SidebarUserFooterMenu,
  ChatContextPanel,
  type ChatContextDrawerTab,
  DesktopWorkspace,
  HoverAppTray,
  HoverAssistantBubble,
  HoverNavRail,
  HoverStatusBar,
  CreateAppModal,
  FloatingChat,
  ThemeProvider,
  useTheme,
  formFactorToAppPortViewport,
  type SurfaceWindow,
} from "longformer-ui";
import { ConnectApiModal } from "./components/ConnectApiModal";
import { primaryUser } from "./demo-personas";
import { demoDiffHunks } from "./mock-data/context-drawer";
import { desktopIcons } from "./mock-data/desktop";
import {
  WORKSPACES,
  moveAppToTray,
  moveWorkspaceToOverflow,
  moveWorkspaceToRail,
  removeAppFromTray,
  reorderTrayPinnedIds,
  reorderPinnedWorkspaces,
  type WorkspaceId,
} from "./workspace-config";
import { useWorkspaceNavigation } from "./useWorkspaceNavigation";
import { buildWorkspaceLayout, buildWorkspaceWindowContent } from "./workspaces/registry";
import type { WorkspaceViewModel } from "./workspaces/types";
import {
  allWidgetTiles,
  staticWorkspaceData,
  useAssistantState,
  useChatState,
  useCommsState,
  useDesktopState,
  useEmailState,
  useFilesState,
  useModelSelection,
  useNotesState,
  usePlannerState,
  useProductivityState,
} from "./state";

function LongformerApp() {
  const { setTheme, theme } = useTheme();
  const { workspaceId, setWorkspaceId } = useWorkspaceNavigation();

  // -------------------------------------------------------------------------
  // Domain state slices
  //
  // Each hook owns one product domain end to end (state + handlers). Their
  // return keys match WorkspaceLayoutViewModel, so composing the view model
  // below is a plain spread with no renaming.
  // -------------------------------------------------------------------------
  const chat = useChatState();
  const assistant = useAssistantState();
  const comms = useCommsState();
  const email = useEmailState();
  const notes = useNotesState();
  const planner = usePlannerState();
  const files = useFilesState();
  const productivity = useProductivityState();
  const modelSelection = useModelSelection();
  const desktop = useDesktopState({ workspaceId, setWorkspaceId });

  // -------------------------------------------------------------------------
  // Shell chrome state — panel widths, hover chrome, floating chat. Small
  // enough to stay here: it belongs to the shell itself, not to a workspace.
  // -------------------------------------------------------------------------
  const [navRailExpanded, setNavRailExpanded] = useState(false);
  const [contextDrawerOpen, setContextDrawerOpen] = useState(true);
  const [contextDrawerTab, setContextDrawerTab] = useState<ChatContextDrawerTab>("browser");
  const [contextPanelWidth, setContextPanelWidth] = useState(400);
  const [contextDrawerWidth, setContextDrawerWidth] = useState(340);
  const [floatingChatOpen, setFloatingChatOpen] = useState(false);
  const [appDrawerOpen, setAppDrawerOpen] = useState(false);

  const rail = (
    <NavRail
      items={desktop.railWorkspaces}
      overflowItems={desktop.overflowWorkspaces}
      activeId={workspaceId}
      onSelect={(id) => setWorkspaceId(id as WorkspaceId)}
      onMoveToRail={(id, index) =>
        desktop.setPinnedWorkspaceIds((prev) => moveWorkspaceToRail(prev, id as WorkspaceId, index))
      }
      onMoveToOverflow={(id) =>
        desktop.setPinnedWorkspaceIds((prev) => moveWorkspaceToOverflow(prev, id as WorkspaceId))
      }
      onReorder={(fromIndex, toIndex) =>
        desktop.setPinnedWorkspaceIds((prev) => reorderPinnedWorkspaces(prev, fromIndex, toIndex))
      }
      expanded={navRailExpanded}
      onExpandedChange={setNavRailExpanded}
      brand={<NavRailBrandMark />}
      footer={
        <SidebarUserFooterMenu
          name={primaryUser.name}
          meta="Longformer · Plus"
          compact={!navRailExpanded}
          theme={theme}
          onThemeChange={setTheme}
          items={[
            {
              id: "settings",
              label: "Settings",
              icon: "settings",
              onSelect: () => setWorkspaceId("settings"),
            },
            { id: "profile", label: "Profile", icon: "contact" },
            { id: "upgrade", label: "Upgrade plan", icon: "sparkles" },
            { id: "logout", label: "Log out", icon: "external-link", danger: true, separatorAbove: true },
          ]}
        />
      }
    />
  );

  // -------------------------------------------------------------------------
  // Workspace view model
  //
  // The slices already memoize themselves, so this memo only re-creates the
  // bag when a slice identity changes — the layout switch then re-renders
  // just the active workspace.
  // -------------------------------------------------------------------------
  const workspaceViewModelBase = useMemo<WorkspaceViewModel>(
    () => ({
      setWorkspaceId,
      ...chat,
      ...comms,
      ...email,
      ...notes,
      ...planner,
      ...files,
      ...productivity,
      ...modelSelection,
      ...staticWorkspaceData,
      // Desktop-owned fields consumed by non-desktop workspaces (apps page, tray).
      appsSubpage: desktop.appsSubpage,
      setAppsSubpage: desktop.setAppsSubpage,
      marketplaceCategory: desktop.marketplaceCategory,
      setMarketplaceCategory: desktop.setMarketplaceCategory,
      installedApps: desktop.installedApps,
      marketplaceApps: desktop.marketplaceApps,
      appSearch: desktop.appSearch,
      setAppSearch: desktop.setAppSearch,
      runningAppIds: new Set(
        desktop.surface.windows.filter((w) => w.state !== "minimized").map((w) => w.appId),
      ),
      handleTrayLaunchApp: desktop.handleTrayLaunchApp,
      handleInstallApp: desktop.handleInstallApp,
      desktopWallpaperUrl: desktop.desktopWallpaperUrl,
      setDesktopWallpaperUrl: desktop.setDesktopWallpaperUrl,
    }),
    [
      setWorkspaceId,
      chat,
      comms,
      email,
      notes,
      planner,
      files,
      productivity,
      modelSelection,
      desktop.appsSubpage,
      desktop.setAppsSubpage,
      desktop.marketplaceCategory,
      desktop.setMarketplaceCategory,
      desktop.installedApps,
      desktop.marketplaceApps,
      desktop.appSearch,
      desktop.setAppSearch,
      desktop.surface.windows,
      desktop.handleTrayLaunchApp,
      desktop.handleInstallApp,
      desktop.desktopWallpaperUrl,
      desktop.setDesktopWallpaperUrl,
    ],
  );

  // Desktop windows embed full workspaces, so window content is built from the
  // same view model as the main layout — one source of truth for both.
  const renderDesktopWindowContent = useCallback(
    (window: SurfaceWindow) => {
      const viewport = formFactorToAppPortViewport(desktop.surface.formFactor, window.layer);
      return buildWorkspaceWindowContent(window.appId, workspaceViewModelBase, viewport);
    },
    [workspaceViewModelBase, desktop.surface.formFactor],
  );

  const renderDesktopWorkspace = useCallback(
    () => (
      <DesktopWorkspace
        shell={desktop.surface.shell}
        onShellChange={desktop.surface.setShell}
        formFactor={desktop.surface.formFactor}
        onFormFactorChange={desktop.surface.setFormFactor}
        policy={desktop.surface.policy}
        apps={desktop.allDesktopApps}
        desktopIcons={desktopIcons}
        surfaceWindows={desktop.surface.renderableWindows}
        windows={desktop.surface.legacyWindows}
        activeWindowId={desktop.surface.activeWindowId}
        status={{ wifi: true, bluetooth: true, batteryPercent: 84 }}
        onLaunchApp={desktop.handleLaunchDesktopApp}
        onSelectDesktopIcon={desktop.handleSelectDesktopIcon}
        onFocusWindow={desktop.surface.focus}
        onCloseWindow={desktop.handleCloseDesktopWindow}
        onMinimizeWindow={desktop.handleMinimizeDesktopWindow}
        onMaximizeWindow={desktop.surface.maximize}
        onMoveWindow={desktop.surface.moveWindow}
        onResizeWindow={desktop.surface.resizeWindow}
        onPopPhoneStack={desktop.surface.pop}
        onMinimizeAll={desktop.handleMinimizeAllPhoneWindows}
        onNextGlance={desktop.surface.nextGlance}
        onPrevGlance={desktop.surface.prevGlance}
        widgetTiles={allWidgetTiles}
        onCreateApp={desktop.openCreateAppModal}
        trayApps={desktop.trayPinnedApps}
        trayOverflowApps={desktop.trayOverflowApps}
        onTrayReorder={(fromIndex, toIndex) =>
          desktop.setTrayPinnedIds((prev) => reorderTrayPinnedIds(prev, fromIndex, toIndex))
        }
        onTrayUndock={(fromIndex) =>
          desktop.setTrayPinnedIds((prev) => {
            const id = prev[fromIndex];
            return id ? removeAppFromTray(prev, id) : prev;
          })
        }
        onMoveToTray={(id, index) => desktop.setTrayPinnedIds((prev) => moveAppToTray(prev, id, index))}
        renderWindowContent={renderDesktopWindowContent}
        fullscreen={desktop.desktopFullscreen}
        onFullscreenChange={desktop.setDesktopFullscreen}
        wallpaperUrl={desktop.desktopWallpaperUrl}
      />
    ),
    [desktop, renderDesktopWindowContent],
  );

  const { sidebar, main } = buildWorkspaceLayout(
    {
      ...workspaceViewModelBase,
      workspaceId,
      renderDesktopWorkspace,
    },
    { includeSidebar: true },
  );

  // -------------------------------------------------------------------------
  // Context panel sizing — the panel hosts the assistant conversation and/or
  // the chat context drawer; its default/max widths depend on which are open.
  // -------------------------------------------------------------------------
  const isChatWorkspace = workspaceId === "chat";
  const contextPanelOpen = isChatWorkspace || assistant.assistantOpen;
  const showContextDrawer = isChatWorkspace && contextDrawerOpen;
  const showContextConversation = assistant.assistantOpen;
  const contextPanelDefaultWidth =
    showContextConversation && showContextDrawer ? 640 : showContextDrawer ? 400 : 360;
  const contextPanelMaxWidth =
    showContextConversation && showContextDrawer ? 920 : showContextDrawer ? 640 : 480;

  useEffect(() => {
    setContextPanelWidth(contextPanelDefaultWidth);
  }, [contextPanelDefaultWidth]);

  const hideInlineRail = workspaceId === "desktop" && desktop.desktopFullscreen;

  return (
    <>
      <AppShell
        rail={hideInlineRail ? undefined : rail}
        railResizable={navRailExpanded}
        sidebar={sidebar}
        main={main}
        contextPanel={
          contextPanelOpen ? (
            <ChatContextPanel
              showConversation={showContextConversation}
              tabs={assistant.assistantTabs}
              activeTabId={assistant.activeAssistantTabId}
              onTabChange={assistant.setActiveAssistantTabId}
              onTabClose={assistant.handleAssistantTabClose}
              projectLabel="Longformer"
              navItems={assistant.assistantNavItems}
              activeNavId={assistant.assistantNavId}
              onNavChange={assistant.setAssistantNavId}
              messages={assistant.assistantMessages}
              composerValue={assistant.assistantComposerValue}
              onComposerChange={assistant.setAssistantComposerValue}
              onSubmit={assistant.handleAssistantSubmit}
              onMessageCopy={assistant.handleAssistantMessageCopy}
              onMessageEdit={assistant.handleAssistantMessageEdit}
              onMessageRestore={assistant.handleAssistantMessageRestore}
              onAgentMessageCopy={assistant.handleAssistantAgentMessageCopy}
              onAgentRegenerate={assistant.handleAssistantAgentRegenerate}
              onAgentThumbsUp={(message) => assistant.handleAssistantAgentFeedback(message, "up")}
              onAgentThumbsDown={(message) => assistant.handleAssistantAgentFeedback(message, "down")}
              onAgentShare={assistant.handleAssistantAgentShare}
              onAgentFork={assistant.handleAssistantAgentFork}
              typeaheadItems={chat.composerTypeaheadItems}
              onTypeaheadSelect={assistant.handleAssistantTypeaheadSelect}
              onClose={() => assistant.setAssistantOpen(false)}
              onNewConversation={assistant.handleAssistantNewTab}
              promptChips={assistant.assistantPromptChips}
              onPromptChipSelect={assistant.handleAssistantPromptChip}
              model={modelSelection.model}
              modelOptions={modelSelection.modelMenuItems}
              drawerOpen={showContextDrawer}
              onDrawerOpenChange={setContextDrawerOpen}
              drawerTab={contextDrawerTab}
              onDrawerTabChange={setContextDrawerTab}
              drawerWidth={contextDrawerWidth}
              onDrawerWidthChange={setContextDrawerWidth}
              contextPanelWidth={contextPanelWidth}
              diffHunks={demoDiffHunks}
              activeDiffId="diff-gateway"
              folders={files.folders}
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
      <HoverNavRail enabled={hideInlineRail} expanded={navRailExpanded}>
        {rail}
      </HoverNavRail>
      <HoverStatusBar
        enabled={workspaceId !== "desktop"}
        shell={desktop.surface.shell}
        status={{
          wifi: true,
          bluetooth: true,
          batteryPercent: 84,
          activeAppLabel: WORKSPACES.find((item) => item.id === workspaceId)?.label ?? "Longformer",
        }}
      />
      <HoverAssistantBubble
        enabled={workspaceId !== "desktop" && workspaceId !== "chat"}
        assistantOpen={assistant.assistantOpen}
        onOpenAssistant={() => assistant.setAssistantOpen(true)}
        items={assistant.assistantMenuItems}
      />
      <HoverAppTray
        enabled={workspaceId !== "desktop"}
        shell={desktop.surface.shell}
        formFactor={desktop.surface.formFactor}
        apps={desktop.trayPinnedApps}
        overflowApps={desktop.trayOverflowApps}
        windows={desktop.surface.legacyWindows}
        activeWindowId={desktop.surface.activeWindowId}
        onLaunchApp={desktop.handleTrayLaunchApp}
        onFocusWindow={desktop.handleTrayFocusWindow}
        onPopPhoneStack={desktop.surface.pop}
        onMinimizeAll={desktop.handleMinimizeAllPhoneWindows}
        onNextGlance={desktop.surface.nextGlance}
        onPrevGlance={desktop.surface.prevGlance}
        onCreateApp={desktop.openCreateAppModal}
        onReorder={(fromIndex, toIndex) =>
          desktop.setTrayPinnedIds((prev) => reorderTrayPinnedIds(prev, fromIndex, toIndex))
        }
        onUndock={(fromIndex) =>
          desktop.setTrayPinnedIds((prev) => {
            const id = prev[fromIndex];
            return id ? removeAppFromTray(prev, id) : prev;
          })
        }
        onMoveToTray={(id, index) => desktop.setTrayPinnedIds((prev) => moveAppToTray(prev, id, index))}
        onOpenChange={setAppDrawerOpen}
      />
      <CreateAppModal
        open={desktop.createAppOpen}
        onClose={() => desktop.setCreateAppOpen(false)}
        onCreate={desktop.handleCreateApp}
      />
      <ConnectApiModal
        open={modelSelection.connectApiOpen}
        onClose={() => modelSelection.setConnectApiOpen(false)}
        connection={modelSelection.llmConnection}
        onConnectionChange={modelSelection.handleConnectionChange}
      />
      <FloatingChat
        open={floatingChatOpen}
        onOpenChange={setFloatingChatOpen}
        appDrawerOpen={appDrawerOpen}
        messages={assistant.assistantMessages}
        composerValue={assistant.assistantComposerValue}
        onComposerChange={assistant.setAssistantComposerValue}
        onSubmit={assistant.handleAssistantSubmit}
        onMessageCopy={assistant.handleAssistantMessageCopy}
        onMessageEdit={assistant.handleAssistantMessageEdit}
        onMessageRestore={assistant.handleAssistantMessageRestore}
        onAgentMessageCopy={assistant.handleAssistantAgentMessageCopy}
        onAgentRegenerate={assistant.handleAssistantAgentRegenerate}
        onAgentThumbsUp={(message) => assistant.handleAssistantAgentFeedback(message, "up")}
        onAgentThumbsDown={(message) => assistant.handleAssistantAgentFeedback(message, "down")}
        onAgentShare={assistant.handleAssistantAgentShare}
        onAgentFork={assistant.handleAssistantAgentFork}
        typeaheadItems={chat.composerTypeaheadItems}
        onTypeaheadSelect={assistant.handleAssistantTypeaheadSelect}
        onNewConversation={assistant.handleAssistantNewTab}
        promptChips={assistant.assistantPromptChips}
        onPromptChipSelect={assistant.handleAssistantPromptChip}
        model={modelSelection.model}
        modelOptions={modelSelection.modelMenuItems}
      />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" className="lf-app-root">
      <Routes>
        <Route path="/" element={<Navigate to="/chat" replace />} />
        <Route path="/:workspaceId" element={<LongformerApp />} />
        <Route path="*" element={<Navigate to="/chat" replace />} />
      </Routes>
    </ThemeProvider>
  );
}
