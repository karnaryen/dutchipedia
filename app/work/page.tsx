import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Work — Dutchipedia',
  description: 'Vocabulary and phrases for applying, interviewing and working in Dutch.',
};

export default function WorkPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <p className="text-sm font-medium text-link">Werk</p>
      <h1 className="font-heading mt-1 text-3xl font-semibold tracking-tight">Work</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">This is work section.</p>
    </div>
  );
}
