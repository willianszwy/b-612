class NotificationService {
  constructor() {
    this.permission = 'default';
    this.init();
  }

  async init() {
    if ('Notification' in window) {
      this.permission = await Notification.requestPermission();
    }
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

  showNotification(title, options = {}) {
    if (!this.canShowNotifications()) {
      console.log('Notificações não permitidas:', title);
      return null;
    }

    const defaultOptions = {
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      vibrate: [200, 100, 200],
      tag: 'fabulous-habit',
      requireInteraction: true,
      ...options
    };

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_NOTIFICATION',
        title,
        options: defaultOptions
      });
    } else {
      return new Notification(title, defaultOptions);
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
      customDays: habit.customDays
    });
    
    if (delay > 0) {
      const timeoutId = setTimeout(() => {
        console.log(`🔔 Enviando notificação para: ${habit.title}`);
        this.showNotification(`Hora do hábito: ${habit.title}`, {
          body: habit.description || `Não esqueça de ${habit.title.toLowerCase()}!`,
          icon: this.getHabitIcon(habit.icon),
          tag: `habit-${habit.id}`,
          data: { type: 'habit', habitId: habit.id }
        });
        
        // Agendar próxima notificação
        this.scheduleNextHabitNotification(habit);
      }, delay);
      
      // Armazenar o timeoutId para poder cancelar depois
      if (!this.habitTimeouts) this.habitTimeouts = new Map();
      this.habitTimeouts.set(habit.id, timeoutId);
      
      console.log(`✅ Notificação agendada para ${habit.title} em ${Math.round(delay / (1000 * 60))} minutos`);
    } else {
      console.log(`⚠️ Hábito ${habit.title}: Horário já passou hoje, delay: ${delay}`);
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
      clearTimeout(this.habitTimeouts.get(habitId));
      this.habitTimeouts.delete(habitId);
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
    try {
      // Importar o habitService dinamicamente para evitar dependência circular
      const { habitService } = await import('../db');
      const habits = await habitService.getHabits();
      
      const habitsWithNotifications = habits.filter(h => h.hasNotification);
      
      console.log(`🔔 Inicializando notificações para ${habitsWithNotifications.length} hábitos:`, 
        habitsWithNotifications.map(h => ({ 
          title: h.title, 
          time: h.notificationTime, 
          frequency: h.frequency,
          customDays: h.customDays 
        })));
      
      habits.forEach(habit => {
        if (habit.hasNotification) {
          this.scheduleHabitNotification(habit);
        }
      });
      
      console.log(`✅ Finalizadas notificações para ${habitsWithNotifications.length} hábitos`);
    } catch (error) {
      console.error('Erro ao inicializar notificações de hábitos:', error);
    }
  }

  cancelAllNotifications() {
    if (this.habitTimeouts) {
      this.habitTimeouts.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
      this.habitTimeouts.clear();
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