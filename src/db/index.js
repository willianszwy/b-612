import Dexie from 'dexie';

export class FabulousDB extends Dexie {
  constructor() {
    super('FabulousDB');
    this.version(1).stores({
      habits: '++id, title, description, icon, frequency, streak, lastCompleted, createdAt, isActive',
      events: '++id, title, description, date, startTime, endTime, category, hasNotification, notificationTime, createdAt',
      notifications: '++id, type, entityId, scheduledTime, message, isActive',
      progress: '++id, habitId, completedAt, date'
    });
    
    // Versão 2: Adicionando campos para frequência personalizada e eventos recorrentes
    this.version(2).stores({
      habits: '++id, title, description, icon, frequency, customDays, streak, lastCompleted, createdAt, isActive',
      events: '++id, title, description, date, startTime, endTime, category, frequency, customDays, hasNotification, notificationTime, createdAt, isRecurring, parentEventId',
      notifications: '++id, type, entityId, scheduledTime, message, isActive',
      progress: '++id, habitId, completedAt, date'
    }).upgrade(tx => {
      // Migração: adicionar campos padrão para registros existentes
      return tx.habits.toCollection().modify(habit => {
        if (!habit.customDays) {
          habit.customDays = habit.frequency === 'custom' ? [1,2,3,4,5,6,0] : [];
        }
      }).then(() => {
        return tx.events.toCollection().modify(event => {
          if (!event.frequency) {
            event.frequency = 'once';
            event.customDays = [];
            event.isRecurring = false;
            event.parentEventId = null;
          }
        });
      });
    });
  }
}

export const db = new FabulousDB();

export const habitService = {
  async createHabit(habit) {
    const newHabit = {
      ...habit,
      customDays: habit.customDays || [],
      streak: 0,
      lastCompleted: null,
      createdAt: new Date(),
      isActive: 1
    };
    return await db.habits.add(newHabit);
  },

  async getHabits() {
    try {
      return await db.habits.where('isActive').equals(1).toArray();
    } catch (error) {
      console.error('Erro ao buscar hábitos:', error);
      // Fallback: buscar todos e filtrar
      const allHabits = await db.habits.toArray();
      return allHabits.filter(h => h.isActive === true || h.isActive === 1);
    }
  },

  async updateHabit(id, updates) {
    return await db.habits.update(id, updates);
  },

  async deleteHabit(id) {
    return await db.habits.update(id, { isActive: 0 });
  },

  async completeHabit(habitId) {
    const today = new Date().toISOString().split('T')[0];
    const habit = await db.habits.get(habitId);
    
    const lastCompletedDate = habit.lastCompleted 
      ? new Date(habit.lastCompleted).toISOString().split('T')[0]
      : null;

    if (lastCompletedDate === today) {
      return { success: false, message: 'Hábito já foi concluído hoje!' };
    }

    const newStreak = this.calculateStreak(habit.lastCompleted, today);
    
    await db.habits.update(habitId, {
      streak: newStreak,
      lastCompleted: new Date()
    });

    await db.progress.add({
      habitId,
      completedAt: new Date(),
      date: today
    });

    return { success: true, streak: newStreak };
  },

  calculateStreak(lastCompleted, today) {
    if (!lastCompleted) return 1;
    
    const lastDate = new Date(lastCompleted);
    const todayDate = new Date(today);
    const diffTime = todayDate - lastDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 1;
    } else if (diffDays === 0) {
      return 1;
    } else {
      return 1;
    }
  },

  isHabitActiveToday(habit, date = new Date()) {
    const dayOfWeek = date.getDay(); // 0 = domingo, 1 = segunda, etc.
    
    switch (habit.frequency) {
      case 'daily':
        return true;
      case 'weekly':
        // Para semanal, considera ativo apenas na segunda-feira (dia 1)
        return dayOfWeek === 1;
      case 'custom':
        return habit.customDays && habit.customDays.includes(dayOfWeek);
      default:
        return false;
    }
  },

  getNextActiveDay(habit, fromDate = new Date()) {
    if (habit.frequency === 'daily') {
      const nextDay = new Date(fromDate);
      nextDay.setDate(nextDay.getDate() + 1);
      return nextDay;
    }
    
    if (habit.frequency === 'weekly') {
      const nextWeek = new Date(fromDate);
      nextWeek.setDate(nextWeek.getDate() + 7);
      return nextWeek;
    }
    
    if (habit.frequency === 'custom' && habit.customDays.length > 0) {
      const currentDay = fromDate.getDay();
      const sortedDays = [...habit.customDays].sort((a, b) => a - b);
      
      // Encontrar o próximo dia na mesma semana
      const nextDayThisWeek = sortedDays.find(day => day > currentDay);
      
      if (nextDayThisWeek !== undefined) {
        const nextDate = new Date(fromDate);
        const daysToAdd = nextDayThisWeek - currentDay;
        nextDate.setDate(nextDate.getDate() + daysToAdd);
        return nextDate;
      } else {
        // Se não há próximo dia nesta semana, vai para o primeiro dia da próxima semana
        const firstDayNextWeek = sortedDays[0];
        const nextDate = new Date(fromDate);
        const daysToAdd = 7 - currentDay + firstDayNextWeek;
        nextDate.setDate(nextDate.getDate() + daysToAdd);
        return nextDate;
      }
    }
    
    return null;
  }
};

