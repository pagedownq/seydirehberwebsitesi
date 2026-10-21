import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import Sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Kanonik adres www'li (seydirehber.com.tr → www'ye yönleniyor). "/" index.html'den otomatik gelir;
    // # bağlantıları ayrı sayfa değildir, eklenmez. robots.txt public/'ten elle yönetilir.
    Sitemap({
      hostname: 'https://www.seydirehber.com.tr',
      dynamicRoutes: ['/about', '/politikalar', '/privacy', '/kvkk'],
      exclude: ['/admin', '/esnaf'],
      changefreq: { '/': 'weekly', '*': 'monthly' },
      priority: { '/': 1.0, '*': 0.5 },
      generateRobotsTxt: false,
    }),
  ],
  build: {
    chunkSizeWarningLimit: 4000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) return 'firebase-vendor';
            if (id.includes('supabase')) return 'supabase-vendor';
            if (id.includes('lucide-react') || id.includes('framer-motion') || id.includes('@dnd-kit')) {
              return 'ui-vendor';
            }
            return 'vendor';
          }
        }
      }
    }
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
  },
})
