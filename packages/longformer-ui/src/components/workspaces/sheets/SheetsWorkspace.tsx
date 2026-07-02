import { useEffect, useMemo, useState } from "react";
import { Icon } from "../../../icons";
import { cx } from "../../../utils/cx";
import { Avatar } from "../../primitives/Avatar";
import { Button } from "../../primitives/Button";
import { IconButton } from "../../primitives/IconButton";
import { SidebarPane } from "../../shell/NavSidebar";
import { FormulaBar } from "./FormulaBar";
import { SheetGridView } from "./SheetGridView";
import { SheetsSidebar } from "./SheetsSidebar";
import { SheetsToolbar } from "./SheetsToolbar";
import {
  cellAddress,
  formatCellDisplay,
  SHEETS_MENU_ITEMS,
  type Cell,
  type CellSelection,
  type Sheet,
  type SheetCells,
  type SheetsLocation,
  type SheetsWorkspaceData,
} from "./types";
import styles from "./SheetsWorkspace.module.css";

export interface SheetsWorkspaceProps {
  data: SheetsWorkspaceData;
  activeWorkbookId?: string;
  defaultActiveWorkbookId?: string;
  onActiveWorkbookChange?: (workbookId: string) => void;
  activeSheetId?: string;
  defaultActiveSheetId?: string;
  onActiveSheetChange?: (sheetId: string) => void;
  location?: SheetsLocation;
  defaultLocation?: SheetsLocation;
  onLocationChange?: (location: SheetsLocation) => void;
  showSidebar?: boolean;
  className?: string;
}

function cloneCells(cells: SheetCells): SheetCells {
  return Object.fromEntries(Object.entries(cells).map(([key, cell]) => [key, { ...cell, format: cell.format ? { ...cell.format } : undefined }]));
}

