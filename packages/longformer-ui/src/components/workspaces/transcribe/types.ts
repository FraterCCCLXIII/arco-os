import type { IconName } from "../../../icons";

export type TranscribeView =
  | "library"
  | "in-progress"
  | "sources"
  | "uploads"
  | "settings";

export type TranscriptSourceType = "call" | "meeting" | "podcast" | "upload" | "recording";
export type TranscriptStatus = "queued" | "processing" | "ready" | "failed";

export interface TranscribeNavItem {
  id: string;
  label: string;
  icon: IconName;
  view: TranscribeView;
  badge?: string;
}

export interface ConnectedSource {
  id: string;
  label: string;
  icon: IconName;
  provider: string;
  status: "connected" | "syncing" | "disconnected";
  lastSync?: string;
}

export interface TranscriptPinnedItem {
  id: string;
  label: string;
  meta?: string;
}

export interface TranscriptMetric {
  id: string;
  label: string;
  value: number;
  trend: number;
  status: TranscriptStatus | "connected";
}

export interface Transcript {
  id: string;
  title: string;
  sourceType: TranscriptSourceType;
  sourceLabel: string;
  status: TranscriptStatus;
  durationMs: number;
  wordCount?: number;
  speakerCount?: number;
  createdAt: string;
  createdAtMs: number;
  excerpt?: string;
  language?: string;
  pinned?: boolean;
}

export interface TranscribeWorkspaceData {
  productName: string;
  userName: string;
  userEmail: string;
  navItems: TranscribeNavItem[];
  connectedSources: ConnectedSource[];
  pinnedTranscripts: TranscriptPinnedItem[];
  metrics: TranscriptMetric[];
  processingCount: number;
  transcripts: Transcript[];
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function filterTranscripts(
  transcripts: Transcript[],
  options: {
    status?: TranscriptStatus | "all";
    sourceType?: TranscriptSourceType | "all";
    query?: string;
  } = {},
): Transcript[] {
  const normalizedQuery = options.query?.trim().toLowerCase() ?? "";

  return transcripts.filter((transcript) => {
    if (options.status && options.status !== "all" && transcript.status !== options.status) return false;
    if (options.sourceType && options.sourceType !== "all" && transcript.sourceType !== options.sourceType) {
      return false;
    }

    if (!normalizedQuery) return true;

    return (
      transcript.title.toLowerCase().includes(normalizedQuery) ||
      transcript.sourceLabel.toLowerCase().includes(normalizedQuery) ||
      (transcript.excerpt?.toLowerCase().includes(normalizedQuery) ?? false)
    );
  });
}
