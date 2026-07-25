import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    /*
     * Offline is a real requirement, not a nice-to-have (§2): this gets used in a canyon
     * with no signal. generateSW precaches every built asset; the data is bundled into the
     * JS, so a warm precache means the whole guide works with the radio off.
     */
    VitePWA({
      strategies: 'generateSW',
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,ico,png,woff2}'],
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: "MX-5 Miata Buyer's Guide",
        short_name: 'MX-5 Guide',
        description:
          "What a given Miata year and trim should have, what changed, what to inspect, and what it's worth.",
        theme_color: '#14161a',
        background_color: '#fbfaf8',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
});
