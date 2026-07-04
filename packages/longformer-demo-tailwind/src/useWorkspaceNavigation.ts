import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { WorkspaceId } from "./workspace-config";
import { isWorkspaceId } from "./workspace-config";
import { DEFAULT_WORKSPACE_ID, workspacePath } from "./workspace-routes";

/** Keeps the active workspace in sync with `/:workspaceId` in the URL. */
export function useWorkspaceNavigation() {
  const navigate = useNavigate();
  const { workspaceId: workspaceParam } = useParams<{ workspaceId: string }>();

  const workspaceId: WorkspaceId =
    workspaceParam && isWorkspaceId(workspaceParam) ? workspaceParam : DEFAULT_WORKSPACE_ID;

  useEffect(() => {
    if (workspaceParam && !isWorkspaceId(workspaceParam)) {
      navigate(workspacePath(DEFAULT_WORKSPACE_ID), { replace: true });
    }
  }, [navigate, workspaceParam]);

  const setWorkspaceId = useCallback(
    (id: WorkspaceId) => {
      navigate(workspacePath(id));
    },
    [navigate],
  );

  return { workspaceId, setWorkspaceId };
}
