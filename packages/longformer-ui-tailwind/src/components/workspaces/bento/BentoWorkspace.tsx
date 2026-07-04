import { useCallback, useMemo, useState } from "react";
import { Icon } from "../../../icons";
import { Menu, type MenuItemDescriptor } from "../../primitives/Menu";
import { BentoGrid } from "./BentoGrid";
import { clampItemToGrid, findNextFreeSpot } from "./grid-utils";
import { BENTO_SAMPLE_ITEMS, BENTO_WIDGET_CATALOG } from "./sample-data";
import type { BentoItem, BentoWidgetTemplate } from "./types";
import styles from "./BentoWorkspace.tailwind";

export interface BentoWorkspaceProps {
  initialItems?: BentoItem[];
  catalog?: BentoWidgetTemplate[];
}

function createInstanceId(templateId: string) {
  return `${templateId}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

/** Interactive bento board — drag, resize, and add/remove widgets on a visible grid. */
export function BentoWorkspace({
  initialItems = BENTO_SAMPLE_ITEMS,
  catalog = BENTO_WIDGET_CATALOG,
}: BentoWorkspaceProps) {
  const [items, setItems] = useState<BentoItem[]>(() => initialItems.map((item) => clampItemToGrid(item)));
  const [activeId, setActiveId] = useState<string | null>(initialItems[0]?.id ?? null);

  const placedTemplateIds = useMemo(() => new Set(items.map((item) => item.templateId)), [items]);

  const addWidget = useCallback(
    (template: BentoWidgetTemplate) => {
      const spot = findNextFreeSpot(template.colSpan, template.rowSpan, items);
      if (!spot) return;

      const nextItem: BentoItem = {
        id: createInstanceId(template.templateId),
        templateId: template.templateId,
        label: template.label,
        col: spot.col,
        row: spot.row,
        colSpan: template.colSpan,
        rowSpan: template.rowSpan,
        content: template.content,
      };

      setItems((current) => [...current, nextItem]);
      setActiveId(nextItem.id);
    },
    [items],
  );

  const removeWidget = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
    setActiveId((current) => (current === id ? null : current));
  }, []);

  const moveWidget = useCallback((id: string, next: Pick<BentoItem, "col" | "row">) => {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        return clampItemToGrid({ ...item, ...next });
      }),
    );
  }, []);

  const resizeWidget = useCallback((id: string, next: Pick<BentoItem, "col" | "row" | "colSpan" | "rowSpan">) => {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        return clampItemToGrid({ ...item, ...next });
      }),
    );
  }, []);

  const menuItems = useMemo(() => {
    const available = catalog.filter((template) => !placedTemplateIds.has(template.templateId));
    const entries: MenuItemDescriptor[] = [];

    if (available.length > 0) {
      entries.push(
        ...available.map((template, index) => ({
          id: `add-${template.templateId}`,
          label: (
            <span className={styles.menuLabel}>
              <span>Add {template.label}</span>
              <span className={styles.menuMeta}>
                {template.colSpan}×{template.rowSpan}
              </span>
            </span>
          ),
          icon: "plus" as const,
          separatorAbove: index === 0,
          onSelect: () => addWidget(template),
        })),
      );
    }

    if (items.length > 0) {
      entries.push(
        ...items.map((item, index) => ({
          id: `remove-${item.id}`,
          label: `Remove ${item.label}`,
          icon: "trash" as const,
          danger: true,
          separatorAbove: index === 0 && available.length > 0,
          onSelect: () => removeWidget(item.id),
        })),
      );
    }

    if (entries.length === 0) {
      entries.push({
        id: "empty",
        label: "No widgets available",
        disabled: true,
      });
    }

    return entries;
  }, [addWidget, catalog, items, placedTemplateIds, removeWidget]);

  return (
    <div className={styles.workspace}>
      <div className={styles.menuFloat}>
        <Menu
          aria-label="Widget actions"
          align="end"
          trigger={
            <button type="button" className={styles.menuTrigger}>
              <Icon name="plus" size={16} />
              Widgets
              <Icon name="chevron-down" size={14} />
            </button>
          }
          items={menuItems}
        />
      </div>

      <BentoGrid
        items={items}
        activeId={activeId}
        onFocus={setActiveId}
        onMove={moveWidget}
        onResize={resizeWidget}
      />
    </div>
  );
}
