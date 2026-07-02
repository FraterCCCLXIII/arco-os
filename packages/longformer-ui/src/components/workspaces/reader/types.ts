export interface EbookChapter {
  id: string;
  title: string;
  /** Plain-text excerpt shown in the reader pane. */
  content: string;
}

export interface Ebook {
  id: string;
  title: string;
  author: string;
  progressPercent: number;
  chapters: EbookChapter[];
}

export type ReaderFontSize = "sm" | "md" | "lg";