export const eventService = {
  async createEvent(event) {
    const newEvent = {
      ...event,
      frequency: event.frequency || 'once',
      customDays: event.customDays || [],
      isRecurring: event.frequency !== 'once',
      parentEventId: null,
      createdAt: new Date()
    };
    
    const parentId = await db.events.add(newEvent);
    
    // Se é recorrente, criar instâncias futuras
    if (event.frequency !== 'once') {
      await this.createRecurringInstances(parentId, newEvent);
    }
    
    return parentId;
  },

  async createRecurringInstances(parentId, baseEvent, months = 3) {
    const instances = [];
    const startDate = new Date(baseEvent.date);
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + months);
    
    let currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + 1); // Começar do dia seguinte
    
    while (currentDate <= endDate) {
      let shouldCreateInstance = false;
      
      switch (baseEvent.frequency) {
        case 'daily':
          shouldCreateInstance = true;
          currentDate.setDate(currentDate.getDate() + 1);
          break;
          
        case 'weekly':
          shouldCreateInstance = true;
          currentDate.setDate(currentDate.getDate() + 7);
          break;
          
        case 'custom':
          const dayOfWeek = currentDate.getDay();
          if (baseEvent.customDays.includes(dayOfWeek)) {
            shouldCreateInstance = true;
          }
          currentDate.setDate(currentDate.getDate() + 1);
          break;
          
        default:
          break;
      }
      
      if (shouldCreateInstance) {
        const instance = {
          ...baseEvent,
          id: undefined,
          date: currentDate.toISOString().split('T')[0],
          parentEventId: parentId,
          createdAt: new Date()
        };
        instances.push(instance);
      }
      
      // Evitar loop infinito
      if (instances.length > 365) break;
    }
    
    if (instances.length > 0) {
      await db.events.bulkAdd(instances);
    }
  },

  async getEvents(startDate, endDate) {
    try {
      // Garantir que as datas estão no formato correto (YYYY-MM-DD)
      const start = typeof startDate === 'string' ? startDate : startDate.toISOString().split('T')[0];
      const end = typeof endDate === 'string' ? endDate : endDate.toISOString().split('T')[0];
      
      return await db.events
        .where('date')
        .between(start, end, true, true)
        .toArray();
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      // Fallback: buscar todos e filtrar manualmente
      const allEvents = await db.events.toArray();
      const start = typeof startDate === 'string' ? startDate : startDate.toISOString().split('T')[0];
      const end = typeof endDate === 'string' ? endDate : endDate.toISOString().split('T')[0];
      
      return allEvents.filter(event => {
        const eventDate = event.date;
        return eventDate >= start && eventDate <= end;
      });
    }
  },

  async updateEvent(id, updates) {
    return await db.events.update(id, updates);
  },

  async deleteEvent(id) {
    return await db.events.delete(id);
  }
};

export const notificationService = {
  async scheduleNotification(type, entityId, scheduledTime, message) {
    return await db.notifications.add({
      type,
      entityId,
      scheduledTime,
      message,
      isActive: 1
    });
  },

  async getActiveNotifications() {
    try {
      return await db.notifications.where('isActive').equals(1).toArray();
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      // Fallback: buscar todas e filtrar
      const allNotifications = await db.notifications.toArray();
      return allNotifications.filter(n => n.isActive === true || n.isActive === 1);
    }
  },

  async deactivateNotification(id) {
    return await db.notifications.update(id, { isActive: 0 });
  }
};