class NotificationService {
  constructor() {
    this.permission = 'default';
    this.habitTimeouts = new Map();
    this.swRegistration = null;
    this.isInitialized = false;
    this.pendingNotifications = [];
    this.init();
  }

  async init() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
      if (this.permission === 'default') {
        this.permission = await Notification.requestPermission();
      }
    }
    
    // Aguardar service worker estar pronto
    if ('serviceWorker' in navigator) {
      await this.waitForServiceWorker();
      this.setupServiceWorkerListeners();
    }
    
    this.isInitialized = true;
    console.log('🔔 NotificationService inicializado. Suporte:', this.getCapabilities());
  }

  async waitForServiceWorker() {
    if (navigator.serviceWorker.controller) {
      this.swRegistration = await navigator.serviceWorker.getRegistration();
      return;
    }

    return new Promise((resolve) => {
      navigator.serviceWorker.addEventListener('controllerchange', async () => {
        this.swRegistration = await navigator.serviceWorker.getRegistration();
        resolve();
      });
    });
  }

  setupServiceWorkerListeners() {
    // Escutar mensagens do service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      const { type, data } = event.data || {};
      
      if (type === 'NOTIFICATION_CLICKED') {
        console.log('📱 Notificação clicada:', data);
        this.handleNotificationClick(data);
      }
    });

    // Re-agendar quando app ganha foco
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        console.log('🔄 App ganhou foco, re-agendando notificações...');
        setTimeout(() => this.rescheduleAllNotifications(), 1000);
      }
    });

    // Re-agendar quando service worker atualiza
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('🔄 Service Worker atualizado, re-agendando...');
      setTimeout(() => this.rescheduleAllNotifications(), 2000);
    });

    // Listener para mensagens do SW customizado
    navigator.serviceWorker.addEventListener('message', (event) => {
      const { type, habitId, habitTitle } = event.data || {};
      
      if (type === 'COMPLETE_HABIT') {
        window.dispatchEvent(new CustomEvent('completeHabitFromNotification', {
          detail: { habitId, habitTitle }
        }));
      } else if (type === 'RESCHEDULE_NOTIFICATIONS') {
        this.rescheduleAllNotifications();
      }
    });
  }

  async requestPermission() {
    if ('Notification' in window) {
      this.permission = await Notification.requestPermission();
      return this.permission;
    }
    return 'denied';
  }

  canShowNotifications() {
    return 'Notification' in window && this.permission === 'granted';
  }

  getCapabilities() {
    return {
      notifications: 'Notification' in window,
      serviceWorker: 'serviceWorker' in navigator,
      permission: this.permission,
      swRegistered: !!this.swRegistration,
      isMobile: this.isMobileDevice()
    };
  }

  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (navigator.maxTouchPoints && navigator.maxTouchPoints > 1);
  }

  async showNotification(title, options = {}) {
    if (!this.canShowNotifications()) {
      console.log('❌ Notificações não permitidas:', title);
      this.pendingNotifications.push({ title, options, timestamp: Date.now() });
      return null;
    }

    const defaultOptions = {
      icon: '/b-612/asteroid-icon.svg',
      badge: '/b-612/asteroid-icon.svg',
      vibrate: [200, 100, 200],
      tag: options.tag || 'b612-notification',
      requireInteraction: true,
      silent: false,
      ...options
    };

    // Usar service worker se disponível (melhor para mobile)
    if (this.swRegistration) {
      try {
        await this.swRegistration.showNotification(title, defaultOptions);
        console.log('📱 Notificação enviada via SW:', title);
        return true;
      } catch (error) {
        console.warn('⚠️ Falha no SW, usando fallback:', error);
      }
    }

    // Fallback para notificação direta
    try {
      new Notification(title, defaultOptions);
      console.log('🔔 Notificação enviada diretamente:', title);
      return true;
    } catch (error) {
      console.error('❌ Erro ao mostrar notificação:', error);
      return false;
    }
  }

  scheduleHabitNotification(habit) {
    if (!habit.hasNotification || !habit.notificationTime) return;

    // Cancelar notificações anteriores deste hábito
    this.cancelHabitNotifications(habit.id);

    this.scheduleNextHabitNotification(habit);
  }

  scheduleNextHabitNotification(habit) {
    const [hours, minutes] = habit.notificationTime.split(':');
    let nextNotificationDate = this.getNextHabitNotificationDate(habit);
    
    if (!nextNotificationDate) {
      console.log(`❌ Hábito ${habit.title}: Nenhuma data de notificação encontrada`);
      return;
    }
    
    nextNotificationDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const now = new Date();
    const delay = nextNotificationDate.getTime() - now.getTime();
    
    console.log(`⏰ Hábito "${habit.title}":`, {
      agora: now.toLocaleString('pt-BR'),
      proximaNotificacao: nextNotificationDate.toLocaleString('pt-BR'),
      delayMinutos: Math.round(delay / (1000 * 60)),
      frequency: habit.frequency,
      customDays: habit.customDays,
      isMobile: this.isMobileDevice()
    });
    
    if (delay > 0) {
      // Mobile: usar delays menores e re-scheduling mais frequente
      const maxDelay = this.isMobileDevice() ? 5 * 60 * 1000 : delay; // Max 5min no mobile
      const actualDelay = Math.min(delay, maxDelay);
      
      const timeoutId = setTimeout(() => {
        // Verificar se ainda é o horário correto (pode ter passado muito tempo)
        const currentDelay = nextNotificationDate.getTime() - new Date().getTime();
        
        if (Math.abs(currentDelay) < 2 * 60 * 1000) { // Margem de 2 minutos
          console.log(`🔔 Enviando notificação para: ${habit.title}`);
          this.showNotification(`Hora do hábito: ${habit.title}`, {
            body: habit.description || `Não esqueça de ${habit.title.toLowerCase()}!`,
            icon: this.getHabitIcon(habit.icon),
            tag: `habit-${habit.id}`,
            data: { type: 'habit', habitId: habit.id, habitTitle: habit.title },
            actions: this.swRegistration ? [
              { action: 'complete', title: '✓ Marcar como feito' },
              { action: 'later', title: '⏰ Lembrar depois' }
            ] : undefined
          });
          
          // Agendar próxima notificação
          this.scheduleNextHabitNotification(habit);
        } else if (currentDelay > 0) {
          // Re-agendar se ainda não chegou a hora
          console.log(`🔄 Re-agendando ${habit.title} em ${Math.round(currentDelay / (1000 * 60))}min`);
          this.scheduleNextHabitNotification(habit);
        } else {
          // Já passou da hora, agendar para próxima ocorrência
          console.log(`⏭️ Horário passou, agendando próxima ocorrência para ${habit.title}`);
          this.scheduleNextHabitNotification(habit);
        }
      }, actualDelay);
      
      this.habitTimeouts.set(habit.id, { 
        timeoutId, 
        scheduledFor: nextNotificationDate.getTime(),
        createdAt: Date.now() 
      });
      
      console.log(`✅ Notificação agendada para ${habit.title} em ${Math.round(actualDelay / (1000 * 60))} minutos`);
    } else {
      console.log(`⏭️ Hábito ${habit.title}: Horário passou, agendando para próxima ocorrência`);
      // Agendar para próxima ocorrência
      const nextDate = this.getNextHabitNotificationDate(habit, new Date(now.getTime() + 24 * 60 * 60 * 1000));
      if (nextDate) {
        const nextHabit = { ...habit };
        setTimeout(() => this.scheduleNextHabitNotification(nextHabit), 1000);
      }
    }
  }

  getNextHabitNotificationDate(habit, fromDate = new Date()) {
    const today = new Date(fromDate);
    today.setHours(0, 0, 0, 0);
    
    switch (habit.frequency) {
      case 'daily':
        // Para hábitos diários, próxima notificação é amanhã (ou hoje se ainda não passou)
        const [hours, minutes] = habit.notificationTime.split(':');
        const todayNotification = new Date(today);
        todayNotification.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        console.log(`📅 Hábito diário "${habit.title}":`, {
          agora: fromDate.toLocaleString('pt-BR'),
          horarioHoje: todayNotification.toLocaleString('pt-BR'),
          jaPassou: todayNotification <= fromDate
        });
        
        if (todayNotification > fromDate) {
          console.log(`✅ Notificação hoje às ${hours}:${minutes}`);
          return todayNotification;
        } else {
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          console.log(`➡️ Notificação agendada para amanhã às ${hours}:${minutes}`);
          return tomorrow;
        }
        
      case 'weekly':
        // Para hábitos semanais, próxima segunda-feira
        const daysUntilMonday = (8 - today.getDay()) % 7 || 7;
        const nextMonday = new Date(today);
        nextMonday.setDate(nextMonday.getDate() + daysUntilMonday);
        return nextMonday;
        
      case 'custom':
        if (!habit.customDays || habit.customDays.length === 0) return null;
        
        // Encontrar o próximo dia ativo
        const currentDay = fromDate.getDay();
        const sortedDays = [...habit.customDays].sort((a, b) => a - b);
        
        // Verificar se ainda há um dia ativo hoje
        const [todayHours, todayMinutes] = habit.notificationTime.split(':');
        const todayNotificationTime = new Date(fromDate);
        todayNotificationTime.setHours(parseInt(todayHours), parseInt(todayMinutes), 0, 0);
        
        if (sortedDays.includes(currentDay) && todayNotificationTime > fromDate) {
          return today;
        }
        
        // Encontrar próximo dia ativo nesta semana
        const nextDayThisWeek = sortedDays.find(day => day > currentDay);
        
        if (nextDayThisWeek !== undefined) {
          const nextDate = new Date(today);
          nextDate.setDate(nextDate.getDate() + (nextDayThisWeek - currentDay));
          return nextDate;
        } else {
          // Próximo dia ativo é na próxima semana
          const firstDayNextWeek = sortedDays[0];
          const nextDate = new Date(today);
          nextDate.setDate(nextDate.getDate() + (7 - currentDay + firstDayNextWeek));
          return nextDate;
        }
        
      default:
        return null;
    }
  }

  cancelHabitNotifications(habitId) {
    if (this.habitTimeouts && this.habitTimeouts.has(habitId)) {
      const timeoutData = this.habitTimeouts.get(habitId);
      if (timeoutData.timeoutId) {
        clearTimeout(timeoutData.timeoutId);
      }
      this.habitTimeouts.delete(habitId);
      console.log(`🚫 Notificações canceladas para hábito ${habitId}`);
    }
  }

  handleNotificationClick(data) {
    const { type, action, habitId, habitTitle } = data || {};
    
    if (type === 'habit') {
      if (action === 'complete') {
        // Emitir evento para completar hábito
        window.dispatchEvent(new CustomEvent('completeHabitFromNotification', {
          detail: { habitId, habitTitle }
        }));
      } else if (action === 'later') {
        // Re-agendar para 30 minutos
        console.log(`⏰ Re-agendando ${habitTitle} para 30 minutos`);
        setTimeout(() => {
          this.showNotification(`Lembrete: ${habitTitle}`, {
            body: `Hora de praticar: ${habitTitle}`,
            tag: `habit-${habitId}-reminder`,
            data: { type: 'habit', habitId, habitTitle }
          });
        }, 30 * 60 * 1000);
      }
    }
  }

  async rescheduleAllNotifications() {
    if (!this.isInitialized) return;
    
    try {
      console.log('🔄 Re-agendando todas as notificações...');
      
      // Cancelar timeouts antigos
      this.habitTimeouts.forEach(({ timeoutId }) => {
        if (timeoutId) clearTimeout(timeoutId);
      });
      this.habitTimeouts.clear();
      
      // Re-carregar e agendar hábitos
      const { habitService } = await import('../db');
      const habits = await habitService.getHabits();
      
      const habitsWithNotifications = habits.filter(h => h.hasNotification);
      console.log(`🔄 Re-agendando ${habitsWithNotifications.length} hábitos`);
      
      habits.forEach(habit => {
        if (habit.hasNotification) {
          this.scheduleHabitNotification(habit);
        }
      });
      
      // Processar notificações pendentes
      if (this.pendingNotifications.length > 0) {
        console.log(`📤 Processando ${this.pendingNotifications.length} notificações pendentes`);
        const pending = [...this.pendingNotifications];
        this.pendingNotifications = [];
        
        pending.forEach(({ title, options }) => {
          this.showNotification(title, options);
        });
      }
      
    } catch (error) {
      console.error('❌ Erro ao re-agendar notificações:', error);
    }
  }

  scheduleEventNotification(event) {
    if (!event.hasNotification || !event.notificationTime) return;

    const eventDateTime = new Date(`${event.date}T${event.startTime}`);
    const [hours, minutes] = event.notificationTime.split(':');
    const notificationTime = new Date(event.date);
    notificationTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const now = new Date();
    if (notificationTime <= now) return;

    const delay = notificationTime.getTime() - now.getTime();
    
    setTimeout(() => {
      const timeUntilEvent = Math.round((eventDateTime.getTime() - new Date().getTime()) / (1000 * 60));
      let body = event.description || `Você tem um compromisso: ${event.title}`;
      
      if (timeUntilEvent > 60) {
        const hoursUntil = Math.round(timeUntilEvent / 60);
        body += ` em ${hoursUntil} hora${hoursUntil > 1 ? 's' : ''}`;
      } else if (timeUntilEvent > 0) {
        body += ` em ${timeUntilEvent} minuto${timeUntilEvent > 1 ? 's' : ''}`;
      } else {
        body += ' agora!';
      }

      this.showNotification(`Lembrete: ${event.title}`, {
        body,
        tag: `event-${event.id}`,
        data: { type: 'event', eventId: event.id }
      });
    }, delay);
  }

  getHabitIcon(iconEmoji) {
    const iconMap = {
      '✨': '/icons/sparkles.png',
      '💪': '/icons/muscle.png',
      '📚': '/icons/book.png',
      '🏃‍♂️': '/icons/running.png',
      '🧘‍♀️': '/icons/meditation.png',
      '💧': '/icons/water.png',
      '🥗': '/icons/salad.png',
      '😴': '/icons/sleep.png',
      '🎯': '/icons/target.png',
      '💼': '/icons/work.png',
      '🎨': '/icons/art.png',
      '🎵': '/icons/music.png',
    };
    
    return iconMap[iconEmoji] || '/pwa-192x192.png';
  }

  testNotification() {
    this.showNotification('Teste do B-612', {
      body: 'As notificações estão funcionando! 🎉',
      tag: 'test-notification'
    });
  }

  // Função para testar notificação de hábito em 5 segundos
  testHabitNotification(habitTitle = 'Teste de Hábito') {
    console.log('🧪 Testando notificação de hábito em 5 segundos...');
    setTimeout(() => {
      this.showNotification(`Hora do hábito: ${habitTitle}`, {
        body: `Não esqueça de ${habitTitle.toLowerCase()}!`,
        icon: '/asteroid-icon.svg',
        tag: 'habit-test'
      });
      console.log('🔔 Notificação de teste enviada!');
    }, 5000);
  }

  // Debug: Listar todas as notificações ativas
  debugActiveNotifications() {
    console.log('🔍 Notificações ativas:', this.habitTimeouts);
    if (this.habitTimeouts) {
      this.habitTimeouts.forEach((timeoutId, habitId) => {
        console.log(`- Hábito ID ${habitId}: timeout ${timeoutId}`);
      });
    }
  }

  clearNotifications(tag) {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CLEAR_NOTIFICATIONS',
        tag
      });
    }
  }

  async initializeAllHabitNotifications() {
    // Aguardar inicialização completa
    if (!this.isInitialized) {
      await new Promise(resolve => {
        const checkInit = () => {
          if (this.isInitialized) {
            resolve();
          } else {
            setTimeout(checkInit, 100);
          }
        };
        checkInit();
      });
    }

    try {
      const { habitService } = await import('../db');
      const habits = await habitService.getHabits();
      
      const habitsWithNotifications = habits.filter(h => h.hasNotification);
      
      console.log(`🔔 Inicializando notificações para ${habitsWithNotifications.length} hábitos:`, 
        habitsWithNotifications.map(h => ({ 
          title: h.title, 
          time: h.notificationTime, 
          frequency: h.frequency,
          customDays: h.customDays,
          mobile: this.isMobileDevice()
        })));
      
      // Limpar timeouts antigos
      this.cancelAllNotifications();
      
      habits.forEach(habit => {
        if (habit.hasNotification) {
          this.scheduleHabitNotification(habit);
        }
      });
      
      console.log(`✅ Sistema unificado: ${habitsWithNotifications.length} hábitos agendados`);
      console.log(`📱 Mobile: ${this.isMobileDevice()}, SW: ${!!this.swRegistration}`);
    } catch (error) {
      console.error('❌ Erro ao inicializar notificações:', error);
    }
  }

  cancelAllNotifications() {
    if (this.habitTimeouts) {
      this.habitTimeouts.forEach(({ timeoutId }) => {
        if (timeoutId) clearTimeout(timeoutId);
      });
      this.habitTimeouts.clear();
      console.log('🚫 Todas as notificações canceladas');
    }
  }
}

export const notificationService = new NotificationService();

// Expor funções de debug globalmente durante desenvolvimento
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  window.debugNotifications = {
    test: () => notificationService.testNotification(),
    testHabit: (title) => notificationService.testHabitNotification(title),
    active: () => notificationService.debugActiveNotifications(),
    schedule: (habitId) => {
      // Re-agendar notificações de um hábito específico
      import('../db').then(({ habitService }) => {
        habitService.getHabit(habitId).then(habit => {
          if (habit && habit.hasNotification) {
            notificationService.scheduleHabitNotification(habit);
          }
        });
      });
    }
  };
  console.log('🧰 Debug de notificações disponível em window.debugNotifications');
}