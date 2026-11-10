// @ts-check
import { defineConfig } from 'astro/config';

// The naturarum site. Static output, deployed by Cloudflare from this repo.
// SITE_URL is the public address (set it in Cloudflare once the domain exists); until then the
// deployment's own pages.dev address is used, which only matters for the RSS feed's links.
// build.format 'preserve' keeps today's URLs exactly: apps/anima/index.astro -> /apps/anima/index.html,
// apps/datum/privacy.astro -> /apps/datum/privacy.html (the App Store links to these).
export default defineConfig({
  site: process.env.SITE_URL || process.env.CF_PAGES_URL || 'http://localhost:4321',
  trailingSlash: 'ignore',
  build: { format: 'preserve' },
  devToolbar: { enabled: false },
  server: { port: 4321, host: '127.0.0.1' },
});
