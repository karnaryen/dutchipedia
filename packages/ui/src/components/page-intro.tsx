/**
 * Eyebrow, heading and lede — the opening every section page shares. Keeping
 * it in one component is what makes the zones look like one site.
 */
export function PageIntro({
  dutchTitle,
  title,
  description,
  children,
}: {
  dutchTitle: string;
  title: string;
  description: string;
  /** Anything that belongs directly under the lede, such as a word count. */
  children?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-link">{dutchTitle}</p>
      <h1 className="font-heading mt-1 text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{description}</p>
      {children}
    </div>
  );
}
