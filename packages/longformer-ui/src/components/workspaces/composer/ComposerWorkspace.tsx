import { useCallback, useMemo, useState } from "react";
import { ResizablePane } from "../../primitives/ResizablePane";
import { SidebarPane } from "../../shell/NavSidebar/SidebarPane";
import {
  ComposerCreationPanel,
  ComposerLibraryPanel,
  ComposerNavSidebar,
  ComposerPlayerBar,
} from "./ComposerParts";
import { COMPOSER_SAMPLE_DATA } from "./sample-data";
import type {
  ComposerMode,
  ComposerModelVersion,
  ComposerNavView,
  ComposerNowPlaying,
  ComposerTrack,
  ComposerWorkspaceData,
} from "./types";
import styles from "./ComposerWorkspace.module.css";

function formatTrackDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export interface ComposerWorkspaceProps {
  data?: ComposerWorkspaceData;
}

/**
 * Generative music workspace — prompt-driven creation, library browsing,
 * and persistent playback controls inspired by modern AI music tools.
 */
export function ComposerWorkspace({ data = COMPOSER_SAMPLE_DATA }: ComposerWorkspaceProps) {
  const [activeView, setActiveView] = useState<ComposerNavView>("create");
  const [mode, setMode] = useState<ComposerMode>("simple");
  const [model, setModel] = useState<ComposerModelVersion>("v3.5");
  const [prompt, setPrompt] = useState(data.defaultPrompt);
  const [activeStyles, setActiveStyles] = useState<string[]>([]);
  const [instrumental, setInstrumental] = useState(false);
  const [creating, setCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tracks, setTracks] = useState<ComposerTrack[]>(data.tracks);
  const [activeTrackId, setActiveTrackId] = useState(data.nowPlaying.track.id);
  const [playing, setPlaying] = useState(true);
  const [nowPlaying, setNowPlaying] = useState<ComposerNowPlaying>(data.nowPlaying);

  const activeTrack = useMemo(
    () => tracks.find((track) => track.id === activeTrackId) ?? tracks[0],
    [activeTrackId, tracks],
  );

  const handleToggleStyle = useCallback((style: string) => {
    setActiveStyles((current) =>
      current.includes(style) ? current.filter((item) => item !== style) : [...current, style],
    );
  }, []);

  const handleSelectTrack = useCallback(
    (id: string) => {
      const track = tracks.find((item) => item.id === id);
      if (!track) return;
      setActiveTrackId(id);
      setNowPlaying((current) => ({
        ...current,
        track,
        progress: 0,
        elapsed: "0:00",
      }));
      setPlaying(true);
    },
    [tracks],
  );

  const handleCreate = useCallback(() => {
    if (prompt.trim().length === 0 || creating) return;

    setCreating(true);

    window.setTimeout(() => {
      const styleSuffix = activeStyles.length > 0 ? `, ${activeStyles.join(", ")}` : "";
      const description = `${prompt.trim()}${styleSuffix}${instrumental ? " (instrumental)" : ""}`;
      const nextTrack: ComposerTrack = {
        id: `generated-${Date.now().toString(36)}`,
        title: prompt.trim().split(/\s+/).slice(0, 3).join(" ") || "Untitled",
        version: model,
        description,
        duration: formatTrackDuration(120 + Math.floor(Math.random() * 120)),
        durationSeconds: 120 + Math.floor(Math.random() * 120),
        artTone: data.tracks[Math.floor(Math.random() * data.tracks.length)]?.artTone ?? "violet",
      };

      setTracks((current) => [nextTrack, ...current]);
      setActiveTrackId(nextTrack.id);
      setNowPlaying({
        track: nextTrack,
        progress: 0,
        elapsed: "0:00",
        creator: data.user.handle,
      });
      setPlaying(true);
      setCreating(false);
    }, 900);
  }, [activeStyles, creating, data.tracks, data.user.handle, instrumental, model, prompt]);

  return (
    <div className={styles.workspace}>
      <div className={styles.body}>
        <SidebarPane handleLabel="Resize composer navigation" defaultWidth={240} minWidth={200} maxWidth={300}>
          <ComposerNavSidebar
            navItems={data.navItems}
            activeView={activeView}
            onViewChange={setActiveView}
            onNew={() => setActiveView("create")}
          />
        </SidebarPane>

        <div className={styles.mainArea}>
          {activeView === "create" ? (
            <ResizablePane
              defaultWidth={380}
              minWidth={320}
              maxWidth={480}
              handleSide="right"
              handleLabel="Resize creation panel"
              className={styles.creationResizable}
              paneClassName={styles.creationPane}
            >
              <ComposerCreationPanel
                mode={mode}
                onModeChange={setMode}
                model={model}
                onModelChange={setModel}
                prompt={prompt}
                onPromptChange={setPrompt}
                styleSuggestions={data.styleSuggestions}
                activeStyles={activeStyles}
                onToggleStyle={handleToggleStyle}
                instrumental={instrumental}
                onInstrumentalChange={setInstrumental}
                onCreate={handleCreate}
                creating={creating}
              />
            </ResizablePane>
          ) : null}

          <ComposerLibraryPanel
            tracks={tracks}
            activeTrackId={activeTrack?.id}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectTrack={handleSelectTrack}
          />
        </div>
      </div>

      <ComposerPlayerBar nowPlaying={nowPlaying} playing={playing} onTogglePlay={() => setPlaying((value) => !value)} />
    </div>
  );
}

export type {
  ComposerArtTone,
  ComposerMode,
  ComposerModelVersion,
  ComposerNavView,
  ComposerNowPlaying,
  ComposerTrack,
  ComposerUser,
  ComposerWorkspaceData,
} from "./types";
