import { useState } from "react";
import { Icon } from "../../../icons";
import { ScrollArea } from "../../primitives/ScrollArea";
import { ResizablePane } from "../../primitives/ResizablePane";
import { ListItem } from "../../primitives/ListItem";
import { Chip } from "../../primitives/Chip";
import { IconButton } from "../../primitives/IconButton";
import { Badge } from "../../primitives/Badge";
import { EmptyState } from "../../primitives/EmptyState";
import type { Ebook, ReaderFontSize } from "./types";
import styles from "./ReaderWorkspace.tailwind";

export interface ReaderWorkspaceProps {
  books: Ebook[];
  activeBookId?: string;
  defaultActiveBookId?: string;
  onSelectBook?: (id: string) => void;
  activeChapterId?: string;
  defaultActiveChapterId?: string;
  onSelectChapter?: (id: string) => void;
  fontSize?: ReaderFontSize;
  defaultFontSize?: ReaderFontSize;
  onFontSizeChange?: (size: ReaderFontSize) => void;
  libraryPaneWidth?: number;
  defaultLibraryPaneWidth?: number;
  onLibraryPaneWidthChange?: (width: number) => void;
}

const FONT_SIZE_LABEL: Record<ReaderFontSize, string> = {
  sm: "A",
  md: "A",
  lg: "A",
};

/** Simple e-reader with a library sidebar and a focused reading pane. */
export function ReaderWorkspace({
  books,
  activeBookId: controlledActiveBookId,
  defaultActiveBookId,
  onSelectBook,
  activeChapterId: controlledActiveChapterId,
  defaultActiveChapterId,
  onSelectChapter,
  fontSize: controlledFontSize,
  defaultFontSize = "md",
  onFontSizeChange,
  libraryPaneWidth,
  defaultLibraryPaneWidth = 260,
  onLibraryPaneWidthChange,
}: ReaderWorkspaceProps) {
  const [internalActiveBookId, setInternalActiveBookId] = useState(
    defaultActiveBookId ?? books[0]?.id,
  );
  const [internalActiveChapterId, setInternalActiveChapterId] = useState(
    defaultActiveChapterId ?? books[0]?.chapters[0]?.id,
  );
  const [internalFontSize, setInternalFontSize] = useState<ReaderFontSize>(defaultFontSize);

  const activeBookId = controlledActiveBookId ?? internalActiveBookId;
  const fontSize = controlledFontSize ?? internalFontSize;

  const activeBook = books.find((book) => book.id === activeBookId) ?? books[0];
  const activeChapterId =
    controlledActiveChapterId ??
    internalActiveChapterId ??
    activeBook?.chapters[0]?.id;
  const activeChapter =
    activeBook?.chapters.find((chapter) => chapter.id === activeChapterId) ??
    activeBook?.chapters[0];

  function handleSelectBook(id: string) {
    if (onSelectBook) onSelectBook(id);
    else setInternalActiveBookId(id);

    const book = books.find((item) => item.id === id);
    const firstChapter = book?.chapters[0]?.id;
    if (firstChapter) {
      if (onSelectChapter) onSelectChapter(firstChapter);
      else setInternalActiveChapterId(firstChapter);
    }
  }

  function handleSelectChapter(id: string) {
    if (onSelectChapter) onSelectChapter(id);
    else setInternalActiveChapterId(id);
  }

  function handleFontSizeChange(size: ReaderFontSize) {
    if (onFontSizeChange) onFontSizeChange(size);
    else setInternalFontSize(size);
  }

  return (
    <div className={styles.workspace}>
      <ResizablePane
        width={libraryPaneWidth}
        defaultWidth={defaultLibraryPaneWidth}
        onWidthChange={onLibraryPaneWidthChange}
        minWidth={200}
        maxWidth={360}
        handleSide="right"
        className={styles.libraryResizable}
        paneClassName={styles.libraryPane}
        handleLabel="Resize library panel"
      >
        <div className={styles.libraryHeader}>
          <Icon name="bookmark" size={15} />
          Library
        </div>
        <ScrollArea className={styles.libraryScroll}>
          <div className={styles.libraryList}>
            {books.map((book) => (
              <ListItem
                key={book.id}
                active={book.id === activeBookId}
                onClick={() => handleSelectBook(book.id)}
                leading={<Icon name="notebook" size={16} />}
                label={book.title}
                description={book.author}
                trailing={
                  <Badge tone="accent">{`${book.progressPercent}%`}</Badge>
                }
              />
            ))}
          </div>
        </ScrollArea>
      </ResizablePane>

      <div className={styles.main}>
        {activeBook ? (
          <>
            <div className={styles.toolbar}>
              <div className={styles.bookMeta}>
                <div className={styles.bookTitle}>{activeBook.title}</div>
                <div className={styles.bookAuthor}>{activeBook.author}</div>
              </div>
              <div className={styles.toolbarActions}>
                <div className={styles.fontChips}>
                  {(["sm", "md", "lg"] as const).map((size) => (
                    <Chip
                      key={size}
                      active={fontSize === size}
                      onClick={() => handleFontSizeChange(size)}
                    >
                      {FONT_SIZE_LABEL[size]}
                    </Chip>
                  ))}
                </div>
                <IconButton icon="bookmark" label="Bookmark page" variant="ghost" />
              </div>
            </div>
            <div className={styles.progressBar} aria-hidden="true">
              <div
                className={styles.progressFill}
                style={{ width: `${activeBook.progressPercent}%` }}
              />
            </div>
            <ScrollArea className={styles.readerScroll}>
              <div className={styles.readerPage}>
                {activeBook.chapters.length > 1 && (
                  <div className={styles.fontChips} style={{ marginBottom: 16 }}>
                    {activeBook.chapters.map((chapter) => (
                      <Chip
                        key={chapter.id}
                        active={chapter.id === activeChapter?.id}
                        onClick={() => handleSelectChapter(chapter.id)}
                      >
                        {chapter.title}
                      </Chip>
                    ))}
                  </div>
                )}
                {activeChapter ? (
                  <>
                    <h1 className={styles.chapterTitle}>{activeChapter.title}</h1>
                    <div
                      className={`${styles.chapterBody} ${styles[`chapterBody${fontSize.charAt(0).toUpperCase()}${fontSize.slice(1)}`]}`}
                    >
                      {activeChapter.content.split("\n\n").map((paragraph, index) => (
                        <p key={index} style={{ marginBottom: "1.25em" }}>
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </>
                ) : (
                  <EmptyState
                    icon={<Icon name="bookmark" size={22} />}
                    title="No chapter selected"
                    description="Pick a chapter from the chips above."
                  />
                )}
              </div>
            </ScrollArea>
          </>
        ) : (
          <EmptyState
            icon={<Icon name="bookmark" size={22} />}
            title="Your library is empty"
            description="Add books to start reading."
          />
        )}
      </div>
    </div>
  );
}

export type { Ebook, EbookChapter, ReaderFontSize } from "./types";
