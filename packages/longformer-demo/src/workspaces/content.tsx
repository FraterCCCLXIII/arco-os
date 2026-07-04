/**
 * Content workspace layouts — email, notes, and files. These three carry the
 * richest sidebars (mailboxes, note vault, none) alongside their main panes.
 */
import {
  EditorToolbar,
  EmailWorkspace,
  FilesWorkspace,
  Icon,
  NavSidebar,
  NotesWorkspace,
  SidebarUserFooter,
  type IconName,
} from "longformer-ui";
import { primaryUser, teamMembers } from "../demo-personas";
import type { WorkspaceLayoutBuilder } from "./types";

export const buildEmailLayout: WorkspaceLayoutBuilder = (vm, { includeSidebar }) => ({
  sidebar: includeSidebar ? (
    <NavSidebar
      sections={[
        {
          id: "folders",
          title: "Mailboxes",
          items: vm.mailFolders.map((folder) => ({
            id: folder.id,
            label: folder.label,
            leading: <Icon name={folder.icon as IconName} size={15} />,
            active: folder.id === "inbox",
          })),
        },
      ]}
      footer={<SidebarUserFooter name={primaryUser.name} meta={primaryUser.email} />}
    />
  ) : undefined,
  main: (
    <EmailWorkspace
      threads={vm.threads.map((t) => ({ ...t, starred: vm.starred.has(t.id) }))}
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
      activeMessages={vm.activeThread?.messages}
      composeOpen={vm.emailComposeOpen}
      onComposeOpenChange={vm.setEmailComposeOpen}
      onSendReply={vm.handleSendEmailReply}
      onSendEmail={vm.handleSendEmail}
    />
  ),
});

export const buildNotesLayout: WorkspaceLayoutBuilder = (vm, { includeSidebar }) => {
  // Sidebar page rows share one click behavior: open the page in the editor.
  const pageItem = (page: { id: string; label: string; meta?: string }, icon: IconName) => ({
    id: page.id,
    label: page.label,
    leading: <Icon name={icon} size={14} />,
    trailing: page.meta,
    active: vm.resolveNoteId(page.id) === vm.activeNote.id,
    onClick: () => {
      vm.setActivePageId(page.id);
      vm.setNotesView("editor");
    },
  });

  return {
    sidebar: includeSidebar ? (
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
              .map((page) => pageItem(page, "notebook")),
          },
          {
            id: "recents",
            title: "Recents",
            items: vm.recentPages
              .filter((page) => page.id !== "writing-telepathy")
              .map((page) => pageItem(page, "notebook")),
          },
          {
            id: "private",
            title: "Private",
            items: vm.privatePages.map((page) => pageItem(page, "notebook")),
          },
          {
            id: "teamspaces",
            title: "Teamspaces",
            items: vm.teamspacePages.map((page) => pageItem(page, "folder")),
          },
        ]}
        footer={<SidebarUserFooter name={primaryUser.name} meta="Longformer · Plus" />}
      />
    ) : undefined,
    main: (
      <NotesWorkspace
        breadcrumb={[
          { label: "Longformer" },
          { label: vm.activeNote.folder ?? "Notes" },
          { label: vm.activeNote.title },
        ]}
        title={vm.activeNote.title}
        tags={vm.activeNote.tags}
        collaborators={[
          { name: primaryUser.name },
          { name: teamMembers.riley.name },
          { name: teamMembers.jordan.name },
        ]}
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
    ),
  };
};

export const buildFilesLayout: WorkspaceLayoutBuilder = (vm) => ({
  main: (
    <FilesWorkspace
      breadcrumb={vm.filesBreadcrumb}
      files={vm.currentFolder.items}
      folders={vm.folders}
      onOpenFile={vm.handleOpenFile}
      onToggleStar={vm.handleToggleStarFile}
      onNewFile={vm.handleNewFile}
    />
  ),
});
