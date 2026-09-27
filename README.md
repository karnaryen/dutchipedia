# Dutchipedia

A visual encyclopedia of Dutch words, and a hand for developers switching to Dutch at work. Live at [dutchipedia.nl](https://dutchipedia.nl).

## Layout

One domain, three Next.js apps stitched together with [Multi-Zones](https://nextjs.org/docs/app/guides/multi-zones):

| App                         | Serves                  |
| --------------------------- | ----------------------- |
| `apps/home`                 | `/` and the routing     |
| `apps/woordenschat`         | `/woordenschat/*`       |
| `apps/dutch-for-developers` | `/dutch-for-developers` |

`packages/ui` holds the design system and the site chrome they share.

## Getting started

```bash
pnpm install
pnpm dev        # all three zones; open http://localhost:3000
pnpm test
pnpm build
```

Everything else — conventions, how to add words or a zone, the rules that keep the styling in one place — is in [AGENTS.md](AGENTS.md).
