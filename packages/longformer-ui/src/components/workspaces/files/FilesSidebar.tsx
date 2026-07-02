import { Icon, type IconName } from "../../../icons";
import { Button } from "../../primitives/Button";
import { ListItem } from "../../primitives/ListItem";
import { ScrollArea } from "../../primitives/ScrollArea";
import type { FilesLocation } from "./types";
import styles from "./FilesSidebar.module.css";

const LOCATIONS: { id: FilesLocation; label: string; icon: IconName }[] = [
  { id: "home", label: "Home", icon: "home" },
  { id: "drive", label: "My Drive", icon: "folder" },
  { id: "recent", label: "Recent", icon: "clock" },
  { id: "starred", label: "Starred", icon: "star" },
  { id: "trash", label: "Trash", icon: "trash" },
];

export interface FilesSidebarProps {
  location: FilesLocation;
  onLocationChange: (location: FilesLocation) => void;
  onNewFile?: () => void;
  storageUsedLabel?: string;
  storageTotalLabel?: string;
}

/** Drive-style left nav: New action, primary locations, and a storage meter. */
export function FilesSidebar({
  location,
  onLocationChange,
  onNewFile,
  storageUsedLabel = "22.4 GB",
  storageTotalLabel = "100 GB",
}: FilesSidebarProps) {
  const usedPercent = 22;

  return (
    <aside className={styles.sidebar} aria-label="Files navigation">
      <div className={styles.header}>
        {onNewFile && (
          <Button variant="secondary" fullWidth onClick={onNewFile} style={{ justifyContent: "flex-start" }}>
            <Icon name="plus" size={15} />
            New
          </Button>
        )}
      </div>

      <ScrollArea className={styles.nav}>
        <div className={styles.sectionItems}>
          {LOCATIONS.map((item) => (
            <ListItem
              key={item.id}
              leading={<Icon name={item.icon} size={15} />}
              label={item.label}
              active={location === item.id}
              onClick={() => onLocationChange(item.id)}
            />
          ))}
        </div>
      </ScrollArea>

      <div className={styles.storage}>
        <div className={styles.storageLabel}>
          <Icon name="globe" size={14} />
          Storage
        </div>
        <div className={styles.storageMeter} aria-hidden="true">
          <span className={styles.storageFill} style={{ width: `${usedPercent}%` }} />
        </div>
        <div className={styles.storageMeta}>
          {storageUsedLabel} of {storageTotalLabel} used
        </div>
        <Button variant="ghost" size="sm" fullWidth>
          Get more storage
        </Button>
      </div>
    </aside>
  );
}
