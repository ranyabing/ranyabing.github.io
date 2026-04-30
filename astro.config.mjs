import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ranyabing.github.io',
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
  }
});
