// Service Worker customizado para notificações - B-612
// Integra com Vite PWA para funcionalidade estendida

import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';

// Vite PWA precaching
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

const NOTIFICATION_TAG_PREFIX = 'b612-habit-';

// Listener para cliques em notificações
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 SW: Notificação clicada', event);
  
  const { action, data } = event.notification;
  const { habitId, habitTitle, type } = data || {};

  event.notification.close();

  if (type === 'habit') {
    if (action === 'complete') {
      // Enviar mensagem para a aplicação marcar como completo
      event.waitUntil(
        self.clients.matchAll({ type: 'window' }).then(clients => {
          const client = clients.find(c => c.visibilityState === 'visible');
          
          if (client) {
            client.postMessage({
              type: 'COMPLETE_HABIT',
              habitId,
              habitTitle
            });
            client.focus();
          } else {
            // Abrir aplicação e enviar mensagem
            self.clients.openWindow('/b-612/').then(newClient => {
              if (newClient) {
                setTimeout(() => {
                  newClient.postMessage({
                    type: 'COMPLETE_HABIT',
                    habitId,
                    habitTitle
                  });
                }, 2000);
              }
            });
          }
        })
      );
    } else if (action === 'later') {
      // Re-agendar notificação para 30 minutos
      setTimeout(() => {
        self.registration.showNotification(`⏰ Lembrete: ${habitTitle}`, {
          body: `Hora de praticar: ${habitTitle}`,
          icon: '/b-612/asteroid-icon.svg',
          badge: '/b-612/asteroid-icon.svg',
          tag: `${NOTIFICATION_TAG_PREFIX}${habitId}-reminder`,
          requireInteraction: true,
          data: { type: 'habit', habitId, habitTitle },
          actions: [
            { action: 'complete', title: '✓ Marcar como feito' },
            { action: 'later', title: '⏰ Mais 30min' }
          ]
        });
      }, 30 * 60 * 1000); // 30 minutos
    } else {
      // Clique padrão - abrir aplicação
      event.waitUntil(
        self.clients.matchAll({ type: 'window' }).then(clients => {
          const client = clients.find(c => c.visibilityState === 'visible');
          
          if (client) {
            client.focus();
          } else {
            self.clients.openWindow('/b-612/');
          }
        })
      );
    }
  }
});

// Listener para mensagens da aplicação
self.addEventListener('message', (event) => {
  const { type, data } = event.data || {};
  
  if (type === 'NOTIFICATION_CLICKED') {
    // Repassar para a aplicação
    event.ports[0].postMessage({
      type: 'NOTIFICATION_CLICKED',
      data
    });
  }
});

// Background sync para re-agendar notificações perdidas
self.addEventListener('sync', (event) => {
  console.log('🔄 SW: Background sync triggered', event.tag);
  
  if (event.tag === 'reschedule-notifications') {
    event.waitUntil(rescheduleNotifications());
  }
});

async function rescheduleNotifications() {
  console.log('🔄 SW: Re-agendando notificações perdidas...');
  
  try {
    // Enviar mensagem para aplicação re-agendar notificações
    const clients = await self.clients.matchAll({ type: 'window' });
    
    clients.forEach(client => {
      client.postMessage({
        type: 'RESCHEDULE_NOTIFICATIONS'
      });
    });
    
    console.log('✅ SW: Solicitação de re-agendamento enviada');
  } catch (error) {
    console.error('❌ SW: Erro no background sync:', error);
  }
}

// Interceptar requisições (necessário para PWA)
self.addEventListener('fetch', (event) => {
  // Deixar o Vite PWA gerenciar o cache
  // Este listener é apenas para manter a funcionalidade de SW
});

console.log('🚀 SW: Service Worker customizado B-612 carregado');