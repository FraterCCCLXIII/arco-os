import type { GeneratedSurfaceSchema } from "./types";
import { DesignSystemWorkspace } from "../design-system/DesignSystemWorkspace";

export interface GeneratedUIWorkspaceProps {
  title?: string;
  schema: GeneratedSurfaceSchema;
}

/** @deprecated Use DesignSystemWorkspace — kept for desktop window and legacy imports. */
export function GeneratedUIWorkspace({ title = "Design System", schema }: GeneratedUIWorkspaceProps) {
  return <DesignSystemWorkspace title={title} generatedSchema={schema} defaultTab="generated" />;
}
