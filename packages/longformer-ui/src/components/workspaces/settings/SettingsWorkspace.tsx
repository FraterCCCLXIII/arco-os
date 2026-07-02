import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { Icon } from "../../../icons";
import { Avatar } from "../../primitives/Avatar";
import { Badge } from "../../primitives/Badge";
import { Button } from "../../primitives/Button";
import { Card } from "../../primitives/Card";
import { Divider } from "../../primitives/Divider";
import { IconButton } from "../../primitives/IconButton";
import { Input } from "../../primitives/Input";
import { ListItem } from "../../primitives/ListItem";
import { ScrollArea } from "../../primitives/ScrollArea";
import { NavSidebar, SidebarUserFooterBar } from "../../shell/NavSidebar";
import { cx } from "../../../utils/cx";
import type {
  SettingsContentSection,
  SettingsFieldRow,
  SettingsLinkRow,
  SettingsNavGroup,
  SettingsNavItem,
  SettingsSectionId,
  SettingsStanding,
  SettingsToggleRow,
  SettingsUserProfile,
  SettingsWorkspaceData,
} from "./types";
import styles from "./SettingsWorkspace.module.css";

export interface SettingsWorkspaceProps {
  data: SettingsWorkspaceData;
  activeSectionId?: SettingsSectionId;
  defaultSectionId?: SettingsSectionId;
  onSectionChange?: (sectionId: SettingsSectionId) => void;
  onClose?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  revealedFields?: Set<string>;
  onRevealField?: (fieldId: string) => void;
  toggleStates?: Record<string, boolean>;
  onToggleChange?: (toggleId: string, enabled: boolean) => void;
  sidebarFooter?: ReactNode;
}

function findNavItem(groups: SettingsNavGroup[], sectionId: SettingsSectionId): SettingsNavItem | undefined {
  for (const group of groups) {
    for (const item of group.items) {
      if (item.id === sectionId) return item;
      if (item.children) {
        const child = item.children.find((entry) => entry.id === sectionId);
        if (child) return child;
      }
    }
  }
  return undefined;
}

function parentNavItem(groups: SettingsNavGroup[], sectionId: SettingsSectionId): SettingsNavItem | undefined {
  for (const group of groups) {
    for (const item of group.items) {
      if (item.children?.some((child) => child.id === sectionId)) return item;
    }
  }
  return undefined;
}

function pageTitleForSection(
  groups: SettingsNavGroup[],
  sections: SettingsContentSection[],
  sectionId: SettingsSectionId,
): string {
  const parent = parentNavItem(groups, sectionId);
  if (parent) return parent.label;
  const navItem = findNavItem(groups, sectionId);
  if (navItem) return navItem.label;
  return sections.find((section) => section.id === sectionId)?.title ?? "Settings";
}

function filterNavGroups(groups: SettingsNavGroup[], query: string): SettingsNavGroup[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return groups;

  return groups
    .map((group) => {
      const items = group.items
        .map((item) => {
          const itemMatches = item.label.toLowerCase().includes(normalized);
          const children = item.children?.filter((child) => child.label.toLowerCase().includes(normalized));
          if (itemMatches) return item;
          if (children && children.length > 0) return { ...item, children };
          return null;
        })
        .filter((item): item is SettingsNavItem => item !== null);

      return items.length > 0 ? { ...group, items } : null;
    })
    .filter((group): group is SettingsNavGroup => group !== null);
}

function renderStandingDescription(standing: SettingsStanding) {
  const parts = standing.description.split(/(\[\[link\d+\]\])/g);
  let linkIndex = 0;

  return parts.map((part, index) => {
    const match = part.match(/^\[\[link(\d+)\]\]$/);
    if (match) {
      const label = standing.linkLabels?.[linkIndex] ?? "Learn more";
      linkIndex += 1;
      return (
        <a key={`link-${index}`} href="#">
          {label}
        </a>
      );
    }
    return <span key={`text-${index}`}>{part}</span>;
  });
}

