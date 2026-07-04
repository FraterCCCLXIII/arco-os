import type { NotePage, NotesGraphEdge, NotesGraphNode } from "./types";

/** Build an adjacency graph from explicit note links and backlinks. */
export function buildNotesGraph(pages: NotePage[]): { nodes: NotesGraphNode[]; edges: NotesGraphEdge[] } {
  const pageMap = new Map(pages.map((page) => [page.id, page]));
  const edgeKeys = new Set<string>();
  const edges: NotesGraphEdge[] = [];

  for (const page of pages) {
    for (const targetId of page.links ?? []) {
      if (!pageMap.has(targetId)) continue;
      const key = [page.id, targetId].sort().join("::");
      if (edgeKeys.has(key)) continue;
      edgeKeys.add(key);
      edges.push({ id: `e-${page.id}-${targetId}`, from: page.id, to: targetId });
    }
  }

  const connectionCounts = new Map<string, number>();
  for (const edge of edges) {
    connectionCounts.set(edge.from, (connectionCounts.get(edge.from) ?? 0) + 1);
    connectionCounts.set(edge.to, (connectionCounts.get(edge.to) ?? 0) + 1);
  }

  const nodes: NotesGraphNode[] = pages.map((page, index) => {
    const angle = (index / pages.length) * Math.PI * 2;
    const radius = 28 + (page.links?.length ?? 0) * 4;
    return {
      id: page.id,
      label: page.title,
      tags: page.tags,
      connections: connectionCounts.get(page.id) ?? 0,
      x: 50 + Math.cos(angle) * radius,
      y: 50 + Math.sin(angle) * radius,
    };
  });

  return { nodes, edges };
}

/** Count backlinks pointing to a given note. */
export function countBacklinks(pages: NotePage[], noteId: string): number {
  return pages.filter((page) => page.links?.includes(noteId)).length;
}

/** Estimate word count from plain text in blocks. */
export function countNoteWords(blocks: NotePage["blocks"]): number {
  let total = 0;

  function countText(value: unknown): void {
    if (typeof value === "string") {
      total += value.trim().split(/\s+/).filter(Boolean).length;
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(countText);
      return;
    }
    if (value && typeof value === "object" && "props" in value) {
      const props = (value as { props?: { children?: unknown } }).props;
      if (props?.children !== undefined) countText(props.children);
    }
  }

  for (const block of blocks) {
    switch (block.type) {
      case "heading":
      case "flowSteps":
        countText(block.type === "heading" ? block.text : block.steps);
        break;
      case "paragraph":
      case "callout":
        countText(block.text);
        break;
      case "bulletList":
      case "numberedList":
        for (const item of block.items) {
          countText(item.text);
          item.children?.forEach((child) => countText(child.text));
        }
        break;
    }
  }

  return total;
}
