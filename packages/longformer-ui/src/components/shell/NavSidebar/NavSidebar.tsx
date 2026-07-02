import type { ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon, type IconName } from "../../../icons";
import { Button } from "../../primitives/Button";
import { ListItem } from "../../primitives/ListItem";
import { ScrollArea } from "../../primitives/ScrollArea";
import { Avatar, type AvatarStatus } from "../../primitives/Avatar";
import styles from "./NavSidebar.module.css";

export interface NavSidebarQuickLink {
  id: string;
  label: string;
  icon: IconName;
  active?: boolean;
  onClick?: () => void;
}

export interface NavSidebarListItem {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export interface NavSidebarSection {
  id: string;
  title?: string;
  items: NavSidebarListItem[];
}

export interface NavSidebarProps {
  /** Primary call-to-action at the top, e.g. "New chat" / "New note". */
  primaryAction?: { label: string; icon?: IconName; onClick?: () => void };
  /** Secondary nav row, e.g. Search / Scheduled / Plugins. */
  quickLinks?: NavSidebarQuickLink[];
  sections: NavSidebarSection[];
  footer?: ReactNode;
  className?: string;
}

/**
 * The recurring "New action → quick links → grouped scrollable list →
 * profile footer" sidebar shared by the Chat and Email workspaces.
 */
export function NavSidebar({ primaryAction, quickLinks, sections, footer, className }: NavSidebarProps) {
  return (
    <div className={cx(styles.sidebar, className)}>
      {(primaryAction || quickLinks) && (
        <div className={styles.header}>
          {primaryAction && (
            <Button variant="secondary" fullWidth onClick={primaryAction.onClick} style={{ justifyContent: "flex-start" }}>
              {primaryAction.icon && <Icon name={primaryAction.icon} size={15} />}
              {primaryAction.label}
            </Button>
          )}
          {quickLinks && quickLinks.length > 0 && (
            <div className={styles.quickLinks}>
              {quickLinks.map((link) => (
                <ListItem
                  key={link.id}
                  leading={<Icon name={link.icon} size={15} />}
                  label={link.label}
                  active={link.active}
                  onClick={link.onClick}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <ScrollArea className={styles.sections}>
        {sections.map((section) => (
          <div key={section.id}>
            {section.title && <div className={styles.sectionTitle}>{section.title}</div>}
            <div className={styles.sectionItems}>
              {section.items.map((item) => (
                <ListItem
                  key={item.id}
                  leading={item.leading}
                  label={item.label}
                  description={item.description}
                  trailing={item.trailing}
                  active={item.active}
                  onClick={item.onClick}
                />
              ))}
            </div>
          </div>
        ))}
      </ScrollArea>

      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}

export interface SidebarUserFooterProps {
  name: string;
  meta?: string;
  avatarSrc?: string;
  status?: AvatarStatus;
  onClick?: () => void;
}

/** The "avatar + name + plan/status" row anchored to the bottom of every sidebar. */
export function SidebarUserFooter({ name, meta, avatarSrc, status = "online", onClick }: SidebarUserFooterProps) {
  return (
    <button type="button" className={cx("lf-focusable", styles.userFooter)} onClick={onClick}>
      <Avatar name={name} src={avatarSrc} status={status} size="md" />
      <span className={styles.userFooterBody}>
        <span className={styles.userFooterName}>{name}</span>
        {meta && <span className={styles.userFooterMeta}>{meta}</span>}
      </span>
      <Icon name="more-vertical" size={15} />
    </button>
  );
}
