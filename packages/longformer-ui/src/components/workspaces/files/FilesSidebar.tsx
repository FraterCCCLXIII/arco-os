import { Icon, type IconName } from "../../../icons";
import { Button } from "../../primitives/Button";
import { NavSidebar } from "../../shell/NavSidebar";
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
    <NavSidebar
      className={styles.sidebar}
      primaryAction={onNewFile ? { label: "New", icon: "plus", onClick: onNewFile } : undefined}
      sections={[
        {
          id: "locations",
          items: LOCATIONS.map((item) => ({
            id: item.id,
            label: item.label,
            leading: <Icon name={item.icon} size={15} />,
            active: location === item.id,
            onClick: () => onLocationChange(item.id),
          })),
        },
      ]}
      footer={
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
      }
    />
  );
}
