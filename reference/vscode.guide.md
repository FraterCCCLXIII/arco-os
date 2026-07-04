# Visual Studio Code reference

Shallow clone at [`vscode/`](vscode/) from [microsoft/vscode](https://github.com/microsoft/vscode). Study the workbench shell, extensibility model, and AI chat UI patterns. **Not** a vendored dependency — design reference only.

## Where to start

Paths below are relative to `reference/vscode/`.

| Area | Path | What to look at |
|------|------|-----------------|
| Workbench parts | [`src/vs/workbench/browser/parts/`](vscode/src/vs/workbench/browser/parts/) | Activity bar, sidebar, editor groups, panel, auxiliary bar, status bar, title bar |
| Layout & grid | [`src/vs/workbench/browser/layout.ts`](vscode/src/vs/workbench/browser/layout.ts) | Part sizing, visibility, drag-resize, zen mode |
| Views & containers | [`src/vs/workbench/browser/parts/views/`](vscode/src/vs/workbench/browser/parts/views/) | View registration, tree views, view containers in sidebar/panel |
| Command palette | [`src/vs/platform/quickinput/`](vscode/src/vs/platform/quickinput/) | Quick pick, fuzzy search, multi-step flows |
| Editor host | [`src/vs/workbench/browser/parts/editor/`](vscode/src/vs/workbench/browser/parts/editor/) | Tabs, splits, drag-drop, editor groups |
| Monaco | [`src/vs/editor/`](vscode/src/vs/editor/) | Editor widget, decorations, inline widgets, diff |
| Chat UI | [`src/vs/workbench/contrib/chat/`](vscode/src/vs/workbench/contrib/chat/) | Chat panel, sessions, tool calls, streaming |
| Inline AI | [`src/vs/workbench/contrib/inlineChat/`](vscode/src/vs/workbench/contrib/inlineChat/) | Inline chat overlay in editor |
| Extension points | [`src/vs/workbench/services/extensions/`](vscode/src/vs/workbench/services/extensions/) | Contribution registry, activation, host |
| Settings & prefs | [`src/vs/workbench/services/preferences/`](vscode/src/vs/workbench/services/preferences/) | Settings editor, scoped configuration |

## Refresh

```bash
cd reference/vscode && git pull
```

## Re-clone

```bash
cd reference
rm -rf vscode
git clone --depth 1 https://github.com/microsoft/vscode.git vscode
```
