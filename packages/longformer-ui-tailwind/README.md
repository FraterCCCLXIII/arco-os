# Longformer UI (Tailwind)

Tailwind CSS edition of the Longformer UI kit. This package is a standalone copy of `longformer-ui` with all CSS modules converted to Tailwind utility class maps.

The original `longformer-ui` package is **not modified**.

## Packages

| Package | Description |
|---------|-------------|
| `longformer-ui-tailwind` | Component library — CSS modules replaced with `.tailwind.ts` class maps |
| `longformer-demo-tailwind` | Demo app wired to the Tailwind edition |

## Quick start

```bash
# From monorepo root
npm install
npm run dev:tailwind
```

Demo runs at http://localhost:5174 (original demo uses 5173).

## How it works

- **Design tokens** still live in `src/tokens/theme.css` as CSS custom properties (`--lf-*`).
- **Tailwind theme** maps those tokens in `src/styles/tailwind.css` via `@theme` (e.g. `bg-lf-accent`, `gap-lf-2`).
- **Components** import Tailwind class maps from `*.tailwind.ts` files instead of `*.module.css`.
- **Global utilities** (`.lf-root`, `.lf-focusable`, `.lf-scrollbar`) are defined as Tailwind `@layer components`.

## Re-converting CSS

If you need to re-run the conversion (e.g. after syncing changes from `longformer-ui`):

```bash
# Copy fresh CSS modules from the original package, then:
npm run convert-css --workspace=longformer-ui-tailwind
```

The conversion script lives at `scripts/convert-css-to-tailwind.mjs`.

## Differences from the original

- Requires Tailwind CSS v4 (`@tailwindcss/vite`) in consuming apps.
- Some complex CSS (adjacent-sibling rules, media queries, pseudo-elements) may not be fully represented — check converted output if styles look off.
- Uses `cn()` (`clsx` + `tailwind-merge`) alongside the existing `cx()` helper.
