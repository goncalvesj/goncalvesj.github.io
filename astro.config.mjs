import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://goncalvesj.github.io',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'material-theme-palenight'
    }
  }
});
