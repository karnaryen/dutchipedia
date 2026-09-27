/** The zone's path prefix, inlined from next.config.ts at build time. */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/**
 * Prefix a zone-relative URL with the basePath.
 *
 * `next/link` and `next/image` do this themselves. Anything that builds a URL
 * by hand — the audio player, a fetch — has to, or it asks the home zone for
 * a file that only this one has.
 */
export function withBasePath(path: string): string {
  return `${basePath}${path}`;
}
