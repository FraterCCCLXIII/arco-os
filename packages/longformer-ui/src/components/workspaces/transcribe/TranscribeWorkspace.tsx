import { useState } from "react";
import { ScrollArea } from "../../primitives/ScrollArea";
import { TranscribeSidebar } from "./TranscribeSidebar";
import { TranscriptionsListView } from "./TranscriptionsListView";
import type { TranscribeView, TranscribeWorkspaceData } from "./types";
import styles from "./TranscribeWorkspace.module.css";

export interface TranscribeWorkspaceProps {
  data: TranscribeWorkspaceData;
  view?: TranscribeView;
  defaultView?: TranscribeView;
  onViewChange?: (view: TranscribeView) => void;
}

function PlaceholderView({ title, description }: { title: string; description: string }) {
  return (
    <div className={styles.placeholder}>
      <h1 className={styles.placeholderTitle}>{title}</h1>
      <p className={styles.placeholderText}>{description}</p>
    </div>
  );
}

/** Transcription workspace — manage transcripts from calls, meetings, podcasts, and uploads. */
export function TranscribeWorkspace({
  data,
  view: controlledView,
  defaultView = "library",
  onViewChange,
}: TranscribeWorkspaceProps) {
  const [internalView, setInternalView] = useState<TranscribeView>(defaultView);
  const activeView = controlledView ?? internalView;

  function handleViewChange(next: TranscribeView) {
    if (onViewChange) onViewChange(next);
    else setInternalView(next);
  }

  function renderMain() {
    switch (activeView) {
      case "library":
        return <TranscriptionsListView data={data} />;
      case "in-progress":
        return (
          <PlaceholderView
            title="In Progress"
            description="Transcripts currently queued or being processed — calls, meetings, and uploads in flight."
          />
        );
      case "sources":
        return (
          <PlaceholderView
            title="Connected Sources"
            description="Manage integrations for Zoom, Google Meet, podcast feeds, and cloud storage sync."
          />
        );
      case "uploads":
        return (
          <PlaceholderView
            title="Uploads"
            description="Drag and drop audio or video files to transcribe — MP3, M4A, WAV, MP4, and more."
          />
        );
      case "settings":
        return (
          <PlaceholderView
            title="Settings"
            description="Configure language detection, speaker diarization, export formats, and auto-transcribe rules."
          />
        );
      default:
        return <TranscriptionsListView data={data} />;
    }
  }

  return (
    <div className={styles.workspace}>
      <TranscribeSidebar data={data} view={activeView} onViewChange={handleViewChange} />
      <ScrollArea className={styles.main}>{renderMain()}</ScrollArea>
    </div>
  );
}

export type {
  TranscribeView,
  TranscribeWorkspaceData,
  TranscribeNavItem,
  Transcript,
  TranscriptMetric,
  TranscriptStatus,
  TranscriptSourceType,
  ConnectedSource,
} from "./types";
