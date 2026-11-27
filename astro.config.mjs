// URLs keep the live site's no-trailing-slash paths (e.g. /services/deck-repair).
// build.format 'file' makes Cloudflare Pages serve /services/deck-repair without a redirect.
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://collingwoodhandyman.ca',
  trailingSlash: 'never',
  // inlineStylesheets: the CSS (about 6 KB compressed) goes inside each page, so phones skip a render-blocking request.
  build: { format: 'file', inlineStylesheets: 'always' },

  // Keep noindex pages (author list, reviews holding page, thanks, 404) out of the sitemap.
  integrations: [sitemap({ filter: (p) => !/\/(blog\/author|404|thanks|reviews)(\/|$)/.test(p) })],
});