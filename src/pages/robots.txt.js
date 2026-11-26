// robots.txt. Crawling stays allowed so search engines can read the noindex tags in preview.
// Only the real sitemap is listed (the live site also lists a Make webhook, removed per handoff F12).
import { site } from '../data/site.js';

export function GET() {
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap-index.xml\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