/** Google Sheets-style spreadsheet workspace with toolbar, formula bar, and editable grid. */
export function SheetsWorkspace({
  data,
  activeWorkbookId: controlledActiveWorkbookId,
  defaultActiveWorkbookId,
  onActiveWorkbookChange,
  activeSheetId: controlledActiveSheetId,
  defaultActiveSheetId,
  onActiveSheetChange,
  location: controlledLocation,
  defaultLocation = "home",
  onLocationChange,
  showSidebar = true,
  className,
}: SheetsWorkspaceProps) {
  const initialWorkbook = data.workbooks.find((workbook) => workbook.id === defaultActiveWorkbookId) ?? data.workbooks[0];
  const initialSheetId = defaultActiveSheetId ?? initialWorkbook?.sheets[0]?.id;

  const [internalActiveWorkbookId, setInternalActiveWorkbookId] = useState(initialWorkbook?.id);
  const [internalLocation, setInternalLocation] = useState<SheetsLocation>(defaultLocation);
  const [internalActiveSheetId, setInternalActiveSheetId] = useState(initialSheetId);
  const [starred, setStarred] = useState(Boolean(initialWorkbook?.starred));
  const [sheetCells, setSheetCells] = useState<Record<string, SheetCells>>(() =>
    Object.fromEntries((initialWorkbook?.sheets ?? []).map((sheet) => [sheet.id, cloneCells(sheet.cells)])),
  );
  const [selection, setSelection] = useState<CellSelection>({ col: 0, row: 0 });
  const [formulaDraft, setFormulaDraft] = useState<string | null>(null);
  const [history, setHistory] = useState<Record<string, SheetCells>[]>([sheetCells]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const activeWorkbookId = controlledActiveWorkbookId ?? internalActiveWorkbookId ?? data.workbooks[0]?.id;
  const location = controlledLocation ?? internalLocation;
  const activeWorkbook = data.workbooks.find((workbook) => workbook.id === activeWorkbookId) ?? data.workbooks[0];
  const activeSheetId = controlledActiveSheetId ?? internalActiveSheetId;
  const activeSheet = activeWorkbook?.sheets.find((sheet) => sheet.id === activeSheetId) ?? activeWorkbook?.sheets[0];
  const cells = activeSheet ? sheetCells[activeSheet.id] ?? {} : {};
  const selectedAddress = cellAddress(selection.col, selection.row);
  const selectedCell = cells[selectedAddress];
  const menuItems = data.menuItems ?? SHEETS_MENU_ITEMS;

  const activeFormats = useMemo(() => {
    const formats = new Set<string>();
    if (selectedCell?.format?.bold) formats.add("bold");
    if (selectedCell?.format?.italic) formats.add("italic");
    if (selectedCell?.format?.strikethrough) formats.add("strikethrough");
    if (selectedCell?.format?.align) formats.add(`align-${selectedCell.format.align}`);
    if (selectedCell?.format?.numberFormat === "currency") formats.add("currency");
    if (selectedCell?.format?.numberFormat === "percent") formats.add("percent");
    return formats;
  }, [selectedCell]);

  const formulaValue =
    formulaDraft ?? selectedCell?.formula ?? String(selectedCell?.value ?? "");

  function handleLocationChange(next: SheetsLocation) {
    if (onLocationChange) onLocationChange(next);
    else setInternalLocation(next);
  }

  function handleActiveWorkbookChange(workbookId: string) {
    if (onActiveWorkbookChange) onActiveWorkbookChange(workbookId);
    else setInternalActiveWorkbookId(workbookId);
  }

  function handleActiveSheetChange(sheetId: string) {
    if (onActiveSheetChange) onActiveSheetChange(sheetId);
    else setInternalActiveSheetId(sheetId);
    setSelection({ col: 0, row: 0 });
    setFormulaDraft(null);
  }

  function pushHistory(nextCellsBySheet: Record<string, SheetCells>) {
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(nextCellsBySheet);
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
    setSheetCells(nextCellsBySheet);
  }

  function updateActiveCells(updater: (current: SheetCells) => SheetCells) {
    if (!activeSheet) return;
    const nextSheetCells = {
      ...sheetCells,
      [activeSheet.id]: updater(sheetCells[activeSheet.id] ?? {}),
    };
    pushHistory(nextSheetCells);
  }

  function handleCellChange(address: string, cell: Cell) {
    updateActiveCells((current) => ({ ...current, [address]: cell }));
    setFormulaDraft(null);
  }

  function handleFormulaCommit(value: string) {
    handleCellChange(selectedAddress, {
      ...(selectedCell ?? { value: "" }),
      ...(value.startsWith("=")
        ? { value: value, formula: value }
        : { value: value === "" ? "" : Number.isNaN(Number(value)) ? value : Number(value), formula: undefined }),
    });
  }

  function handleToolAction(toolId: string) {
    if (toolId === "undo") {
      if (historyIndex <= 0) return;
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      setSheetCells(history[nextIndex]);
      return;
    }

    if (toolId === "redo") {
      if (historyIndex >= history.length - 1) return;
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setSheetCells(history[nextIndex]);
      return;
    }

    updateActiveCells((current) => {
      const existing = current[selectedAddress] ?? { value: "" };
      const format = { ...existing.format };

      switch (toolId) {
        case "bold":
          format.bold = !format.bold;
          break;
        case "italic":
          format.italic = !format.italic;
          break;
        case "strikethrough":
          format.strikethrough = !format.strikethrough;
          break;
        case "align-left":
          format.align = "left";
          break;
        case "align-center":
          format.align = "center";
          break;
        case "align-right":
          format.align = "right";
          break;
        case "currency":
          format.numberFormat = format.numberFormat === "currency" ? "plain" : "currency";
          break;
        case "percent":
          format.numberFormat = format.numberFormat === "percent" ? "plain" : "percent";
          break;
        default:
          return current;
      }

      return {
        ...current,
        [selectedAddress]: { ...existing, format },
      };
    });
  }

  function handleFormulaBarChange(value: string) {
    setFormulaDraft(value);
  }

  useEffect(() => {
    const workbook = data.workbooks.find((item) => item.id === activeWorkbookId);
    if (!workbook) return;

    const nextSheetCells = Object.fromEntries(
      workbook.sheets.map((sheet) => [sheet.id, cloneCells(sheet.cells)]),
    );

    setStarred(Boolean(workbook.starred));
    setSheetCells(nextSheetCells);
    setInternalActiveSheetId(workbook.sheets[0]?.id);
    setSelection({ col: 0, row: 0 });
    setFormulaDraft(null);
    setHistory([nextSheetCells]);
    setHistoryIndex(0);
  }, [activeWorkbookId, data.workbooks]);

  return (
    <div className={cx(styles.workspace, className)} aria-label="Sheets">
      {showSidebar && (
        <SidebarPane handleLabel="Resize sheets sidebar" className={styles.sidebarResizable} defaultWidth={240} maxWidth={300}>
          <SheetsSidebar
            workbooks={data.workbooks}
            activeWorkbookId={activeWorkbook?.id ?? ""}
            location={location}
            onLocationChange={handleLocationChange}
            onSelectWorkbook={handleActiveWorkbookChange}
          />
        </SidebarPane>
      )}

      <div className={styles.main}>
      <header className={styles.titleBar}>
        <div className={styles.titleLeft}>
          <div className={styles.appBadge} aria-hidden="true">
            <Icon name="grid" size={18} />
          </div>
          <div className={styles.titleBlock}>
            <div className={styles.titleRow}>
              <h1 className={styles.title}>{activeWorkbook?.title ?? "Untitled spreadsheet"}</h1>
              <IconButton
                icon="star"
                label={starred ? "Remove from starred" : "Add to starred"}
                variant="ghost"
                className={cx(starred && styles.starActive)}
                onClick={() => setStarred((value) => !value)}
              />
            </div>
            <nav className={styles.menuBar} aria-label="Spreadsheet menu">
              {menuItems.map((item) => (
                <button key={item} type="button" className={cx("lf-focusable", styles.menuItem)}>
                  {item}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className={styles.titleActions}>
          {data.collaborators && data.collaborators.length > 0 && (
            <div className={styles.avatarStack} aria-label={`${data.collaborators.length} collaborators`}>
              {data.collaborators.map((person) => (
                <Avatar key={person.name} name={person.name} src={person.src} size="sm" />
              ))}
            </div>
          )}
          <IconButton icon="video" label="Join a call" variant="ghost" />
          <IconButton icon="message-square" label="Open comment history" variant="ghost" />
          <Button variant="primary" size="sm">
            Share
          </Button>
        </div>
      </header>

      <SheetsToolbar
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        activeFormats={activeFormats}
        onToolAction={handleToolAction}
      />

      <FormulaBar
        cellAddress={selectedAddress}
        value={formulaValue}
        onChange={handleFormulaBarChange}
        onCommit={handleFormulaCommit}
      />

      <div className={styles.gridRegion}>
        {activeSheet ? (
          <SheetGridView
            sheet={activeSheet}
            cells={cells}
            selection={selection}
            onSelectionChange={(next) => {
              setSelection(next);
              setFormulaDraft(null);
            }}
            onCellChange={handleCellChange}
          />
        ) : null}
      </div>

      <footer className={styles.sheetTabs}>
        <div className={styles.sheetTabControls}>
          <IconButton icon="plus" label="Add sheet" variant="ghost" />
          <button type="button" className={cx("lf-focusable", styles.allSheetsButton)} aria-label="All sheets">
            <Icon name="layers" size={15} />
          </button>
        </div>
        <div className={cx("lf-scrollbar-hidden", styles.tabList)} role="tablist" aria-label="Sheet tabs">
          {(activeWorkbook?.sheets ?? []).map((sheet: Sheet) => {
            const active = sheet.id === activeSheetId;
            return (
              <button
                key={sheet.id}
                type="button"
                role="tab"
                aria-selected={active}
                className={cx("lf-focusable", styles.sheetTab, active && styles.sheetTabActive)}
                onClick={() => handleActiveSheetChange(sheet.id)}
              >
                <span className={styles.sheetTabLabel}>{sheet.name}</span>
              </button>
            );
          })}
        </div>
        <div className={styles.sheetSummary}>
          {selectedCell ? formatCellDisplay(selectedCell) : "Select a cell"}
        </div>
      </footer>
      </div>
    </div>
  );
}

export type {
  Cell,
  CellFormat,
  CellSelection,
  CellValue,
  Sheet,
  SheetCells,
  SheetsLocation,
  SheetsWorkspaceData,
  Workbook,
} from "./types";
