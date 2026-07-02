# longformer-www

Marketing website for **Longformer** — the presentation OS for integrated AI work.

This package lives inside the UI Experiments monorepo as a **separate app** from `longformer-demo` (the interactive shell prototype).

## Design reference

Visual and content patterns are documented from [matrix-os.com](https://matrix-os.com/):

- [`docs/DESIGN-INSPIRATION.md`](./docs/DESIGN-INSPIRATION.md) — palette, typography, layout, motion
- [`docs/CONTENT-BRIEF.md`](./docs/CONTENT-BRIEF.md) — Longformer-specific messaging

## Develop

From the monorepo root:

```bash
npm install
npm run dev:www
```

Or from this package:

```bash
npm run dev
```

Runs on **http://localhost:5174** (demo app stays on 5173).

## Build

```bash
npm run build --workspace=longformer-www
```

## Structure

```
longformer-www/
├── docs/           # Inspiration + content brief (not shipped)
├── src/
│   ├── content/    # Site copy constants
│   ├── components/ # Landing page sections
│   └── styles/     # Global tokens + shared utilities
└── index.html
```

## Next steps

- Replace CSS mock preview with real AppShell screenshot
- Add `/architecture` and `/workspaces` routes (or migrate to Next.js for MDX blog)
- Wire “Try demo” to deployed preview URL
- Add OG image and favicon
