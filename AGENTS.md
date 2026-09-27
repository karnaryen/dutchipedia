<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `apps/home/node_modules/next/dist/docs/` (the `next` package is not visible from the repo root in this workspace) before writing any code. Heed deprecation notices.

`next dev` would write this block into every zone; that is switched off with `agentRules: false` in each `next.config.ts`, so this root copy is the only one. The generator is `apps/home/node_modules/next/dist/server/lib/generate-agent-files.js`.

<!-- END:nextjs-agent-rules -->

# Dutchipedia

A visual encyclopedia of Dutch words. Image-heavy, content-first, statically rendered where possible.

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript (strict) · Tailwind CSS 4 · shadcn/ui on **Base UI** · pnpm workspaces · Vitest.

## Zones

The site is one domain served by three Next.js apps — [Multi-Zones](apps/home/node_modules/next/dist/docs/01-app/02-guides/multi-zones.md). Each app under `apps/` is a zone with its own `basePath`; `apps/home` owns `/` and proxies every other prefix to its app through `rewrites`. Shared chrome and the design system live in `packages/ui` as `@dutchipedia/ui`.

| Zone                        | Path                    | Dev port |
| --------------------------- | ----------------------- | -------- |
| `apps/home`                 | `/`, `/styleguide`      | 3000     |
| `apps/woordenschat`         | `/woordenschat/*`       | 3001     |
| `apps/dutch-for-developers` | `/dutch-for-developers` | 3002     |

`pnpm dev` at the root starts all three; open `http://localhost:3000` and the home app proxies the rest. A zone can also be opened directly (`http://localhost:3001/woordenschat`) — that is the faster loop when working inside one.

**Links.** `next/link` only ever navigates within one zone. A link into another zone is a full page load and must be a plain `<a>` — `Header`, `SectionCard crossZone` and `zones.ts` already do this. Inside a zone, keep using `<Link>`; hrefs there are zone-relative (`/cats`, not `/woordenschat/cats`) because Next prefixes the `basePath`.

**basePath and hand-built URLs.** `next/link` and `next/image` add the prefix; a plain URL string does not. Anything that fetches or plays a file from `public/` goes through `lib/base-path.ts` in that zone. The pronunciation player does; a new consumer of `public/` must too.

**Adding a zone.** Copy `apps/dutch-for-developers`, set its `basePath` and port, add the rewrite in `apps/home/next.config.ts`, add the entry to `packages/ui/src/lib/zones.ts` (that puts it in the header and on the home page), and add its origin variable to `apps/home/.env.example`.

**Deploying.** Each zone is its own deployment with its own root directory. The home zone needs `WOORDENSCHAT_ORIGIN` and `DUTCH_FOR_DEVELOPERS_ORIGIN` set to the deployed zones; without them it proxies to localhost.

## Commands

All run from the repo root.

| Task               | Command                                                    |
| ------------------ | ---------------------------------------------------------- |
| Dev servers        | `pnpm dev` (all zones) · `pnpm --filter <zone> dev`        |
| Production build   | `pnpm build`                                               |
| Lint               | `pnpm lint` · `pnpm lint:fix`                              |
| Typecheck          | `pnpm lint:types` (run `pnpm build` once first, see below) |
| Tests              | `pnpm test`                                                |
| Format             | `pnpm format` · `pnpm format:check`                        |
| Add a UI component | `cd packages/ui && pnpm dlx shadcn@latest add <name>`      |

`next lint` was **removed in Next 16**. Use `pnpm lint`. Never add an `eslint` key to `next.config.ts`.

`lint:types` depends on the `.next/types` each app generates (`LayoutProps`, `PageProps`), so it needs a `pnpm build` or a dev run before it passes on a fresh checkout.

**Before you claim work is done:** `pnpm lint && pnpm test && pnpm build && pnpm lint:types`. A green typecheck is not a green build — Turbopack catches things `tsc` does not.

## Hard rules

These are the ones that produce silent, hard-to-spot breakage. Everything else is a preference.

1. **No dark mode.** The site is light-only. Never add a `.dark` class, a theme toggle, or a `prefers-color-scheme` block.

   `packages/ui/src/styles/globals.css` rebinds Tailwind's `dark` variant to `&:is(.dark *)`. That line is load-bearing: shadcn components ship `dark:` utilities, and without the rebind they fire on any visitor whose OS is in dark mode. **Do not delete it.**

2. **Never hard-code a colour.** No hex, `rgb()`, or `oklch()` in a component; no `bg-[#fff]` arbitrary values. Use the semantic tokens (`bg-background`, `text-muted-foreground`, `border-border`, `bg-primary`) or the `iris-*` scale.

   New colours are added to `packages/ui/src/styles/tokens.css` first, exposed in the `@theme inline` block of `globals.css` beside it, and only then used. Anything else breaks the ability to restyle the site from one file.

3. **Base UI, not Radix.** Components come from `@base-ui/react`. Never install `@radix-ui/*` — most shadcn snippets on the web assume Radix and will pull in a second, conflicting primitive layer.

4. **Don't hand-write files in `packages/ui/src/components/ui/`.** Generate them with the shadcn CLI so they match the `base-maia` style, then edit if needed. `packages/ui/components.json` holds the config; run the CLI from that directory.

5. **Verify colour contrast before shipping a new colour.** Body text and UI controls need 4.5:1 against their background. The palette is deliberately light — `iris-500` is decorative and fails as text. `tokens.css` records the measured ratios; keep that up to date.

## React and Next.js

