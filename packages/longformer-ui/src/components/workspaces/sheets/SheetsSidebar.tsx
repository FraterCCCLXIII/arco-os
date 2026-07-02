import { useMemo } from "react";
import { Icon } from "../../../icons";
import { NavSidebar } from "../../shell/NavSidebar";
import type { SheetsLocation, Workbook } from "./types";
import styles from "./SheetsSidebar.module.css";

const LOCATIONS: { id: SheetsLocation; label: string; icon: "home" | "clock" | "star" | "users" }[] = [
  { id: "home", label: "Home", icon: "home" },
  { id: "recent", label: "Recent", icon: "clock" },
  { id: "starred", label: "Starred", icon: "star" },
  { id: "shared", label: "Shared with me", icon: "users" },
];

export interface SheetsSidebarProps {
  workbooks: Workbook[];
  activeWorkbookId: string;
  location: SheetsLocation;
  onLocationChange: (location: SheetsLocation) => void;
  onSelectWorkbook: (workbookId: string) => void;
  onNewWorkbook?: () => void;
}

/** Drive-style left nav for browsing and switching between spreadsheets. */
export function SheetsSidebar({
  workbooks,
  activeWorkbookId,
  location,
  onLocationChange,
  onSelectWorkbook,
  onNewWorkbook,
}: SheetsSidebarProps) {
  const filteredWorkbooks = useMemo(() => {
    switch (location) {
      case "starred":
        return workbooks.filter((workbook) => workbook.starred);
      case "shared":
        return workbooks.filter((workbook) => workbook.shared);
      case "recent":
        return [...workbooks].slice(0, 6);
      case "home":
      default:
        return workbooks;
    }
  }, [location, workbooks]);

  const starredWorkbooks = workbooks.filter((workbook) => workbook.starred);
  const sections =
    location === "home"
      ? [
          ...(starredWorkbooks.length > 0
            ? [
                {
                  id: "starred",
                  title: "Starred",
                  items: starredWorkbooks.map((workbook) => ({
                    id: workbook.id,
                    label: workbook.title,
                    description: workbook.meta,
                    leading: <Icon name="grid" size={15} />,
                    trailing: <Icon name="star" size={12} className={styles.starTrailing} />,
                    active: workbook.id === activeWorkbookId,
                    onClick: () => onSelectWorkbook(workbook.id),
                    className: styles.workbookItem,
                  })),
                },
              ]
            : []),
          {
            id: "recent",
            title: "Recent spreadsheets",
            items: filteredWorkbooks.map((workbook) => ({
              id: workbook.id,
              label: workbook.title,
              description: workbook.shared ? workbook.owner ?? "Shared" : workbook.meta,
              leading: <Icon name="grid" size={15} />,
              trailing: workbook.starred ? <Icon name="star" size={12} className={styles.starTrailing} /> : workbook.meta,
              active: workbook.id === activeWorkbookId,
              onClick: () => onSelectWorkbook(workbook.id),
              className: styles.workbookItem,
            })),
          },
        ]
      : [
          {
            id: "results",
            title:
              location === "recent"
                ? "Recent"
                : location === "starred"
                  ? "Starred"
                  : "Shared with me",
            items: filteredWorkbooks.map((workbook) => ({
              id: workbook.id,
              label: workbook.title,
              description: workbook.shared ? workbook.owner ?? "Shared" : workbook.meta,
              leading: <Icon name="grid" size={15} />,
              trailing: workbook.starred ? <Icon name="star" size={12} className={styles.starTrailing} /> : workbook.meta,
              active: workbook.id === activeWorkbookId,
              onClick: () => onSelectWorkbook(workbook.id),
              className: styles.workbookItem,
            })),
          },
        ];

  return (
    <NavSidebar
      className={styles.sidebar}
      header={
        <div className={styles.brand}>
          <div className={styles.brandRow}>
            <span className={styles.brandIcon}>
              <Icon name="grid" size={16} />
            </span>
            <span>Sheets</span>
          </div>
          <span className={styles.tagline}>Spreadsheets</span>
        </div>
      }
      primaryAction={
        onNewWorkbook
          ? { label: "Blank spreadsheet", icon: "plus", onClick: onNewWorkbook }
          : { label: "Blank spreadsheet", icon: "plus" }
      }
      quickLinks={LOCATIONS.map((item) => ({
        id: item.id,
        label: item.label,
        icon: item.icon,
        active: location === item.id,
        onClick: () => onLocationChange(item.id),
      }))}
      sections={sections}
    />
  );
}
