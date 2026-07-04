import { Icon } from "../../../icons";
import { Avatar } from "../../primitives/Avatar";
import { NavSidebar } from "../../shell/NavSidebar";
import type { TranscribeView, TranscribeWorkspaceData } from "./types";
import styles from "./TranscribeSidebar.tailwind";

export interface TranscribeSidebarProps {
  data: TranscribeWorkspaceData;
  view: TranscribeView;
  onViewChange: (view: TranscribeView) => void;
}

/** Transcription nav — library, sources, uploads, and connected integrations. */
export function TranscribeSidebar({ data, view, onViewChange }: TranscribeSidebarProps) {
  const primaryItems = data.navItems.filter((item) =>
    ["library", "in-progress", "sources", "uploads"].includes(item.view),
  );
  const secondaryItems = data.navItems.filter((item) => item.view === "settings");

  return (
    <NavSidebar
      className={styles.sidebar}
      header={
        <>
          <div className={styles.brand}>
            <span className={styles.brandIcon} aria-hidden="true">
              <Icon name="mic" size={16} />
            </span>
            <div className={styles.brandBody}>
              <span className={styles.brandName}>{data.productName}</span>
              <span className={styles.brandRole}>Transcription</span>
            </div>
          </div>

          <div className={styles.search}>
            <Icon name="search" size={14} />
            <span>Search transcripts</span>
            <kbd className={styles.kbd}>⌘K</kbd>
          </div>
        </>
      }
      sections={[
        {
          id: "primary",
          items: primaryItems.map((item) => ({
            id: item.id,
            label: item.label,
            leading: <Icon name={item.icon} size={16} />,
            trailing: item.badge ? <span className={styles.badge}>{item.badge}</span> : undefined,
            active: view === item.view,
            onClick: () => onViewChange(item.view),
          })),
        },
        {
          id: "secondary",
          items: secondaryItems.map((item) => ({
            id: item.id,
            label: item.label,
            leading: <Icon name={item.icon} size={16} />,
            active: view === item.view,
            onClick: () => onViewChange(item.view),
          })),
        },
        {
          id: "sources",
          title: "Connected Sources",
          items: data.connectedSources.map((source) => ({
            id: source.id,
            label: source.label,
            leading: <Icon name={source.icon} size={16} />,
            trailing: (
              <span
                className={styles.sourceStatus}
                data-status={source.status}
                title={source.provider}
              />
            ),
          })),
        },
        {
          id: "pinned",
          title: "Recent",
          items: data.pinnedTranscripts.map((item) => ({
            id: item.id,
            label: item.label,
            trailing: item.meta ? <span className={styles.pinnedMeta}>{item.meta}</span> : undefined,
            className: styles.pinnedItem,
          })),
        },
      ]}
      footer={
        <div className={styles.footer}>
          <div className={styles.profile}>
            <Avatar name={data.userName} size="sm" />
            <div className={styles.profileBody}>
              <span className={styles.profileName}>{data.userName}</span>
              <span className={styles.profileEmail}>{data.userEmail}</span>
            </div>
          </div>
          <div className={styles.footerActions}>
            <button type="button" className={styles.footerLink}>
              <Icon name="attach" size={14} />
              Upload audio
            </button>
            <button type="button" className={styles.footerLink}>
              <Icon name="plus" size={14} />
              Connect source
            </button>
          </div>
        </div>
      }
    />
  );
}
