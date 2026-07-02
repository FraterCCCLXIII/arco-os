import { useState } from "react";
import { Chip } from "../../primitives/Chip";
import { IconButton } from "../../primitives/IconButton";
import { MediaCard } from "../../primitives/MediaCard";
import type { CameraMode, GalleryItem } from "./types";
import styles from "./CameraWorkspace.module.css";

export interface CameraWorkspaceProps {
  gallery: GalleryItem[];
  mode?: CameraMode;
  defaultMode?: CameraMode;
  onModeChange?: (mode: CameraMode) => void;
  recording?: boolean;
  defaultRecording?: boolean;
  onRecordingChange?: (recording: boolean) => void;
}

/** Simple camera app with photo/video modes, a viewfinder, and a recent gallery strip. */
export function CameraWorkspace({
  gallery,
  mode: controlledMode,
  defaultMode = "photo",
  onModeChange,
  recording: controlledRecording,
  defaultRecording = false,
  onRecordingChange,
}: CameraWorkspaceProps) {
  const [internalMode, setInternalMode] = useState<CameraMode>(defaultMode);
  const [internalRecording, setInternalRecording] = useState(defaultRecording);

  const mode = controlledMode ?? internalMode;
  const recording = controlledRecording ?? internalRecording;

  function handleModeChange(next: CameraMode) {
    if (onModeChange) onModeChange(next);
    else setInternalMode(next);
    if (next === "photo" && recording) {
      if (onRecordingChange) onRecordingChange(false);
      else setInternalRecording(false);
    }
  }

  function handleShutter() {
    if (mode === "video") {
      const next = !recording;
      if (onRecordingChange) onRecordingChange(next);
      else setInternalRecording(next);
    }
  }

  return (
    <div className={styles.workspace}>
      <div className={styles.viewfinder}>
        <div className={styles.viewfinderFrame}>
          <div className={styles.gridLines} aria-hidden="true" />
          <div className={styles.viewfinderOverlay}>
            <div className={styles.topBar}>
              {mode === "video" && recording ? (
                <span className={styles.recordingBadge}>
                  <span className={styles.recordingDot} />
                  REC
                </span>
              ) : (
                <span />
              )}
              <IconButton icon="settings" label="Camera settings" variant="ghost" />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.modeRow}>
          <Chip
            icon="image"
            active={mode === "photo"}
            onClick={() => handleModeChange("photo")}
          >
            Photo
          </Chip>
          <Chip
            icon="video"
            active={mode === "video"}
            onClick={() => handleModeChange("video")}
          >
            Video
          </Chip>
        </div>

        <div className={styles.shutterRow}>
          <IconButton icon="image" label="Open gallery" variant="ghost" />
          <button
            type="button"
            className={`${styles.shutter} ${mode === "video" && recording ? styles.shutterRecording : ""} lf-focusable`}
            aria-label={mode === "photo" ? "Take photo" : recording ? "Stop recording" : "Start recording"}
            onClick={handleShutter}
          >
            <span className={styles.shutterInner} />
          </button>
          <IconButton icon="refresh" label="Flip camera" variant="ghost" />
        </div>

        <div className={styles.gallery}>
          {gallery.map((item) => (
            <div key={item.id} className={styles.galleryCard}>
              <MediaCard
                tone={item.tone ?? "accent"}
                title={item.label}
                badges={item.duration ? [{ icon: "play", label: item.duration }] : undefined}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export type { CameraMode, GalleryItem } from "./types";
