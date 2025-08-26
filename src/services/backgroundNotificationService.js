/**
 * Background Notification Service - B-612 PWA
 * Gerencia notificações que funcionam mesmo com app fechado
 */

class BackgroundNotificationService {
  constructor() {
    this.swRegistration = null;
    this.isSupported = this.checkSupport();
    this.isInitializing = false; // Flag para evitar múltiplas inicializações
  }

  // Verificar suporte a notificações e service workers
  checkSupport() {
    return (
      'serviceWorker' in navigator &&
      'Notification' in window &&
      'PushManager' in window
    );
  }

  // Inicializar service worker customizado
  async initialize() {
    if (!this.isSupported) {
      console.warn('Background notifications não são suportadas neste navegador');
      return false;
    }

    // Verificar se já existe um service worker registrado
    if (this.swRegistration) {
      console.log('Service Worker já inicializado');
      return true;
    }

    // Evitar múltiplas inicializações simultâneas
    if (this.isInitializing) {
      console.log('Service Worker já está sendo inicializado');
      return false;
    }

    this.isInitializing = true;

    try {
      // Verificar se já existe uma instância registrada
      const existingRegistration = await navigator.serviceWorker.getRegistration('/b-612/');
      if (existingRegistration) {
        console.log('Service Worker já registrado, reutilizando:', existingRegistration);
        this.swRegistration = existingRegistration;
      } else {
        // Registrar novo service worker customizado
        this.swRegistration = await navigator.serviceWorker.register(
          '/b-612/custom-sw.js',
          { scope: '/b-612/' }
        );
        console.log('Service Worker registrado:', this.swRegistration);
      }

      // Aguardar SW estar ativo
      await this.waitForServiceWorker();

      // Configurar listener para mensagens do SW
      this.setupMessageListener();

      // Solicitar permissão de notificação
      await this.requestNotificationPermission();

      this.isInitializing = false;
      return true;
    } catch (error) {
      console.error('Erro ao inicializar Background Notifications:', error);
      this.isInitializing = false;
      return false;
    }
  }

  // Aguardar service worker estar ativo
  async waitForServiceWorker() {
    return new Promise((resolve) => {
      if (this.swRegistration.active) {
        resolve();
        return;
      }

      const worker = this.swRegistration.installing || this.swRegistration.waiting;
      if (worker) {
        worker.addEventListener('statechange', () => {
          if (worker.state === 'activated') {
            resolve();
          }
        });
      }
    });
  }

  // Configurar listener para mensagens do service worker
  setupMessageListener() {
    navigator.serviceWorker.addEventListener('message', (event) => {
      const { type, habitId, habitTitle } = event.data || {};
      
      if (type === 'COMPLETE_HABIT') {
        console.log('Recebida solicitação para completar hábito:', habitTitle);
        
        // Emitir evento personalizado que a aplicação pode escutar
        window.dispatchEvent(new CustomEvent('completeHabitFromNotification', {
          detail: { habitId, habitTitle }
        }));
      }
    });
  }

  // Solicitar permissão de notificação
  async requestNotificationPermission() {
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      console.log('Permissão de notificação:', permission);
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  }

  // Atualizar notificações no service worker
  async updateNotifications() {
    if (!this.swRegistration || !this.swRegistration.active) {
      console.warn('Service Worker não está ativo');
      return;
    }

    // Enviar mensagem para o SW atualizar as notificações
    this.swRegistration.active.postMessage({
      type: 'UPDATE_NOTIFICATIONS'
    });

    console.log('Solicitação de atualização enviada ao Service Worker');
  }

  // Agendar notificação específica
  async scheduleNotification(habit) {
    if (!this.swRegistration || !this.swRegistration.active) {
      console.warn('Service Worker não está ativo');
      return;
    }

    this.swRegistration.active.postMessage({
      type: 'SCHEDULE_NOTIFICATION',
      data: habit
    });

    console.log('Notificação agendada para:', habit.title);
  }

  // Cancelar todas as notificações pendentes
  async cancelAllNotifications() {
    if (!this.swRegistration) return;

    const notifications = await this.swRegistration.getNotifications();
    notifications.forEach(notification => notification.close());
    
    console.log(`${notifications.length} notificações canceladas`);
  }

  // Verificar se há notificações ativas
  async getActiveNotifications() {
    if (!this.swRegistration) return [];
    return await this.swRegistration.getNotifications();
  }

  // Mostrar notificação de teste
  async showTestNotification() {
    if (!this.isSupported || Notification.permission !== 'granted') {
      console.warn('Notificações não permitidas');
      return;
    }

    if (!this.swRegistration) {
      console.warn('Service Worker não registrado');
      return;
    }

    await this.swRegistration.showNotification('🚀 B-612 Test', {
      body: 'As notificações em background estão funcionando!',
      icon: '/asteroid-icon.svg',
      badge: '/asteroid-icon.svg',
      tag: 'test-notification',
      requireInteraction: true,
      data: { test: true }
    });

    console.log('Notificação de teste enviada');
  }
}

// Instância singleton
const backgroundNotificationService = new BackgroundNotificationService();

export default backgroundNotificationService;