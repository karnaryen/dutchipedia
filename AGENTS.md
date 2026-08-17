<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Dutchipedia

A visual encyclopedia of Dutch words. Image-heavy, content-first, statically rendered where possible.

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript (strict) · Tailwind CSS 4 · shadcn/ui on **Base UI** · pnpm.

## Commands

| Task               | Command                             |
| ------------------ | ----------------------------------- |
| Dev server         | `pnpm dev`                          |
| Production build   | `pnpm build`                        |
| Lint               | `pnpm lint` · `pnpm lint:fix`       |
| Typecheck          | `pnpm lint:types`                   |
| Format             | `pnpm format` · `pnpm format:check` |
| Add a UI component | `pnpm dlx shadcn@latest add <name>` |

`next lint` was **removed in Next 16**. Use `pnpm lint`. Never add an `eslint` key to `next.config.ts`.

**Before you claim work is done:** `pnpm lint && pnpm lint:types && pnpm build`. A green typecheck is not a green build — Turbopack catches things `tsc` does not.

## Hard rules

These are the ones that produce silent, hard-to-spot breakage. Everything else is a preference.

1. **No dark mode.** The site is light-only. Never add a `.dark` class, a theme toggle, or a `prefers-color-scheme` block.

   `app/globals.css` rebinds Tailwind's `dark` variant to `&:is(.dark *)`. That line is load-bearing: shadcn components ship `dark:` utilities, and without the rebind they fire on any visitor whose OS is in dark mode. **Do not delete it.**

2. **Never hard-code a colour.** No hex, `rgb()`, or `oklch()` in a component; no `bg-[#fff]` arbitrary values. Use the semantic tokens (`bg-background`, `text-muted-foreground`, `border-border`, `bg-primary`) or the `iris-*` scale.

   New colours are added to `app/tokens.css` first, exposed in the `@theme inline` block of `app/globals.css`, and only then used. Anything else breaks the ability to restyle the site from one file.

3. **Base UI, not Radix.** Components come from `@base-ui/react`. Never install `@radix-ui/*` — most shadcn snippets on the web assume Radix and will pull in a second, conflicting primitive layer.

4. **Don't hand-write files in `components/ui/`.** Generate them with the shadcn CLI so they match the `base-maia` style, then edit if needed. `components.json` holds the config.

5. **Verify colour contrast before shipping a new colour.** Body text and UI controls need 4.5:1 against their background. The palette is deliberately light — `iris-500` is decorative and fails as text. `app/tokens.css` records the measured ratios; keep that up to date.

## React and Next.js

**Server Components are the default.** Add `'use client'` only for event handlers, hooks (`useState`/`useEffect`/`useRef`), browser APIs, or Base UI components that need interactivity.

When you do need a client component, push the boundary to the leaf. A `'use client'` on a page opts the entire tree in. Extract the interactive part into its own small component and keep the page a Server Component.

- **Data fetching belongs in Server Components.** No `useEffect` + `fetch` for data available at render time.
- **`async` Server Components** for data; never make a Client Component `async`.
- **Never import server-only code into a client component.** Mark server modules with `server-only` if the boundary is subtle.
- **`next/image` always**, never `<img>`. Give explicit `width`/`height`, or `fill` with a sized parent. Set `sizes` for anything responsive — it is the difference between shipping a 200px thumbnail and a 2000px original.
- **`next/link` for internal navigation**, never a bare `<a href="/…">`.
- **`next/font`** is already wired up in `app/layout.tsx`. Never add a `font-family` declaration or a Google Fonts `<link>`.
- **Export `metadata`** from every page for SEO.
- Prefer static rendering. Reach for `dynamic = 'force-dynamic'`, `cookies()`, or `headers()` only when the page genuinely cannot be static, and say why in a comment.
- Keys in lists come from stable ids, never the array index.
- `useEffect` is for synchronising with external systems. Deriving state from props does not need it.

## TypeScript

- `strict` is on. No `any` — use `unknown` and narrow. No `@ts-ignore`; `@ts-expect-error` with a reason if genuinely unavoidable.
- Type-only imports use `import type` — the lint rule autofixes this.
- No non-null assertions (`!`) in app code; the rule warns. Narrow properly.
- Type props inline or with a local `type`. Don't reach for `React.FC`.

## Styling

- Tailwind utilities only. No CSS Modules, no inline `style` objects except for genuinely dynamic values (a computed swatch colour, a transform from measured layout).
- Compose conditional classes with `cn()` from `@/lib/utils` — it merges conflicting Tailwind classes correctly, which template literals do not.
- Spacing, radius, and font sizes come from the scale. No `p-[13px]`.
- Images on white artwork sit on a `bg-surface-soft` mat with a `border-surface-soft-border` edge, so they read as objects rather than bleeding into the page.

## Accessibility

- Semantic elements first: `<button>` for actions, `<a>`/`<Link>` for navigation, real headings in order.
- Every `next/image` needs `alt` — `alt=""` for decorative images, never a missing prop.
- Never remove focus outlines. The focus ring is `--ring` and is already wired into the components.
- Interactive targets are at least 24×24px.
- Don't convey meaning with colour alone.

## Structure

```
app/            routes, layouts, pages (Server Components by default)
app/tokens.css  colour primitives + semantic tokens  ← all colour lives here
components/ui/  shadcn-generated primitives (regenerate, don't hand-write)
components/     app-specific composite components used across features
features/<name>/  components, hooks and types for one area (words, work)
content/<area>/   the words themselves: data files next to their images
lib/            shared utilities (cn, data helpers)
public/         static assets
```

- Routes stay thin. A page picks the data and hands it to a `features/` component; the layout and wording live there, so three topic pages can share one body.
- **Images live in `content/`, not `public/`.** They are imported statically, which gives Next the dimensions and a blur placeholder for free, and lets a missing file fail the build instead of 404ing in production.
- **Audio is the exception: it lives in `public/audio/`.** Next has no static import for media, so clips are referenced by URL. That means a wrong path 404s silently instead of failing the build — check `WordEntry.audio` against the files on disk when you add words.
- **Pronunciation is pre-generated, never `speechSynthesis`.** Browser TTS reads Dutch in an English voice for anyone without a Dutch voice installed. Clips come from `scripts/generate-pronunciations.py`.
- **`scripts/word-topics.json` is the source of truth for words.** The photo, the clip and the credit have to agree, which is unmanageable by hand at ninety entries, so `content/words/<topic>/<topic>.ts` is generated. To add a word: add it there, then run `fetch-word-images.py <topic> --only <slug>`, `generate-pronunciations.py`, `generate-word-data.py`. Editing a generated `.ts` directly works until the next regeneration overwrites it.
- Photos carry their licence. Every `WordEntry` has a `credit`, and the topic page renders it — most Wikimedia images are CC BY-SA and attribution is a condition of use, not a nicety.
- Co-locate a component with its route if only that route uses it; promote to `components/` on the second consumer.
- No barrel `index.ts` files — they defeat tree-shaking and slow the dev server. Data modules are named for their contents (`content/words/trees/trees.ts`).
- One component per file, named the same as the file.

## Working style

- **Don't commit or push unless explicitly asked.** This is a standing preference in this repo, not a default.
- Read the relevant `node_modules/next/dist/docs/` guide before using an unfamiliar Next API. This codebase is on a version newer than most training data.
- Match the surrounding code. Comments explain _why_, not _what_ — see `app/tokens.css` for the intended density.
- Prefer deleting code to adding a flag. No speculative abstraction for a single caller.
