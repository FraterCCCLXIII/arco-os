import type { BlockFormat, TextAlign, TextMark } from "../notes/EditorToolbar";

export interface RichTextContent {
  plain: string;
  html: string;
}

const BLOCK_TAGS: Record<BlockFormat, string> = {
  paragraph: "p",
  heading1: "h1",
  heading2: "h2",
  heading3: "h3",
  bulletList: "ul",
  numberedList: "ol",
  quote: "blockquote",
};

const MARK_COMMANDS: Record<Exclude<TextMark, "code">, string> = {
  bold: "bold",
  italic: "italic",
  underline: "underline",
  strikethrough: "strikeThrough",
};

const ALIGN_COMMANDS: Record<TextAlign, string> = {
  left: "justifyLeft",
  center: "justifyCenter",
  right: "justifyRight",
};

function normalizeBlockTag(tag: string): BlockFormat {
  const value = tag.toLowerCase().replace(/[<>]/g, "");
  if (value === "h1") return "heading1";
  if (value === "h2") return "heading2";
  if (value === "h3") return "heading3";
  if (value === "blockquote") return "quote";
  return "paragraph";
}

export function readToolbarState() {
  const marks = new Set<TextMark>();
  if (document.queryCommandState("bold")) marks.add("bold");
  if (document.queryCommandState("italic")) marks.add("italic");
  if (document.queryCommandState("underline")) marks.add("underline");
  if (document.queryCommandState("strikeThrough")) marks.add("strikethrough");

  const selection = window.getSelection();
  const anchorNode = selection?.anchorNode;
  if (anchorNode && anchorNode.nodeType === Node.TEXT_NODE) {
    const parent = anchorNode.parentElement;
    if (parent?.closest("code")) marks.add("code");
  } else if (anchorNode instanceof Element && anchorNode.closest("code")) {
    marks.add("code");
  }

  let blockFormat: BlockFormat = "paragraph";
  const blockTag = document.queryCommandValue("formatBlock");
  if (blockTag) blockFormat = normalizeBlockTag(blockTag);
  if (document.queryCommandState("insertUnorderedList")) blockFormat = "bulletList";
  if (document.queryCommandState("insertOrderedList")) blockFormat = "numberedList";

  let align: TextAlign = "left";
  if (document.queryCommandState("justifyCenter")) align = "center";
  else if (document.queryCommandState("justifyRight")) align = "right";

  return {
    marks: Array.from(marks),
    blockFormat,
    align,
    canUndo: document.queryCommandState("undo"),
    canRedo: document.queryCommandState("redo"),
  };
}

export function applyMark(mark: TextMark, editor: HTMLElement) {
  editor.focus();

  if (mark === "code") {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      document.execCommand("insertHTML", false, "<code></code>");
      return;
    }

    const range = selection.getRangeAt(0);
    const codeParent = selection.anchorNode?.parentElement?.closest("code");
    if (codeParent) {
      const text = codeParent.textContent ?? "";
      const replacement = document.createTextNode(text);
      codeParent.replaceWith(replacement);
      selection.selectAllChildren(replacement);
      return;
    }

    if (range.collapsed) {
      document.execCommand("insertHTML", false, "<code></code>");
      return;
    }

    const selected = range.extractContents();
    const code = document.createElement("code");
    code.appendChild(selected);
    range.insertNode(code);
    selection.removeAllRanges();
    const nextRange = document.createRange();
    nextRange.selectNodeContents(code);
    selection.addRange(nextRange);
    return;
  }

  document.execCommand(MARK_COMMANDS[mark], false);
}

export function applyBlockFormat(format: BlockFormat, editor: HTMLElement) {
  editor.focus();

  if (format === "bulletList") {
    document.execCommand("insertUnorderedList");
    return;
  }

  if (format === "numberedList") {
    document.execCommand("insertOrderedList");
    return;
  }

  document.execCommand("formatBlock", false, BLOCK_TAGS[format]);
}

export function applyAlign(align: TextAlign, editor: HTMLElement) {
  editor.focus();
  document.execCommand(ALIGN_COMMANDS[align], false);
}

export function insertLink(editor: HTMLElement) {
  editor.focus();
  const url = window.prompt("Enter link URL");
  if (!url?.trim()) return;
  document.execCommand("createLink", false, url.trim());
}

export function undoEdit(editor: HTMLElement) {
  editor.focus();
  document.execCommand("undo");
}

export function redoEdit(editor: HTMLElement) {
  editor.focus();
  document.execCommand("redo");
}

export function readEditorContent(editor: HTMLElement): RichTextContent {
  const plain = editor.textContent?.trim() ?? "";
  const html = editor.innerHTML.trim();
  return { plain, html };
}

export function isEditorEmpty(editor: HTMLElement): boolean {
  return (editor.textContent?.trim() ?? "").length === 0;
}

export function clearEditor(editor: HTMLElement) {
  editor.innerHTML = "";
}
