import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register Service Worker via Vite PWA
import { registerSW } from 'virtual:pwa-register'

if ('serviceWorker' in navigator) {
  registerSW({
    onNeedRefresh() {
      console.log('PWA: Nova versão disponível')
    },
    onOfflineReady() {
      console.log('PWA: Pronto para uso offline')
    },
  })
}
