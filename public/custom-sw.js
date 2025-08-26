// Service Worker para notificações em background - B-612 PWA

const CACHE_NAME = 'b612-cache-v1';
const DB_NAME = 'B612-DB';
const DB_VERSION = 2;

// Instalar Service Worker
self.addEventListener('install', event => {
  console.log('B-612 Service Worker: Instalado');
  self.skipWaiting();
});

// Ativar Service Worker
self.addEventListener('activate', event => {
  console.log('B-612 Service Worker: Ativado');
  event.waitUntil(self.clients.claim());
});

// Função para acessar IndexedDB no Service Worker
async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

// Função para buscar hábitos do banco
async function getHabitsFromDB() {
  try {
    const db = await openDB();
    const transaction = db.transaction(['habits'], 'readonly');
    const store = transaction.objectStore('habits');
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  } catch (error) {
    console.error('SW: Erro ao acessar habits:', error);
    return [];
  }
}

// Função para mostrar notificação
async function showNotification(habitTitle, habitIcon, habitId) {
  const options = {
    body: `Hora de praticar: ${habitTitle}`,
    icon: '/asteroid-icon.svg',
    badge: '/asteroid-icon.svg',
    tag: `habit-${habitId}`,
    requireInteraction: true,
    actions: [
      {
        action: 'complete',
        title: '✓ Marcar como feito',
        icon: '/asteroid-icon.svg'
      },
      {
        action: 'later',
        title: '⏰ Lembrar mais tarde',
        icon: '/asteroid-icon.svg'
      }
    ],
    data: {
      habitId,
      habitTitle,
      habitIcon,
      timestamp: Date.now()
    }
  };

  await self.registration.showNotification(
    `${habitIcon || '✨'} ${habitTitle}`,
    options
  );
}

// Verificar hábitos que precisam de notificação
async function checkHabitsForNotifications() {
  try {
    const habits = await getHabitsFromDB();
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const today = now.getDay(); // 0 = domingo, 6 = sábado

    console.log('SW: Verificando hábitos para notificações:', habits.length);

    for (const habit of habits) {
      if (!habit.hasNotification || !habit.notificationTime) continue;

      // Verificar se é hora da notificação (com margem de 1 minuto)
      const notificationTime = habit.notificationTime;
      if (Math.abs(timeToMinutes(currentTime) - timeToMinutes(notificationTime)) <= 1) {
        
        // Verificar se o hábito deve ser executado hoje
        let shouldNotify = false;
        
        switch (habit.frequency) {
          case 'daily':
            shouldNotify = true;
            break;
          case 'weekly':
            // Assumir que semanal é apenas uma vez por semana (domingo)
            shouldNotify = today === 0;
            break;
          case 'custom':
            shouldNotify = habit.customDays && habit.customDays.includes(today);
            break;
        }

        // Verificar se já foi completado hoje
        if (shouldNotify && habit.lastCompleted) {
          const lastCompleted = new Date(habit.lastCompleted);
          const todayStart = new Date(now);
          todayStart.setHours(0, 0, 0, 0);
          
          if (lastCompleted >= todayStart) {
            shouldNotify = false; // Já foi completado hoje
          }
        }

        if (shouldNotify) {
          console.log('SW: Enviando notificação para:', habit.title);
          await showNotification(habit.title, habit.icon, habit.id);
        }
      }
    }
  } catch (error) {
    console.error('SW: Erro ao verificar notificações:', error);
  }
}

// Função auxiliar para converter hora em minutos
function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// Configurar verificação periódica (a cada minuto)
let notificationInterval;

function startNotificationCheck() {
  // Limpar intervalo anterior se existir
  if (notificationInterval) {
    clearInterval(notificationInterval);
  }
  
  // Verificar a cada minuto
  notificationInterval = setInterval(() => {
    checkHabitsForNotifications();
  }, 60000); // 60 segundos

  // Verificar imediatamente também
  checkHabitsForNotifications();
}

// Iniciar verificação quando o SW ativar
self.addEventListener('activate', event => {
  console.log('B-612 Service Worker: Iniciando verificação de notificações');
  startNotificationCheck();
});

// Escutar cliques nas notificações
self.addEventListener('notificationclick', event => {
  const { action, data } = event;
  const { habitId, habitTitle } = data || {};

  event.notification.close();

  if (action === 'complete') {
    // Abrir o app e marcar como completo
    event.waitUntil(
      self.clients.matchAll().then(clients => {
        const client = clients.find(c => c.visibilityState === 'visible');
        
        if (client) {
          // Se app está aberto, enviar mensagem
          client.postMessage({
            type: 'COMPLETE_HABIT',
            habitId,
            habitTitle
          });
          client.focus();
        } else {
          // Se app está fechado, abrir
          self.clients.openWindow('/b-612/').then(client => {
            // Aguardar um pouco para o app carregar
            setTimeout(() => {
              client.postMessage({
                type: 'COMPLETE_HABIT',
                habitId,
                habitTitle
              });
            }, 2000);
          });
        }
      })
    );
  } else if (action === 'later') {
    // Reagendar para 30 minutos
    setTimeout(() => {
      showNotification(habitTitle, data.habitIcon, habitId);
    }, 30 * 60 * 1000); // 30 minutos
  } else {
    // Clique padrão - abrir app
    event.waitUntil(
      self.clients.matchAll().then(clients => {
        const client = clients.find(c => c.visibilityState === 'visible');
        
        if (client) {
          client.focus();
        } else {
          self.clients.openWindow('/b-612/');
        }
      })
    );
  }
});

// Escutar mensagens do app principal
self.addEventListener('message', event => {
  const { type, data } = event.data || {};
  
  if (type === 'UPDATE_NOTIFICATIONS') {
    console.log('SW: Recebido comando para atualizar notificações');
    // Reiniciar verificação com dados atualizados
    startNotificationCheck();
  } else if (type === 'SCHEDULE_NOTIFICATION') {
    console.log('SW: Agendando notificação para:', data);
    // Lógica adicional para agendar notificação específica
  }
});