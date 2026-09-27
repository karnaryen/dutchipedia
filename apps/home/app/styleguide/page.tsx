import { Button } from '@dutchipedia/ui/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@dutchipedia/ui/components/ui/card';
import { Input } from '@dutchipedia/ui/components/ui/input';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Styleguide — Dutchipedia',
  description: 'Colour ramp, type scale and components for the Dutchipedia design system.',
};

const irisRamp = [
  { step: '50', varName: '--iris-50', hex: '#faf8fc', role: 'Barely-there tint' },
  { step: '100', varName: '--iris-100', hex: '#efeaf3', role: 'Soft surface / hover · accent' },
  { step: '200', varName: '--iris-200', hex: '#ded4e6', role: 'Decorative' },
  { step: '300', varName: '--iris-300', hex: '#c6b6d4', role: 'Decorative' },
  { step: '400', varName: '--iris-400', hex: '#ab96c0', role: 'Decorative' },
  { step: '500', varName: '--iris-500', hex: '#907aa9', role: 'Rosé Pine iris — focus ring' },
  { step: '600', varName: '--iris-600', hex: '#7a66a0', role: 'Primary — buttons (5.0:1)' },
  { step: '700', varName: '--iris-700', hex: '#63527f', role: 'Links · accent text (6.9:1)' },
  { step: '800', varName: '--iris-800', hex: '#473d5c', role: 'Deep decorative' },
  { step: '900', varName: '--iris-900', hex: '#2b2438', role: 'Deep decorative' },
];

const semanticTokens = [
  { name: 'background', className: 'bg-background', note: 'Pure #ffffff' },
  { name: 'surface-soft', className: 'bg-surface-soft', note: 'Dawn base — mat behind imagery' },
  { name: 'muted', className: 'bg-muted', note: 'Purple-tinted grey — quiet blocks' },
  { name: 'accent', className: 'bg-accent', note: 'Iris 100 — hover, active' },
  { name: 'primary', className: 'bg-primary', note: 'Iris 600 — actions' },
  { name: 'border', className: 'bg-border', note: 'Purple-tinted hairlines' },
];

const words = [
  { dutch: 'het raam', english: 'the window', src: '/window.svg' },
  { dutch: 'het bestand', english: 'the file', src: '/file.svg' },
  { dutch: 'de wereld', english: 'the world', src: '/globe.svg' },
];

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border pt-10">
      <h2 className="font-heading text-xl font-medium">{title}</h2>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function StyleguidePage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-16">
      <header>
        <p className="text-sm font-medium text-link">Dutchipedia</p>
        <h1 className="font-heading mt-2 text-3xl font-semibold tracking-tight">Styleguide</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          White background, purple-tinted neutrals, one iris accent — Rosé Pine Dawn adapted to a
          white page. The chrome stays quiet so photography carries the colour.
        </p>
      </header>

      <Section
        title="Iris ramp"
        description="Rosé Pine's iris extended into a light ramp. Step 500 is the original #907aa9 — only 3.79:1 on white, so it rings rather than carries text. Steps 600 and 700 do the load-bearing work."
      >
        <ul className="grid gap-2 sm:grid-cols-2">
          {irisRamp.map((swatch) => (
            <li
              key={swatch.step}
              className="flex items-center gap-3 rounded-lg border border-border p-2"
            >
              <span
                className="size-10 shrink-0 rounded-md ring-1 ring-foreground/10"
                style={{ backgroundColor: `var(${swatch.varName})` }}
              />
              <span className="min-w-0">
                <span className="flex items-baseline gap-2">
                  <span className="text-sm font-medium">iris-{swatch.step}</span>
                  <code className="font-mono text-xs text-muted-foreground">{swatch.hex}</code>
                </span>
                <span className="block truncate text-xs text-muted-foreground">{swatch.role}</span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Semantic surfaces"
        description="What shadcn components actually reference. Swap the ramp and every component follows."
      >
        <ul className="grid gap-3 sm:grid-cols-3">
          {semanticTokens.map((token) => (
            <li key={token.name} className="rounded-lg border border-border p-3">
              <span
                className={`block h-12 rounded-md ring-1 ring-foreground/10 ${token.className}`}
              />
              <span className="mt-2 block font-mono text-xs">{token.name}</span>
              <span className="block text-xs text-muted-foreground">{token.note}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Type scale"
        description="Geist for both headings and body, with Geist Mono for codes and phonetics."
      >
        <div className="flex flex-col gap-3">
          <p className="font-heading text-3xl font-semibold tracking-tight">
            De fiets — the bicycle
          </p>
          <p className="font-heading text-xl font-medium">Section heading</p>
          <p className="text-base">
            Body copy sits at 16px. A definition runs a few lines, so line length is capped for
            comfortable reading.
          </p>
          <p className="text-sm text-muted-foreground">
            Muted small text — usage notes, etymology, attribution.
          </p>
          <p className="font-mono text-sm">/fits/ · de-woord · plural: fietsen</p>
        </div>
      </Section>

      <Section
        title="Buttons"
        description="Iris only on the primary action. Everything else stays neutral so a page of cards does not turn into a field of purple."
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Add a word</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="destructive">Delete</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="xs">Extra small</Button>
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Disabled</Button>
          </div>
        </div>
      </Section>

      <Section
        title="Input"
        description="Focus ring is iris-500, Rosé Pine's own purple — the accent shows up exactly where attention should go."
      >
        <div className="flex max-w-sm flex-col gap-3">
          <Input placeholder="Search a Dutch word…" />
          <Input placeholder="Disabled" disabled />
        </div>
      </Section>

      <Section
        title="Word cards"
        description="The pattern this theme exists for. Each image sits on a surface-soft mat, so artwork with a white background still reads as an object instead of bleeding into the page."
      >
        <ul className="grid gap-4 sm:grid-cols-3">
          {words.map((word) => (
            <li key={word.dutch}>
              <Card>
                <CardContent>
                  <span className="flex h-40 items-center justify-center rounded-lg border border-surface-soft-border bg-surface-soft">
                    <Image src={word.src} alt="" width={64} height={64} className="opacity-80" />
                  </span>
                </CardContent>
                <CardHeader>
                  <CardTitle>{word.dutch}</CardTitle>
                  <CardDescription>{word.english}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="ghost" size="sm">
                    Learn more
                  </Button>
                </CardFooter>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Mat, side by side"
        description="Left: a white-background image on a white page. Right: the same image on surface-soft. This is the whole argument for the mat token."
      >
        <div className="grid max-w-lg gap-4 sm:grid-cols-2">
          <span className="flex h-40 items-center justify-center rounded-lg bg-background">
            <span className="flex size-24 items-center justify-center bg-background">
              <Image src="/globe.svg" alt="" width={40} height={40} />
            </span>
          </span>
          <span className="flex h-40 items-center justify-center rounded-lg border border-surface-soft-border bg-surface-soft">
            <span className="flex size-24 items-center justify-center bg-background">
              <Image src="/globe.svg" alt="" width={40} height={40} />
            </span>
          </span>
        </div>
      </Section>
    </div>
  );
}
