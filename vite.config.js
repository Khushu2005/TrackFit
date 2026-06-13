import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "TrackFit",
        short_name: "Fit",
        description: 'Your offline-first workout partner.',
        theme_color: '#20201F',
        background_color: '#20201F',
        "icons": [
    {
      "src": "icons/Fit-48x48.png",
      "sizes": "48x48",
      "type": "image/png"
    },
    {
      "src": "icons/Fit-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "icons/Fit-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "icons/Fit-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "icons/Fit-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "icons/Fit-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "icons/Fit-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icons/Fit-256x256.png",
      "sizes": "256x256",
      "type": "image/png"
    },
    {
      "src": "icons/Fit-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "icons/Fit-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
        start_url: '.',
       
        display: "standalone"
      },
      workbox:{
        runtimeCaching:[{
          urlPattern:"*",
          handler:"CacheFirst"
        }]
      }
    })

  ],
})
