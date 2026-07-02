import type { IconName } from "../../../icons";

export type PsycheView =
  | "dashboard"
  | "memory"
  | "knowledge-graph"
  | "rag"
  | "vector-db"
  | "soul-md"
  | "ethics-md"
  | "settings";

export type MemoryKind = "episodic" | "semantic" | "working" | "procedural";

export type MemoryStatus = "active" | "archived" | "pending" | "conflicted";

export interface PsycheNavItem {
  id: string;
  label: string;
  icon: IconName;
  view: PsycheView;
  section?: "overview" | "stores" | "identity";
}

export interface PsycheMetric {
  id: string;
  label: string;
  value: string;
  change?: string;
  icon?: IconName;
  tone?: "accent" | "success" | "warning" | "neutral";
}

export interface MemoryEntry {
  id: string;
  title: string;
  summary: string;
  kind: MemoryKind;
  status: MemoryStatus;
  source: string;
  confidence: number;
  lastAccessed: string;
  tags: string[];
}

export interface GraphNode {
  id: string;
  label: string;
  type: "concept" | "entity" | "event" | "value" | "policy";
  x: number;
  y: number;
  connections: number;
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  label: string;
  weight: number;
}

export interface RagChunk {
  id: string;
  source: string;
  content: string;
  score: number;
  tokens: number;
  metadata: Record<string, string>;
}

export interface RagQuery {
  id: string;
  query: string;
  timestamp: string;
  latencyMs: number;
  chunksRetrieved: number;
  answerPreview: string;
}

export interface VectorCollection {
  id: string;
  name: string;
  dimensions: number;
  vectors: number;
  indexType: string;
  health: "healthy" | "degraded" | "syncing";
  lastIndexed: string;
  embeddingModel: string;
}

export interface IdentityDocument {
  id: string;
  title: string;
  filename: string;
  version: string;
  lastEdited: string;
  sections: { id: string; heading: string; content: string }[];
}

export interface IngestionEvent {
  id: string;
  title: string;
  source: string;
  type: string;
  timestamp: string;
  status: "success" | "warning" | "info";
}

export interface PsycheWorkspaceData {
  productName: string;
  modelName: string;
  tagline: string;
  navItems: PsycheNavItem[];
  overviewMetrics: PsycheMetric[];
  memoryEntries: MemoryEntry[];
  graphNodes: GraphNode[];
  graphEdges: GraphEdge[];
  ragQueries: RagQuery[];
  ragChunks: RagChunk[];
  vectorCollections: VectorCollection[];
  soulDocument: IdentityDocument;
  ethicsDocument: IdentityDocument;
  recentIngestions: IngestionEvent[];
  systemNote: string;
}

export function getDocumentByView(
  data: PsycheWorkspaceData,
  view: "soul-md" | "ethics-md",
): IdentityDocument {
  return view === "soul-md" ? data.soulDocument : data.ethicsDocument;
}
