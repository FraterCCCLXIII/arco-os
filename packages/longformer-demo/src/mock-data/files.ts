import type { FileItem } from "longformer-ui";

export interface FileFolderNode {
  id: string;
  label: string;
  items: FileItem[];
}

export const fileFolders: Record<string, FileFolderNode> = {
  root: {
    id: "root",
    label: "My Drive",
    items: [
      { id: "f1", name: "Product", kind: "folder", itemCount: 12, owner: { name: "Alex Morgan" }, modifiedLabel: "Jul 1" },
      { id: "f2", name: "Design", kind: "folder", itemCount: 34, owner: { name: "Riley Chen" }, modifiedLabel: "Jun 29" },
      { id: "f3", name: "Engineering", kind: "folder", itemCount: 8, owner: { name: "Jordan Hayes" }, modifiedLabel: "Jun 28" },
      {
        id: "f4",
        name: "Longformer roadmap.docx",
        kind: "doc",
        sizeLabel: "48 KB",
        owner: { name: "Alex Morgan" },
        modifiedLabel: "2h ago",
        starred: true,
        previewText: "Q3 roadmap covering agent workspaces, desktop shell polish, and generated UI blocks.",
      },
      {
        id: "f5",
        name: "Q3 planning.xlsx",
        kind: "sheet",
        sizeLabel: "112 KB",
        owner: { name: "Sam Patel" },
        modifiedLabel: "Yesterday",
      },
      {
        id: "f6",
        name: "Investor update deck.pptx",
        kind: "slides",
        sizeLabel: "4.2 MB",
        owner: { name: "Alex Morgan" },
        modifiedLabel: "Jun 30",
        starred: true,
      },
      {
        id: "f7",
        name: "Signed MSA.pdf",
        kind: "pdf",
        sizeLabel: "820 KB",
        owner: { name: "Jordan Hayes" },
        modifiedLabel: "Jun 27",
      },
      {
        id: "f8",
        name: "Dashboard mock.png",
        kind: "image",
        sizeLabel: "2.1 MB",
        owner: { name: "Riley Chen" },
        modifiedLabel: "Jun 26",
      },
      {
        id: "f9",
        name: "Demo walkthrough.mp4",
        kind: "video",
        sizeLabel: "84.3 MB",
        owner: { name: "Sam Patel" },
        modifiedLabel: "Jun 24",
      },
    ],
  },
  f1: {
    id: "f1",
    label: "Product",
    items: [
      { id: "f1-1", name: "Feature specs", kind: "folder", itemCount: 5, owner: { name: "Alex Morgan" }, modifiedLabel: "Jun 30" },
      {
        id: "f1-2",
        name: "Longformer PRD.docx",
        kind: "doc",
        sizeLabel: "64 KB",
        owner: { name: "Alex Morgan" },
        modifiedLabel: "Jun 29",
      },
      {
        id: "f1-3",
        name: "Competitive analysis.xlsx",
        kind: "sheet",
        sizeLabel: "88 KB",
        owner: { name: "Sam Patel" },
        modifiedLabel: "Jun 22",
      },
    ],
  },
  f2: {
    id: "f2",
    label: "Design",
    items: [
      {
        id: "f2-1",
        name: "Nav rail explorations.png",
        kind: "image",
        sizeLabel: "3.4 MB",
        owner: { name: "Riley Chen" },
        modifiedLabel: "Jun 29",
        starred: true,
      },
      {
        id: "f2-2",
        name: "Design tokens.zip",
        kind: "archive",
        sizeLabel: "1.1 MB",
        owner: { name: "Riley Chen" },
        modifiedLabel: "Jun 18",
      },
    ],
  },
  f3: {
    id: "f3",
    label: "Engineering",
    items: [
      {
        id: "f3-1",
        name: "websocket-gateway.ts",
        kind: "code",
        sizeLabel: "6 KB",
        owner: { name: "Jordan Hayes" },
        modifiedLabel: "18m ago",
        previewText: "export function connectGateway(url: string) {\n  return new WebSocket(url);\n}",
      },
      {
        id: "f3-2",
        name: "ci-watchdog.zip",
        kind: "archive",
        sizeLabel: "220 KB",
        owner: { name: "Sam Patel" },
        modifiedLabel: "Jun 28",
      },
    ],
  },
};
