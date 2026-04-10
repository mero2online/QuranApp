import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// import vitePluginFtp from 'vite-plugin-ftp';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default ({ mode, command }) => {
  // eslint-disable-next-line no-undef
  process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ''));
  const BASE_URL = mode === 'development' ? '/quran' : '/quran';
  const PUBLIC_FOLDER = command === 'build' ? false : 'public';

  return defineConfig({
    base: BASE_URL,
    publicDir: PUBLIC_FOLDER,
    server: {
      port: '3000',
      // hmr: { overlay: false },
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'favicon.svg', 'robots.txt'],
        manifest: {
          name: 'Quran App',
          short_name: 'Quran',
          description: 'Quran reader with offline support',
          theme_color: '#1290aa',
          background_color: '#242424',
          display: 'standalone',
          start_url: '/quran/',
          scope: '/quran/',
          icons: [
            {
              src: 'favicon.svg',
              sizes: 'any',
              type: 'image/svg+xml',
              purpose: 'any maskable',
            },
          ],
        },
        workbox: {
          // Precache the app shell (JS/CSS/HTML) but skip the bundled JPGs —
          // 187MB of pages would make first-load brutal. Pages cache at runtime instead.
          globPatterns: ['**/*.{js,css,html,svg,ico,woff,woff2}'],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          navigateFallback: '/quran/index.html',
          cleanupOutdatedCaches: true,
          runtimeCaching: [
            {
              // Each Quran page JPG is cached the first time it's viewed,
              // then served from cache forever (until evicted).
              urlPattern: /\/assets\/.*page\d+.*\.(?:jpg|jpeg|png|webp)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'quran-pages',
                expiration: {
                  maxEntries: 700,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              // Other static assets (placeholder, fonts, etc.)
              urlPattern: /\/assets\/.*\.(?:jpg|jpeg|png|webp|svg|woff2?)$/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'quran-static',
                expiration: { maxEntries: 100 },
              },
            },
          ],
        },
      }),
      // a simple useful vite ftp plugin, based on ftp-deploy, upload your dist file after vite build.
      /* vitePluginFtp({
        // eslint-disable-next-line no-undef
        host: process.env.FTP_HOST,
        // eslint-disable-next-line no-undef
        port: process.env.FTP_PORT,
        // eslint-disable-next-line no-undef
        remoteDir: process.env.FTP_REMOTEDIR,
        // eslint-disable-next-line no-undef
        user: process.env.FTP_USER,
        // eslint-disable-next-line no-undef
        password: process.env.FTP_PASSWORD,
      }), */
    ],
  });
};
