/**
 * Notes workspace state — vault navigation, active note, graph view, and the
 * document-format toolbar with undo/redo history.
 *
 * The doc format history is a simple snapshot stack (not a diff log): each
 * toolbar action pushes a full format state, and undo/redo just moves the
 * index. Good enough for a demo toolbar; a real editor owns this itself.
 */
import { useCallback, useMemo, useState } from "react";
import {
  buildNotesGraph,
  countBacklinks,
  countNoteWords,
  type BlockFormat,
  type NotesView,
  type TextAlign,
  type TextMark,
} from "longformer-ui";
import {
  buildNotesVault,
  defaultNoteId,
  resolveNoteId,
  vaultPrivatePages,
  vaultRecentPages,
  vaultTeamspacePages,
} from "../mock-data/notes-vault";

interface DocFormatState {
  blockFormat: BlockFormat;
  marks: TextMark[];
  align: TextAlign;
}

const initialDocFormat: DocFormatState = { blockFormat: "paragraph", marks: [], align: "left" };

export function useNotesState() {
  const [activePageId, setActivePageId] = useState<string>(defaultNoteId);
  const [notesView, setNotesView] = useState<NotesView>("editor");
  const [graphPanelOpen, setGraphPanelOpen] = useState(true);

  const handleNoteSelect = useCallback((noteId: string) => {
    setActivePageId(noteId);
    setNotesView("editor");
  }, []);

  // Vault pages embed the select handler in their link nodes, so the vault is
  // rebuilt only if the handler identity changes (it never does).
  const notesVault = useMemo(() => buildNotesVault(handleNoteSelect), [handleNoteSelect]);
  const notesGraph = useMemo(() => buildNotesGraph(notesVault), [notesVault]);
  const activeNoteId = resolveNoteId(activePageId);
  const activeNote = useMemo(
    () => notesVault.find((note) => note.id === activeNoteId) ?? notesVault[0],
    [notesVault, activeNoteId],
  );
  const activeNoteBacklinks = useMemo(
    () => countBacklinks(notesVault, activeNote.id),
    [notesVault, activeNote.id],
  );
  const activeNoteWordCount = useMemo(
    () => countNoteWords(activeNote.blocks),
    [activeNote.blocks],
  );

  // --- Document format toolbar (undo/redo snapshot stack) --------------
  const [docHistory, setDocHistory] = useState<DocFormatState[]>([initialDocFormat]);
  const [docHistoryIndex, setDocHistoryIndex] = useState(0);
  const docFormat = docHistory[docHistoryIndex];

  // Pushing after an undo discards the redo tail, like every editor.
  const pushDocFormat = useCallback(
    (next: DocFormatState) => {
      setDocHistory((prev) => [...prev.slice(0, docHistoryIndex + 1), next]);
      setDocHistoryIndex((index) => index + 1);
    },
    [docHistoryIndex],
  );

  const handleToggleMark = useCallback(
    (mark: TextMark) => {
      const marks = docFormat.marks.includes(mark)
        ? docFormat.marks.filter((m) => m !== mark)
        : [...docFormat.marks, mark];
      pushDocFormat({ ...docFormat, marks });
    },
    [docFormat, pushDocFormat],
  );

  const handleBlockFormatChange = useCallback(
    (blockFormat: BlockFormat) => {
      pushDocFormat({ ...docFormat, blockFormat });
    },
    [docFormat, pushDocFormat],
  );

  const handleAlignChange = useCallback(
    (align: TextAlign) => {
      pushDocFormat({ ...docFormat, align });
    },
    [docFormat, pushDocFormat],
  );

  const handleDocUndo = useCallback(() => {
    setDocHistoryIndex((index) => Math.max(0, index - 1));
  }, []);

  const handleDocRedo = useCallback(() => {
    setDocHistoryIndex((index) => Math.min(docHistory.length - 1, index + 1));
  }, [docHistory.length]);

  return useMemo(
    () => ({
      recentPages: vaultRecentPages,
      privatePages: vaultPrivatePages,
      teamspacePages: vaultTeamspacePages,
      activePageId,
      setActivePageId,
      resolveNoteId,
      activeNote,
      notesGraphNodes: notesGraph.nodes,
      notesGraphEdges: notesGraph.edges,
      notesView,
      setNotesView,
      graphPanelOpen,
      setGraphPanelOpen,
      handleNoteSelect,
      activeNoteBacklinks,
      activeNoteWordCount,
      docFormat,
      handleBlockFormatChange,
      handleToggleMark,
      handleAlignChange,
      docHistoryIndex,
      docHistoryLength: docHistory.length,
      handleDocUndo,
      handleDocRedo,
    }),
    [
      activePageId,
      activeNote,
      notesGraph,
      notesView,
      graphPanelOpen,
      handleNoteSelect,
      activeNoteBacklinks,
      activeNoteWordCount,
      docFormat,
      handleBlockFormatChange,
      handleToggleMark,
      handleAlignChange,
      docHistoryIndex,
      docHistory.length,
      handleDocUndo,
      handleDocRedo,
    ],
  );
}

export type NotesSlice = ReturnType<typeof useNotesState>;
