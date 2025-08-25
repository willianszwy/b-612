import { db } from '../db';

class BackupService {
  async exportData() {
    try {
      const habits = await db.habits.toArray();
      const events = await db.events.toArray();
      const progress = await db.progress.toArray();
      const notifications = await db.notifications.toArray();

      const data = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        appName: 'B-612',
        data: {
          habits: habits.filter(h => h.isActive !== false),
          events,
          progress,
          notifications: notifications.filter(n => n.isActive)
        }
      };

      return data;
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      throw new Error('Erro ao exportar dados');
    }
  }

  async importData(importData) {
    try {
      if (!importData.version || !importData.data) {
        throw new Error('Formato de dados inválido');
      }

      const { habits, events, progress, notifications } = importData.data;

      await db.transaction('rw', [db.habits, db.events, db.progress, db.notifications], async () => {
        if (habits && habits.length > 0) {
          for (const habit of habits) {
            const existingHabit = await db.habits.where('title').equals(habit.title).first();
            if (!existingHabit) {
              const { id, ...habitData } = habit;
              await db.habits.add({
                ...habitData,
                createdAt: habitData.createdAt ? new Date(habitData.createdAt) : new Date(),
                lastCompleted: habitData.lastCompleted ? new Date(habitData.lastCompleted) : null
              });
            }
          }
        }

        if (events && events.length > 0) {
          for (const event of events) {
            const existingEvent = await db.events
              .where('[title+date]')
              .equals([event.title, event.date])
              .first();
            
            if (!existingEvent) {
              const { id, ...eventData } = event;
              await db.events.add({
                ...eventData,
                createdAt: eventData.createdAt ? new Date(eventData.createdAt) : new Date()
              });
            }
          }
        }

        if (progress && progress.length > 0) {
          for (const prog of progress) {
            const { id, ...progressData } = prog;
            await db.progress.add({
              ...progressData,
              completedAt: progressData.completedAt ? new Date(progressData.completedAt) : new Date()
            });
          }
        }

        if (notifications && notifications.length > 0) {
          for (const notif of notifications) {
            const { id, ...notificationData } = notif;
            await db.notifications.add({
              ...notificationData,
              scheduledTime: notificationData.scheduledTime ? new Date(notificationData.scheduledTime) : new Date()
            });
          }
        }
      });

      return true;
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      throw new Error('Erro ao importar dados: ' + error.message);
    }
  }

  downloadBackup(data, filename = null) {
    const defaultFilename = `b612-backup-${new Date().toISOString().split('T')[0]}.json`;
    const finalFilename = filename || defaultFilename;
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = finalFilename;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          resolve(data);
        } catch (error) {
          reject(new Error('Arquivo JSON inválido'));
        }
      };
      
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsText(file);
    });
  }

  async clearAllData() {
    try {
      await db.transaction('rw', [db.habits, db.events, db.progress, db.notifications], async () => {
        await db.habits.clear();
        await db.events.clear();
        await db.progress.clear();
        await db.notifications.clear();
      });
      return true;
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      throw new Error('Erro ao limpar dados');
    }
  }

  async getStorageInfo() {
    try {
      const habitsCount = await db.habits.count();
      const eventsCount = await db.events.count();
      const progressCount = await db.progress.count();
      const notificationsCount = await db.notifications.count();

      let storageEstimate = { usage: 0, quota: 0 };
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        storageEstimate = await navigator.storage.estimate();
      }

      return {
        counts: {
          habits: habitsCount,
          events: eventsCount,
          progress: progressCount,
          notifications: notificationsCount,
          total: habitsCount + eventsCount + progressCount + notificationsCount
        },
        storage: {
          used: storageEstimate.usage || 0,
          available: storageEstimate.quota || 0,
          usedFormatted: this.formatBytes(storageEstimate.usage || 0),
          availableFormatted: this.formatBytes(storageEstimate.quota || 0)
        }
      };
    } catch (error) {
      console.error('Erro ao obter informações de armazenamento:', error);
      return {
        counts: { habits: 0, events: 0, progress: 0, notifications: 0, total: 0 },
        storage: { used: 0, available: 0, usedFormatted: '0 B', availableFormatted: '0 B' }
      };
    }
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}

export const backupService = new BackupService();