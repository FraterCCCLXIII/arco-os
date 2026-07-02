import { useState } from "react";
import { ScrollArea } from "../../primitives/ScrollArea";
import { AgentSkillsView } from "./AgentSkillsView";
import { AppTemplatesView } from "./AppTemplatesView";
import { ExtensionsSidebar } from "./ExtensionsSidebar";
import { PluginsView } from "./PluginsView";
import { PromptsView } from "./PromptsView";
import type { ExtensionView, ExtensionsWorkspaceData } from "./types";
import styles from "./ExtensionsWorkspace.module.css";

export interface ExtensionsWorkspaceProps {
  data: ExtensionsWorkspaceData;
  view?: ExtensionView;
  defaultView?: ExtensionView;
  onViewChange?: (view: ExtensionView) => void;
}

/** Extensions hub — agent skills, plugins, prompts, and app templates for customizing the workspace. */
export function ExtensionsWorkspace({
  data,
  view: controlledView,
  defaultView = "agent-skills",
  onViewChange,
}: ExtensionsWorkspaceProps) {
  const [internalView, setInternalView] = useState<ExtensionView>(defaultView);
  const activeView = controlledView ?? internalView;

  function handleViewChange(next: ExtensionView) {
    if (onViewChange) onViewChange(next);
    else setInternalView(next);
  }

  function renderMain() {
    switch (activeView) {
      case "agent-skills":
        return <AgentSkillsView data={data} />;
      case "plugins":
        return <PluginsView data={data} />;
      case "prompts":
        return <PromptsView data={data} />;
      case "app-templates":
        return <AppTemplatesView data={data} />;
      default:
        return <AgentSkillsView data={data} />;
    }
  }

  return (
    <div className={styles.workspace} aria-label="Extensions">
      <ExtensionsSidebar data={data} view={activeView} onViewChange={handleViewChange} />
      <ScrollArea className={styles.main}>{renderMain()}</ScrollArea>
    </div>
  );
}
