import { defineConfig } from 'vite'
import pages from '@hono/vite-cloudflare-pages'

export default defineConfig({
  plugins: [pages()],
  build: {
    outDir: 'dist'
  },
  publicDir: 'public',
  assetsInclude: ['**/*.woff2', '**/*.woff', '**/*.ttf', '**/*.otf']
})
