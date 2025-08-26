import { useState, useEffect } from 'react';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Habits from './pages/Habits';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
import HabitForm from './components/Habits/HabitForm';
import EventForm from './components/Calendar/EventForm';
import { habitService, eventService } from './db';
import { notificationService } from './services/notificationService';
import backgroundNotificationService from './services/backgroundNotificationService';
import { ModalProvider, ToastProvider, useToast } from './design-system';
import './design-system/styles.css';

function AppContent() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [habitsKey, setHabitsKey] = useState(0);
  const toast = useToast();

  useEffect(() => {
    requestNotificationPermission();
    
    // Inicializar notificações tradicionais
    setTimeout(() => {
      notificationService.initializeAllHabitNotifications();
    }, 1000);

    // Inicializar notificações em background (funcionam com app fechado)
    initializeBackgroundNotifications();

    // Escutar completar hábito via notificação
    const handleCompleteFromNotification = (event) => {
      const { habitId, habitTitle } = event.detail;
      toast.info(`Completando hábito: ${habitTitle}`, {
        title: 'Via Notificação 📱'
      });
      // Aqui você pode adicionar lógica para marcar o hábito como completo
      setHabitsKey(prev => prev + 1); // Força atualização da lista
    };

    window.addEventListener('completeHabitFromNotification', handleCompleteFromNotification);

    return () => {
      window.removeEventListener('completeHabitFromNotification', handleCompleteFromNotification);
    };
  }, [toast]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      const permission = await Notification.requestPermission();
      console.log('Permissão de notificação:', permission);
    }
  };

  const initializeBackgroundNotifications = async () => {
    try {
      const initialized = await backgroundNotificationService.initialize();
      if (initialized) {
        console.log('✅ Notificações em background inicializadas');
        toast.success('Notificações em background ativadas!', {
          title: 'PWA Configurado 🚀',
          duration: 3000
        });
        
        // Atualizar notificações com dados atuais
        setTimeout(() => {
          backgroundNotificationService.updateNotifications();
        }, 2000);
      } else {
        console.log('❌ Notificações em background não suportadas');
      }
    } catch (error) {
      console.error('Erro ao inicializar notificações background:', error);
    }
  };

  const getPageTitle = () => {
    const titles = {
      dashboard: 'B-612',
      habits: 'Meus Hábitos',
      calendar: 'Agenda',
      settings: 'Configurações'
    };
    return titles[currentView] || 'B-612';
  };

  const getPageSubtitle = () => {
    const subtitles = {
      dashboard: 'Seu pequeno mundo de hábitos',
      habits: 'Cuide do sentido que os sons das palavras cuidarão de si mesmos',
      calendar: 'Save the cheerleader, save the world',
      settings: 'Personalize sua experiência'
    };
    return subtitles[currentView] || '';
  };

  const handleAddClick = (type) => {
    if (type === 'habit') {
      setShowHabitForm(true);
    } else if (type === 'event') {
      setShowEventForm(true);
    }
  };

  const handleSaveHabit = async (habitData) => {
    try {
      console.log('App.jsx - Salvando hábito:', habitData);
      const habitId = await habitService.createHabit(habitData);
      console.log('App.jsx - Hábito criado com ID:', habitId);
      
      // Agendar notificações se habilitadas
      if (habitData.hasNotification && habitData.notificationTime) {
        const newHabit = { ...habitData, id: habitId };
        // Notificações tradicionais (app aberto)
        notificationService.scheduleHabitNotification(newHabit);
        // Notificações background (app fechado)
        backgroundNotificationService.updateNotifications();
      }
      
      setShowHabitForm(false);
      
      if (currentView !== 'habits') {
        setCurrentView('habits');
      }
      
      // Force re-render of Habits component by updating key
      setHabitsKey(prev => prev + 1);
      
      // Mostrar toast de sucesso
      toast.success('Hábito criado com sucesso!', {
        title: 'Sucesso! 🎉'
      });
    } catch (error) {
      console.error('Erro ao criar hábito:', error);
      toast.error('Erro ao criar hábito. Tente novamente.', {
        title: 'Ops! 😔'
      });
    }
  };

  const handleSaveEvent = async (eventData) => {
    try {
      await eventService.createEvent(eventData);
      setShowEventForm(false);
      
      if (currentView !== 'calendar') {
        setCurrentView('calendar');
      }
      
      // Mostrar toast de sucesso
      toast.success('Evento criado com sucesso!', {
        title: 'Sucesso! 📅'
      });
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      toast.error('Erro ao criar evento. Tente novamente.', {
        title: 'Ops! 😔'
      });
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'habits':
        return <Habits key={habitsKey} onAddClick={handleAddClick} />;
      case 'calendar':
        return <Calendar />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="App b612-main-container">
      <Layout
        title={getPageTitle()}
        subtitle={getPageSubtitle()}
        currentView={currentView}
        onViewChange={setCurrentView}
        onAddClick={handleAddClick}
      >
        {renderCurrentView()}
      </Layout>

      {showHabitForm && (
        <HabitForm
          onSave={handleSaveHabit}
          onClose={() => setShowHabitForm(false)}
        />
      )}

      {showEventForm && (
        <EventForm
          onSave={handleSaveEvent}
          onClose={() => setShowEventForm(false)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <ModalProvider>
      <ToastProvider maxToasts={5}>
        <AppContent />
      </ToastProvider>
    </ModalProvider>
  );
}

export default App;
