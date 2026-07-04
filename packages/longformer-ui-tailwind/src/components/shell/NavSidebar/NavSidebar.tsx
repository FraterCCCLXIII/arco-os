import { useMemo, useState, type ReactNode } from "react";
import { cx } from "../../../utils/cx";
import { Icon, type IconName } from "../../../icons";
import { Button } from "../../primitives/Button";
import { ListItem } from "../../primitives/ListItem";
import { Menu, type MenuItemDescriptor } from "../../primitives/Menu";
import { ScrollArea } from "../../primitives/ScrollArea";
import { Avatar, type AvatarStatus } from "../../primitives/Avatar";
import styles from "./NavSidebar.tailwind";

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
  className?: string;
}

export interface NavSidebarSection {
  id: string;
  title?: string;
  action?: ReactNode;
  beforeItems?: ReactNode;
  items?: NavSidebarListItem[];
  /** Custom section body; when set, `items` is ignored. */
  content?: ReactNode;
}

export interface NavSidebarProps {
  /** Custom header slot above sections (workspace title, profile, tabs, etc.). */
  header?: ReactNode;
  /** Primary call-to-action at the top, e.g. "New chat" / "New note". */
  primaryAction?: { label: string; icon?: IconName; onClick?: () => void };
  /** Secondary nav row, e.g. Search / Scheduled / Plugins. */
  quickLinks?: NavSidebarQuickLink[];
  sections: NavSidebarSection[];
  footer?: ReactNode;
  className?: string;
}

export interface NavSidebarSectionHeaderProps {
  title?: string;
  action?: ReactNode;
  className?: string;
}

/** Uppercase section label with optional trailing action (e.g. "+" for new channel). */
export function NavSidebarSectionHeader({ title, action, className }: NavSidebarSectionHeaderProps) {
  if (!title && !action) return null;

  return (
    <div className={cx(styles.sectionHeader, className)}>
      {title && <span className={styles.sectionHeaderTitle}>{title}</span>}
      {action}
    </div>
  );
}

export interface NavSidebarSectionFilterOption {
  id: string;
  label: string;
}

export interface NavSidebarSectionFilterProps {
  value: string;
  options: NavSidebarSectionFilterOption[];
  onChange: (id: string) => void;
  "aria-label"?: string;
}

/** Compact dropdown for switching sidebar list layouts (Recent, Grouped, etc.). */
export function NavSidebarSectionFilter({
  value,
  options,
  onChange,
  "aria-label": ariaLabel = "List view",
}: NavSidebarSectionFilterProps) {
  const current = options.find((option) => option.id === value);

  const items = useMemo<MenuItemDescriptor[]>(
    () =>
      options.map((option) => ({
        id: option.id,
        label: (
          <span className={styles.sectionFilterItem}>
            <span>{option.label}</span>
            {option.id === value ? (
              <span className={styles.sectionFilterCheck} aria-hidden="true">
                <Icon name="check" size={14} />
              </span>
            ) : null}
          </span>
        ),
        onSelect: () => onChange(option.id),
      })),
    [onChange, options, value],
  );

  return (
    <Menu
      align="end"
      trigger={
        <button type="button" className={styles.sectionFilterTrigger} aria-label={ariaLabel}>
          <span>{current?.label ?? value}</span>
          <Icon name="chevron-down" size={12} />
        </button>
      }
      items={items}
      aria-label={ariaLabel}
    />
  );
}

export interface NavSidebarItemGroup {
  id: string;
  label: string;
  icon?: IconName;
  items: NavSidebarListItem[];
}

export interface NavSidebarGroupedItemsProps {
  groups: NavSidebarItemGroup[];
  maxVisiblePerGroup?: number;
  className?: string;
}

