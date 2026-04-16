import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    svgr(),
    visualizer({
      open: false,
      filename: 'bundle-stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (/react\/|react-dom\/|scheduler\/|use-sync-external-store/.test(id)) {
              return 'vendor-react';
            }
            if (id.includes('/@tanstack/')) return 'vendor-tanstack';

            if (
              id.includes('/@radix-ui/') ||
              id.includes('/lucide') ||
              id.includes('/sonner') ||
              id.includes('/@floating-ui') ||
              id.includes('/tailwind-merge')
            ) {
              return 'vendor-ui';
            }

            if (id.includes('/zod/') || id.includes('/i18next') || id.includes('/axios')) {
              return 'vendor-core-utils';
            }

            if (
              /prism|micromark|mdast|unified|vfile|unist|hast|remark|rehype|property-information/.test(
                id,
              )
            ) {
              return 'vendor-markdown';
            }

            return 'vendor';
          }
        },
      },
    },
  },
});
