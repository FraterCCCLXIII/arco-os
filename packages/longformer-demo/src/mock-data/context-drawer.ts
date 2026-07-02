import type { DiffHunk } from "longformer-ui";

export const demoDiffHunks: DiffHunk[] = [
  {
    id: "diff-gateway",
    filePath: "packages/api/src/websocket-gateway.ts",
    lines: [
      { kind: "header", content: "@@ -12,8 +12,14 @@ export function connectGateway(url: string) {" },
      { kind: "context", content: "  const socket = new WebSocket(url);", oldLineNumber: 12, newLineNumber: 12 },
      { kind: "context", content: "", oldLineNumber: 13, newLineNumber: 13 },
      { kind: "remove", content: "  socket.addEventListener('open', () => console.log('connected'));", oldLineNumber: 14 },
      { kind: "add", content: "  socket.addEventListener('open', () => {", newLineNumber: 14 },
      { kind: "add", content: "    console.log('[gateway] connected');", newLineNumber: 15 },
      { kind: "add", content: "    socket.send(JSON.stringify({ type: 'ping' }));", newLineNumber: 16 },
      { kind: "add", content: "  });", newLineNumber: 17 },
      { kind: "context", content: "", oldLineNumber: 15, newLineNumber: 18 },
      { kind: "add", content: "  socket.addEventListener('message', (event) => {", newLineNumber: 19 },
      { kind: "add", content: "    const payload = JSON.parse(String(event.data));", newLineNumber: 20 },
      { kind: "add", content: "    if (payload.type === 'pong') return;", newLineNumber: 21 },
      { kind: "add", content: "  });", newLineNumber: 22 },
      { kind: "context", content: "  return socket;", oldLineNumber: 16, newLineNumber: 23 },
    ],
  },
  {
    id: "diff-panel",
    filePath: "packages/longformer-ui/src/components/workspaces/chat/ChatContextPanel.tsx",
    lines: [
      { kind: "header", content: "@@ -1,4 +1,6 @@" },
      { kind: "context", content: "import { useState } from 'react';", oldLineNumber: 1, newLineNumber: 1 },
      { kind: "add", content: "import { ResizablePane } from '../../primitives/ResizablePane';", newLineNumber: 2 },
      { kind: "context", content: "import { ConversationPanel } from './ConversationPanel';", oldLineNumber: 2, newLineNumber: 3 },
      { kind: "add", content: "import { ChatContextDrawer } from './ChatContextDrawer';", newLineNumber: 4 },
    ],
  },
];
