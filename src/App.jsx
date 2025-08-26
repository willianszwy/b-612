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
    
    // Inicializar notificações de hábitos após um breve delay
    setTimeout(() => {
      notificationService.initializeAllHabitNotifications();
    }, 1000);
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      const permission = await Notification.requestPermission();
      console.log('Permissão de notificação:', permission);
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
        notificationService.scheduleHabitNotification(newHabit);
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