/** Renders sidebar rows grouped under project/repo headers with optional "Show more". */
export function NavSidebarGroupedItems({
  groups,
  maxVisiblePerGroup = 5,
  className,
}: NavSidebarGroupedItemsProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => new Set());

  function toggleGroup(groupId: string) {
    setExpandedGroups((current) => {
      const next = new Set(current);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  }

  return (
    <div className={cx(styles.groupedSection, className)}>
      {groups.map((group) => {
        const expanded = expandedGroups.has(group.id);
        const hiddenCount = Math.max(0, group.items.length - maxVisiblePerGroup);
        const visibleItems = expanded || hiddenCount === 0 ? group.items : group.items.slice(0, maxVisiblePerGroup);

        return (
          <div key={group.id} className={styles.groupBlock}>
            <div className={styles.groupHeader}>
              {group.icon && (
                <span className={styles.groupHeaderIcon} aria-hidden="true">
                  <Icon name={group.icon} size={15} />
                </span>
              )}
              <span className={styles.groupHeaderLabel}>{group.label}</span>
            </div>
            <div className={styles.groupItems}>
              {visibleItems.map((item) => (
                <ListItem
                  key={item.id}
                  className={cx(styles.navListItem, item.className)}
                  leading={item.leading}
                  label={item.label}
                  description={item.description}
                  trailing={item.trailing}
                  active={item.active}
                  onClick={item.onClick}
                />
              ))}
            </div>
            {!expanded && hiddenCount > 0 && (
              <button type="button" className={styles.groupShowMore} onClick={() => toggleGroup(group.id)}>
                Show more
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** Small icon button for section header actions. */
export function NavSidebarSectionAction({
  label,
  onClick,
  children = "+",
}: {
  label: string;
  onClick?: () => void;
  children?: ReactNode;
}) {
  return (
    <button type="button" className={styles.sectionHeaderButton} aria-label={label} onClick={onClick}>
      {children}
    </button>
  );
}

/**
 * The recurring "header → primary action → quick links → grouped scrollable list →
 * profile footer" sidebar shared across workspace apps.
 */
export function NavSidebar({
  header,
  primaryAction,
  quickLinks,
  sections,
  footer,
  className,
}: NavSidebarProps) {
  return (
    <div className={cx(styles.sidebar, className)}>
      {header && <div className={styles.headerSlot}>{header}</div>}

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
                  className={styles.navListItem}
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

      <ScrollArea className={styles.sectionsScroll}>
        <div className={styles.sections}>
          {sections.map((section) => (
            <div key={section.id}>
              <NavSidebarSectionHeader title={section.title} action={section.action} />
              {section.beforeItems}
              {section.content ?? (
                <div className={styles.sectionItems}>
                  {section.items?.map((item) => (
                    <ListItem
                      key={item.id}
                      className={cx(styles.navListItem, item.className)}
                      leading={item.leading}
                      label={item.label}
                      description={item.description}
                      trailing={item.trailing}
                      active={item.active}
                      onClick={item.onClick}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
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
  /** Replaces the default more-vertical icon when provided. */
  trailing?: ReactNode;
  /** Avatar-only layout for narrow rails. */
  compact?: boolean;
}

/** The "avatar + name + plan/status" row anchored to the bottom of every sidebar. */
export function SidebarUserFooter({
  name,
  meta,
  avatarSrc,
  status = "online",
  onClick,
  trailing,
  compact = false,
}: SidebarUserFooterProps) {
  return (
    <button
      type="button"
      className={cx("lf-focusable", styles.userFooter, compact && styles.userFooterCompact)}
      onClick={onClick}
    >
      <Avatar name={name} src={avatarSrc} status={status} size="md" />
      {!compact && (
        <>
          <span className={styles.userFooterBody}>
            <span className={styles.userFooterName}>{name}</span>
            {meta && <span className={styles.userFooterMeta}>{meta}</span>}
          </span>
          {trailing ?? <Icon name="more-vertical" size={15} />}
        </>
      )}
    </button>
  );
}

export interface SidebarUserFooterBarProps {
  name: string;
  meta?: ReactNode;
  avatarSrc?: string;
  status?: AvatarStatus;
  actions?: ReactNode;
}

/** Non-interactive footer row with avatar, status, and action icons (Slack, Settings). */
export function SidebarUserFooterBar({ name, meta, avatarSrc, status = "online", actions }: SidebarUserFooterBarProps) {
  return (
    <div className={styles.userFooterBar}>
      <Avatar name={name} src={avatarSrc} status={status} size="md" />
      <span className={styles.userFooterBody}>
        <span className={styles.userFooterName}>{name}</span>
        {meta && <span className={styles.userFooterMeta}>{meta}</span>}
      </span>
      {actions && <div className={styles.userFooterActions}>{actions}</div>}
    </div>
  );
}
