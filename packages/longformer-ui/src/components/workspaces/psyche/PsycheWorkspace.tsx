import { useState } from "react";
import { ScrollArea } from "../../primitives/ScrollArea";
import { SidebarPane } from "../../shell/NavSidebar";
import { DashboardView } from "./DashboardView";
import { DocumentView } from "./DocumentView";
import { KnowledgeGraphView } from "./KnowledgeGraphView";
import { MemoryView } from "./MemoryView";
import { PsycheSidebar } from "./PsycheSidebar";
import { RagView } from "./RagView";
import { VectorDbView } from "./VectorDbView";
import { getDocumentByView, type PsycheView, type PsycheWorkspaceData } from "./types";
import styles from "./PsycheWorkspace.module.css";

export interface PsycheWorkspaceProps {
  data: PsycheWorkspaceData;
  view?: PsycheView;
  defaultView?: PsycheView;
  onViewChange?: (view: PsycheView) => void;
}

function PlaceholderView({ title, description }: { title: string; description: string }) {
  return (
    <div className={styles.placeholder}>
      <h1 className={styles.placeholderTitle}>{title}</h1>
      <p className={styles.placeholderText}>{description}</p>
    </div>
  );
}

/** Model psyche — memory, knowledge graphs, RAG, vector stores, and identity documents. */
export function PsycheWorkspace({
  data,
  view: controlledView,
  defaultView = "dashboard",
  onViewChange,
}: PsycheWorkspaceProps) {
  const [internalView, setInternalView] = useState<PsycheView>(defaultView);
  const activeView = controlledView ?? internalView;

  function handleViewChange(next: PsycheView) {
    if (onViewChange) onViewChange(next);
    else setInternalView(next);
  }

  function renderMain() {
    switch (activeView) {
      case "dashboard":
        return <DashboardView data={data} onNavigate={handleViewChange} />;
      case "memory":
        return <MemoryView data={data} />;
      case "knowledge-graph":
        return <KnowledgeGraphView data={data} />;
      case "rag":
        return <RagView data={data} />;
      case "vector-db":
        return <VectorDbView data={data} />;
      case "soul-md":
        return <DocumentView document={getDocumentByView(data, "soul-md")} variant="soul" />;
      case "ethics-md":
        return <DocumentView document={getDocumentByView(data, "ethics-md")} variant="ethics" />;
      case "settings":
        return (
          <PlaceholderView
            title="Settings"
            description="Configure embedding models, memory retention policies, graph sync intervals, and RAG reranking weights."
          />
        );
      default:
        return <DashboardView data={data} onNavigate={handleViewChange} />;
    }
  }

  return (
    <div className={styles.workspace}>
      <SidebarPane handleLabel="Resize psyche sidebar" className={styles.sidebarResizable} defaultWidth={220} maxWidth={280}>
        <PsycheSidebar data={data} view={activeView} onViewChange={handleViewChange} />
      </SidebarPane>
      <ScrollArea className={styles.main}>{renderMain()}</ScrollArea>
    </div>
  );
}

export type {
  PsycheView,
  PsycheWorkspaceData,
  PsycheNavItem,
  MemoryEntry,
  MemoryKind,
  GraphNode,
  GraphEdge,
  RagChunk,
  RagQuery,
  VectorCollection,
  IdentityDocument,
} from "./types";