**Server Components are the default.** Add `'use client'` only for event handlers, hooks (`useState`/`useEffect`/`useRef`), browser APIs, or Base UI components that need interactivity.

When you do need a client component, push the boundary to the leaf. A `'use client'` on a page opts the entire tree in. Extract the interactive part into its own small component and keep the page a Server Component.

- **Data fetching belongs in Server Components.** No `useEffect` + `fetch` for data available at render time.
- **`async` Server Components** for data; never make a Client Component `async`.
- **Never import server-only code into a client component.** Mark server modules with `server-only` if the boundary is subtle.
- **`next/image` always**, never `<img>`. Give explicit `width`/`height`, or `fill` with a sized parent. Set `sizes` for anything responsive — it is the difference between shipping a 200px thumbnail and a 2000px original.
- **`next/link` for navigation within a zone**, never a bare `<a href="/…">`. Across zones it is the other way round — see Zones above.
- **`next/font`** is already wired up in `packages/ui/src/lib/fonts.ts` and applied by `SiteLayout`. Never add a `font-family` declaration or a Google Fonts `<link>`.
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
- Compose conditional classes with `cn()` from `@dutchipedia/ui/lib/utils` — it merges conflicting Tailwind classes correctly, which template literals do not.
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
apps/home/                      zone "/": home page, styleguide, zone rewrites and legacy redirects
apps/woordenschat/              zone "/woordenschat": the words
  app/                          routes: page.tsx (topic index), [topic]/page.tsx (one route for every topic)
  content/words/                the words themselves — generated data files next to their images
  content/words/topics.ts       generated registry of every topic; the routes are built from it
  features/words/               types, lookups, the topic page and the card
  features/pronunciation/       the audio player, its React provider and the "sound is off" hint
  lib/base-path.ts              prefixes hand-built URLs with the zone's basePath
  public/audio/words/           pronunciation clips
apps/dutch-for-developers/      zone "/dutch-for-developers"
packages/ui/                    @dutchipedia/ui — everything the zones share
  src/styles/tokens.css         colour primitives + semantic tokens  ← all colour lives here
  src/styles/globals.css        Tailwind setup, theme mapping, base layer
  src/components/ui/            shadcn-generated primitives (regenerate, don't hand-write)
  src/components/               site chrome: SiteLayout, Header, Footer, Logo, SectionCard, PageIntro…
  src/lib/zones.ts              the zone table the header and home page are built from
  src/lib/site.ts               site name, tagline, page-title pattern
scripts/                        Python generators for the words (images, clips, data files)
```

- Routes stay thin. A page picks the data and hands it to a `features/` component; the layout and wording live there. `apps/woordenschat/app/[topic]/page.tsx` is the whole of a topic route — a new topic needs no new page.
- Every zone's `app/layout.tsx` is three lines: metadata plus `<SiteLayout zone="…">`. The document, fonts, header, footer and analytics come from the package so they cannot drift between zones.
- **Images live in `content/`, not `public/`.** They are imported statically, which gives Next the dimensions and a blur placeholder for free, and lets a missing file fail the build instead of 404ing in production.
- **Audio is the exception: it lives in `apps/woordenschat/public/audio/`.** Next has no static import for media, so clips are referenced by zone-relative URL. A wrong path would 404 silently — `content/words/topics.test.ts` checks every clip exists, so run `pnpm test` after adding words.
- **Pronunciation is pre-generated, never `speechSynthesis`.** Browser TTS reads Dutch in an English voice for anyone without a Dutch voice installed. Clips come from `scripts/generate-pronunciations.py`.
- **Pronunciation plays through `features/pronunciation/`, never a bare `new Audio()`.** The player is one element per page (a sweep across the grid replaces the clip instead of stacking), it stops when the `PronunciationProvider` unmounts (so a clip does not carry on into the next route), and it turns the browser's first-interaction refusal into a visible hint plus a replay on the first click. The player is plain TypeScript with the browser injected, and has unit tests — keep it that way.
- **`scripts/word-topics.json` is the source of truth for words and topics.** The photo, the clip and the credit have to agree, which is unmanageable by hand at a hundred entries, so `content/words/<topic>/<topic>.ts` and `content/words/topics.ts` are generated. To add a word: add it there, then run `fetch-word-images.py <topic> --only <slug>`, `generate-pronunciations.py`, `generate-word-data.py`. To add a topic: add a key with `title`, `dutchTitle`, `description` and `words`, then run the same three scripts. Editing a generated `.ts` directly works until the next regeneration overwrites it.
- Photos carry their licence. Every `WordEntry` has a `credit`, and the topic page renders it — most Wikimedia images are CC BY-SA and attribution is a condition of use, not a nicety.
- Co-locate a component with its route if only that route uses it; promote to that zone's `features/` on the second consumer inside the zone, and to `packages/ui` on the first consumer in another zone.
- No barrel `index.ts` files — they defeat tree-shaking and slow the dev server. Data modules are named for their contents (`content/words/trees/trees.ts`).
- One component per file, named the same as the file.
- Tests sit next to the code as `*.test.ts` and run with Vitest in Node. Test pure modules (the player, the data) rather than rendering; keep browser objects behind injectable seams so tests need no DOM.

## Working style

- **Don't commit or push unless explicitly asked.** This is a standing preference in this repo, not a default.
- Read the relevant `node_modules/next/dist/docs/` guide before using an unfamiliar Next API. This codebase is on a version newer than most training data.
- Match the surrounding code. Comments explain _why_, not _what_ — see `app/tokens.css` for the intended density.
- Prefer deleting code to adding a flag. No speculative abstraction for a single caller.
