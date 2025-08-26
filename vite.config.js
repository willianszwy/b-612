import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/b-612/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'B-612 - Gestão de Hábitos e Agenda',
        short_name: 'B-612',
        description: 'Um PWA para gestão de hábitos e agenda pessoal inspirado no Pequeno Príncipe',
        theme_color: '#E6E6FA',
        background_color: '#E6E6FA',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/b-612/',
        start_url: '/b-612/',
        icons: [
          {
            src: 'asteroid-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: 'asteroid-icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'maskable'
          },
          {
            src: 'asteroid-icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
})
