import { isWorkspaceId, type WorkspaceId } from "./workspace-config";

export const DEFAULT_WORKSPACE_ID: WorkspaceId = "chat";

/** Canonical URL path for a workspace page. */
export function workspacePath(id: WorkspaceId): string {
  return `/${id}`;
}

/** Resolve a workspace id from the first URL segment, if valid. */
export function workspaceIdFromPathname(pathname: string): WorkspaceId | null {
  const segment = pathname.replace(/^\/+|\/+$/g, "").split("/")[0];
  if (!segment || !isWorkspaceId(segment)) return null;
  return segment;
}
