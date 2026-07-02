import { Icon } from "../../../icons";
import { Input } from "../../primitives/Input";
import { IconButton } from "../../primitives/IconButton";
import type { FilesViewMode } from "./types";
import styles from "./FilesToolbar.module.css";

const VIEW_MODES: { id: FilesViewMode; label: string; icon: "list" | "grid" | "image" }[] = [
  { id: "list", label: "List view", icon: "list" },
  { id: "grid", label: "Grid view", icon: "grid" },
  { id: "gallery", label: "Gallery view", icon: "image" },
];

export interface FilesToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: FilesViewMode;
  onViewModeChange: (mode: FilesViewMode) => void;
  title?: string;
}

/** Finder/Drive toolbar row: search, view toggles, and quick actions. */
export function FilesToolbar({ searchQuery, onSearchChange, viewMode, onViewModeChange, title }: FilesToolbarProps) {
  return (
    <div className={styles.toolbar}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.searchWrap}>
        <Input
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search in Drive"
          aria-label="Search files"
          startSlot={<Icon name="search" size={15} />}
          wrapperClassName={styles.search}
        />
      </div>
      <div className={styles.actions}>
        <div className={styles.viewToggle} role="group" aria-label="View options">
          {VIEW_MODES.map((mode) => (
            <IconButton
              key={mode.id}
              icon={mode.icon}
              label={mode.label}
              size="sm"
              variant={viewMode === mode.id ? "secondary" : "ghost"}
              aria-pressed={viewMode === mode.id}
              onClick={() => onViewModeChange(mode.id)}
            />
          ))}
        </div>
        <IconButton icon="more-horizontal" label="More actions" size="sm" />
        <IconButton icon="settings" label="Sort and filter" size="sm" />
      </div>
    </div>
  );
}