function FieldRow({
  row,
  revealed,
  onReveal,
}: {
  row: SettingsFieldRow;
  revealed?: boolean;
  onReveal?: () => void;
}) {
  const displayValue = row.masked && !revealed ? (row.maskedDisplay ?? row.value) : row.value;

  return (
    <div className={styles.fieldRow}>
      <div className={styles.fieldLabel}>{row.label}</div>
      <div className={styles.fieldValueWrap}>
        <span>{displayValue}</span>
      </div>
      <div className={styles.fieldActions}>
        {row.actions?.map((action) => {
          if (action.type === "reveal" && !revealed) {
            return (
              <Button
                key={`${row.id}-reveal`}
                type="button"
                variant="ghost"
                size="sm"
                className={styles.linkAction}
                onClick={onReveal}
              >
                {action.label ?? "Reveal"}
              </Button>
            );
          }
          if (action.type === "edit") {
            return (
              <Button key={`${row.id}-edit`} type="button" variant="secondary" size="sm">
                {action.label ?? "Edit"}
              </Button>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

function LinkRow({ row }: { row: SettingsLinkRow }) {
  return (
    <ListItem
      className={styles.contentListItem}
      label={row.label}
      description={row.hint}
      trailing={
        <>
          {row.value}
          <Icon name="chevron-right" size={16} />
        </>
      }
    />
  );
}

function ToggleRow({
  row,
  enabled,
  onChange,
}: {
  row: SettingsToggleRow;
  enabled: boolean;
  onChange?: (next: boolean) => void;
}) {
  return (
    <div className={styles.toggleRow}>
      <div className={styles.toggleLabel}>{row.label}</div>
      <div className={styles.toggleBody}>
        {row.description && <div className={styles.toggleDescription}>{row.description}</div>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        className={cx(styles.toggleSwitch, enabled && styles.toggleSwitchOn)}
        onClick={() => onChange?.(!enabled)}
      >
        <span className={styles.toggleKnob} />
      </button>
    </div>
  );
}

function ContentSection({
  section,
  sectionRef,
  revealedFields,
  onRevealField,
  toggleStates,
  onToggleChange,
}: {
  section: SettingsContentSection;
  sectionRef?: (node: HTMLElement | null) => void;
  revealedFields?: Set<string>;
  onRevealField?: (fieldId: string) => void;
  toggleStates?: Record<string, boolean>;
  onToggleChange?: (toggleId: string, enabled: boolean) => void;
}) {
  return (
    <section id={section.id} ref={sectionRef} className={styles.contentSection}>
      <h2 className={styles.sectionTitle}>{section.title}</h2>
      {section.intro && <p className={styles.sectionIntro}>{section.intro}</p>}

      {section.fields?.map((row) => (
        <FieldRow
          key={row.id}
          row={row}
          revealed={revealedFields?.has(row.id)}
          onReveal={() => onRevealField?.(row.id)}
        />
      ))}

      {section.links?.map((row) => (
        <LinkRow key={row.id} row={row} />
      ))}

      {section.toggles?.map((row) => (
        <ToggleRow
          key={row.id}
          row={row}
          enabled={toggleStates?.[row.id] ?? row.enabled}
          onChange={(next) => onToggleChange?.(row.id, next)}
        />
      ))}

      {section.standing && (
        <Card interactive className={styles.standingCard}>
          <div
            className={cx(
              styles.standingIcon,
              section.standing.status === "warning" && styles.standingIconWarning,
              section.standing.status === "restricted" && styles.standingIconRestricted,
            )}
          >
            <Icon name="check" size={20} />
          </div>
          <div className={styles.standingBody}>
            <h3 className={styles.standingTitle}>{section.standing.title}</h3>
            <p className={styles.standingDescription}>{renderStandingDescription(section.standing)}</p>
          </div>
          <Icon name="chevron-right" size={18} />
        </Card>
      )}

      {!section.fields?.length &&
        !section.links?.length &&
        !section.toggles?.length &&
        !section.standing && <div className={styles.emptySection}>No settings in this section yet.</div>}
    </section>
  );
}

function NavButton({
  item,
  depth = 0,
  activeSectionId,
  expandedParentId,
  onSelect,
}: {
  item: SettingsNavItem;
  depth?: number;
  activeSectionId: SettingsSectionId;
  expandedParentId?: SettingsSectionId;
  onSelect: (sectionId: SettingsSectionId) => void;
}) {
  const hasChildren = Boolean(item.children?.length);
  const isParentActive = hasChildren && item.children!.some((child) => child.id === activeSectionId);
  const isExpanded = expandedParentId === item.id || isParentActive;
  const isActive = !hasChildren && item.id === activeSectionId;

  return (
    <div>
      <ListItem
        className={cx(depth > 0 ? styles.subNavItem : styles.navListItem)}
        leading={depth === 0 && item.icon ? <Icon name={item.icon} size={15} /> : undefined}
        label={item.label}
        trailing={
          item.badge ? (
            <Badge tone="accent" className={styles.promoBadge}>
              {item.badge}
            </Badge>
          ) : undefined
        }
        active={isActive}
        onClick={() => onSelect(hasChildren ? item.children![0].id : item.id)}
      />
      {hasChildren && isExpanded && (
        <div className={styles.subNav}>
          {item.children!.map((child) => (
            <ListItem
              key={child.id}
              className={cx(styles.subNavItem, styles.navListItem)}
              label={child.label}
              active={child.id === activeSectionId}
              onClick={() => onSelect(child.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Discord-style two-pane settings surface with sidebar navigation and scrollable detail sections. */
export function SettingsWorkspace({
  data,
  activeSectionId: controlledSectionId,
  defaultSectionId = "account-info",
  onSectionChange,
  onClose,
  searchQuery: controlledSearchQuery,
  onSearchChange,
  revealedFields: controlledRevealedFields,
  onRevealField,
  toggleStates: controlledToggleStates,
  onToggleChange,
  sidebarFooter,
}: SettingsWorkspaceProps) {
  const [internalSectionId, setInternalSectionId] = useState<SettingsSectionId>(defaultSectionId);
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const [internalRevealedFields, setInternalRevealedFields] = useState<Set<string>>(() => new Set());
  const [internalToggleStates, setInternalToggleStates] = useState<Record<string, boolean>>({});

  const activeSectionId = controlledSectionId ?? internalSectionId;
  const searchQuery = controlledSearchQuery ?? internalSearchQuery;
  const revealedFields = controlledRevealedFields ?? internalRevealedFields;
  const toggleStates = controlledToggleStates ?? internalToggleStates;

  const sectionRefs = useRef(new Map<SettingsSectionId, HTMLElement | null>());

  const filteredNav = useMemo(() => filterNavGroups(data.nav, searchQuery), [data.nav, searchQuery]);

  const visibleSections = useMemo(() => {
    const accountSections: SettingsSectionId[] = [
      "account-info",
      "password-security",
      "account-standing",
      "family-center",
    ];
    if (accountSections.includes(activeSectionId)) {
      return data.sections.filter((section) => accountSections.includes(section.id));
    }
    return data.sections.filter((section) => section.id === activeSectionId);
  }, [activeSectionId, data.sections]);

  const pageTitle = useMemo(
    () => pageTitleForSection(data.nav, data.sections, activeSectionId),
    [activeSectionId, data.nav, data.sections],
  );

  const expandedParentId = parentNavItem(data.nav, activeSectionId)?.id;

  const handleSelectSection = useCallback(
    (sectionId: SettingsSectionId) => {
      if (onSectionChange) onSectionChange(sectionId);
      else setInternalSectionId(sectionId);

      const node = sectionRefs.current.get(sectionId);
      node?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [onSectionChange],
  );

  const handleSearchChange = (value: string) => {
    if (onSearchChange) onSearchChange(value);
    else setInternalSearchQuery(value);
  };

  const handleRevealField = (fieldId: string) => {
    if (onRevealField) {
      onRevealField(fieldId);
      return;
    }
    setInternalRevealedFields((prev) => new Set([...prev, fieldId]));
  };

  const handleToggleChange = (toggleId: string, enabled: boolean) => {
    if (onToggleChange) {
      onToggleChange(toggleId, enabled);
      return;
    }
    setInternalToggleStates((prev) => ({ ...prev, [toggleId]: enabled }));
  };

  return (
    <div className={styles.workspace}>
      <NavSidebar
        className={styles.sidebar}
        header={
          <>
            <ProfileHeader user={data.user} />
            <Input
              type="search"
              placeholder="Search"
              value={searchQuery}
              onChange={(event) => handleSearchChange(event.target.value)}
              aria-label="Search settings"
              startSlot={<Icon name="search" size={14} />}
              wrapperClassName={styles.searchInput}
            />
          </>
        }
        sections={filteredNav.map((group) => ({
          id: group.id,
          title: group.label,
          content: (
            <div className={styles.navItems}>
              {group.items.map((item) => (
                <NavButton
                  key={item.id}
                  item={item}
                  activeSectionId={activeSectionId}
                  expandedParentId={expandedParentId}
                  onSelect={handleSelectSection}
                />
              ))}
            </div>
          ),
        }))}
        footer={sidebarFooter ?? <DefaultSidebarFooter user={data.user} />}
      />

      <div className={styles.main}>
        <header className={styles.mainHeader}>
          <h1 className={styles.mainTitle}>{pageTitle}</h1>
          {onClose && <IconButton icon="close" label="Close settings" onClick={onClose} />}
        </header>

        <ScrollArea className={styles.mainScroll}>
          <div className={styles.mainInner}>
            {visibleSections.map((section, index) => (
              <div key={section.id}>
                {index > 0 && <Divider className={styles.sectionDivider} />}
                <ContentSection
                  section={section}
                  sectionRef={(node) => {
                    sectionRefs.current.set(section.id, node);
                  }}
                  revealedFields={revealedFields}
                  onRevealField={handleRevealField}
                  toggleStates={toggleStates}
                  onToggleChange={handleToggleChange}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

function ProfileHeader({ user }: { user: SettingsUserProfile }) {
  return (
    <div className={styles.profile}>
      <Avatar name={user.name} src={user.avatarSrc} size="md" />
      <div className={styles.profileMeta}>
        <div className={styles.profileName}>{user.name}</div>
        <Button variant="ghost" size="sm" className={styles.editProfiles}>
          <Icon name="edit" size={12} />
          {user.editProfilesLabel ?? "Edit Profiles"}
        </Button>
      </div>
    </div>
  );
}

function DefaultSidebarFooter({ user }: { user: SettingsUserProfile }) {
  return (
    <SidebarUserFooterBar
      name={user.name}
      avatarSrc={user.avatarSrc}
      status="online"
      meta={
        <Badge tone="success" dot>
          Online
        </Badge>
      }
      actions={
        <>
          <IconButton icon="mic" label="Mute" size="sm" />
          <IconButton icon="volume" label="Deafen" size="sm" />
          <IconButton icon="settings" label="User settings" size="sm" />
        </>
      }
    />
  );
}

export type {
  SettingsWorkspaceData,
  SettingsSectionId,
  SettingsNavGroup,
  SettingsContentSection,
  SettingsUserProfile,
};
