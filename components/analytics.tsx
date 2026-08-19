import Script from 'next/script';

/** Cloudflare Web Analytics.
 *
 *  Cookieless and without fingerprinting, so the site needs no consent banner
 *  — the reason for picking it over an analytics product that sets an id.
 *
 *  The beacon token is not a secret: it names the site in the Cloudflare
 *  dashboard and ships in the HTML of every page that reports to it. Keeping
 *  it here rather than in an env var means the snippet cannot silently go
 *  missing from a deploy that forgot to set the variable.
 */
export function Analytics() {
  // Cloudflare only counts hits from the hostname configured on the site
  // (dutchipedia.nl), so local traffic would be discarded anyway — this just
  // saves the request.
  if (process.env.NODE_ENV !== 'production') return null;

  return (
    <Script
      id="cloudflare-web-analytics"
      src="https://static.cloudflareinsights.com/beacon.min.js"
      type="module"
      data-cf-beacon='{"token": "8cf49355cc78443fa33fa1eee43fe70d"}'
    />
  );
}
