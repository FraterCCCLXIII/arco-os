/**
 * Demo state slices — one hook per product domain, composed by App.tsx.
 * Each slice's return keys line up with WorkspaceLayoutViewModel so the
 * shell can spread them into the layout builder without renaming.
 */
export { useChatState, type ChatSlice } from "./useChatState";
export { useAssistantState, type AssistantSlice } from "./useAssistantState";
export { useCommsState, type CommsSlice } from "./useCommsState";
export { useEmailState, type EmailSlice } from "./useEmailState";
export { useNotesState, type NotesSlice } from "./useNotesState";
export { usePlannerState, type PlannerSlice } from "./usePlannerState";
export { useFilesState, type FilesSlice } from "./useFilesState";
export { useDesktopState, type DesktopSlice } from "./useDesktopState";
export { useProductivityState, type ProductivitySlice } from "./useProductivityState";
export { useModelSelection, type ModelSelectionSlice } from "./useModelSelection";
export { staticWorkspaceData, allWidgetTiles } from "./workspace-static-data";
