import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, List, Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import EventCard from '../components/Calendar/EventCard';
import EventForm from '../components/Calendar/EventForm';
import { eventService } from '../db';
import { useModal, useToast } from '../design-system';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [view, setView] = useState('calendar'); // 'calendar' or 'list'
  const [loading, setLoading] = useState(true);
  const modal = useModal();
  const toast = useToast();

  useEffect(() => {
    loadEvents();
  }, [currentDate]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      const data = await eventService.getEvents(start.toISOString(), end.toISOString());
      setEvents(data);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEvent = async (eventData) => {
    try {
      if (editingEvent) {
        await eventService.updateEvent(editingEvent.id, eventData);
      } else {
        await eventService.createEvent(eventData);
      }
      await loadEvents();
      setShowForm(false);
      setEditingEvent(null);
      toast.success('Evento salvo com sucesso!', {
        title: 'Sucesso! 📅'
      });
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
      toast.error('Erro ao salvar evento. Tente novamente.', {
        title: 'Ops! 😔'
      });
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDeleteEvent = async (eventId) => {
    const confirmed = await modal.confirm(
      'Tem certeza que deseja excluir este evento?',
      {
        title: 'Excluir Evento',
        variant: 'error',
        confirmText: 'Sim, excluir',
        cancelText: 'Cancelar',
        icon: '🗑️'
      }
    );

    if (confirmed) {
      try {
        await eventService.deleteEvent(eventId);
        await loadEvents();
        toast.success('Evento excluído com sucesso', {
          title: 'Excluído! 🗑️'
        });
      } catch (error) {
        console.error('Erro ao deletar evento:', error);
        toast.error('Erro ao deletar evento. Tente novamente.', {
          title: 'Ops! 😔'
        });
      }
    }
  };

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = parseISO(event.date);
      return isSameDay(eventDate, date);
    });
  };

  const renderCalendarView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    return (
      <div className="space-y-4">
        {/* Cabeçalho do calendário */}
        <div className="flex items-center justify-between bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50">
          <button
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
          >
            <ChevronLeft size={20} className="text-purple-800" />
          </button>
          
          <h2 className="font-cute text-xl text-purple-800">
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </h2>
          
          <button
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
          >
            <ChevronRight size={20} className="text-purple-800" />
          </button>
        </div>

        {/* Grade do calendário */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50">
          {/* Dias da semana */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
              <div key={day} className="text-center text-xs font-handwritten text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Dias do mês */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const dayEvents = getEventsForDate(day);
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isDayToday = isToday(day);

              return (
                <button
                  key={day.toString()}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    relative p-2 min-h-[40px] rounded-lg transition-all font-handwritten text-sm
                    ${isSelected ? 'bg-pastel-purple shadow-md' : 'hover:bg-white/50'}
                    ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-800'}
                    ${isDayToday ? 'ring-2 ring-pastel-salmon font-bold' : ''}
                  `}
                >
                  <div className="flex flex-col items-center">
                    <span>{format(day, 'd')}</span>
                    {dayEvents.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {dayEvents.slice(0, 2).map((event, idx) => (
                          <div
                            key={idx}
                            className="w-2 h-2 bg-pastel-blue rounded-full"
                          />
                        ))}
                        {dayEvents.length > 2 && (
                          <span className="text-xs text-purple-600">+{dayEvents.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Eventos do dia selecionado */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-handwritten text-lg text-purple-800">
              Eventos de {format(selectedDate, 'dd/MM', { locale: ptBR })}
            </h3>
            {isToday(selectedDate) && (
              <span className="bg-pastel-salmon text-orange-800 px-2 py-1 rounded-full text-xs font-handwritten">
                Hoje
              </span>
            )}
          </div>

          {getEventsForDate(selectedDate).length > 0 ? (
            <div className="space-y-3">
              {getEventsForDate(selectedDate).map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mb-2">
                <svg width="48" height="48" viewBox="0 0 492 492" className="mx-auto">
                  <path fill="#e1ce7a" d="M486,437.6c0,28-24,54.4-52,54.4H58c-28,0-52-26.4-52-54.4V84.8C6,56.8,30,36,58,36h376 c28,0,52,20.8,52,48.8V437.6z"/>
                  <path fill="#e1b660" d="M7.6,85.6C7.6,57.6,30,36,58,36h376c28,0,52,20.8,52,48.8v352.8c0,28-24,54.4-52,54.4"/>
                  <path fill="#00233F" d="M434,36H58C30,36,6,56.8,6,84.8V132h480V84.8C486,56.8,462,36,434,36z"/>
                  <path fill="#104C75" d="M486,132V84.8c0-28-24-48.8-52-48.8H62"/>
                  <circle fill="#024651" cx="90" cy="210.4" r="12.8"/>
                  <circle fill="#024651" cx="168.4" cy="210.4" r="12.8"/>
                  <circle fill="#024651" cx="246" cy="210.4" r="12.8"/>
                  <circle fill="#024651" cx="323.6" cy="210.4" r="12.8"/>
                  <circle fill="#024651" cx="90" cy="277.6" r="12.8"/>
                  <circle fill="#024651" cx="168.4" cy="277.6" r="12.8"/>
                  <circle fill="#024651" cx="246" cy="277.6" r="12.8"/>
                  <circle fill="#024651" cx="323.6" cy="277.6" r="12.8"/>
                  <circle fill="#024651" cx="402" cy="277.6" r="12.8"/>
                  <circle fill="#024651" cx="90" cy="344.8" r="12.8"/>
                  <circle fill="#024651" cx="168.4" cy="344.8" r="12.8"/>
                  <circle fill="#024651" cx="246" cy="344.8" r="12.8"/>
                  <circle fill="#024651" cx="323.6" cy="344.8" r="12.8"/>
                  <circle fill="#024651" cx="402" cy="344.8" r="12.8"/>
                  <circle fill="#024651" cx="90" cy="412" r="12.8"/>
                  <circle fill="#024651" cx="168.4" cy="412" r="12.8"/>
                  <circle fill="#024651" cx="246" cy="412" r="12.8"/>
                  <circle fill="#024651" cx="323.6" cy="412" r="12.8"/>
                  <circle fill="#024651" cx="402" cy="412" r="12.8"/>
                  <path fill="#e1ce7a" d="M142,46.4c0,9.6-6.4,16.8-16,16.8l0,0c-9.6,0-16-8-16-16.8V16.8C110,7.2,116.4,0,126,0l0,0 c9.6,0,16,8,16,16.8V46.4z"/>
                  <path fill="#e1b660" d="M126.8,0L126.8,0c9.6,0,15.2,8,15.2,16.8v29.6c0,9.6-6.4,16.8-16,16.8l0,0"/>
                  <path fill="#e1ce7a" d="M382,46.4c0,9.6-6.4,16.8-16,16.8l0,0c-9.6,0-16-8-16-16.8V16.8C350,7.2,356.4,0,366,0l0,0 c9.6,0,16,8,16,16.8V46.4z"/>
                  <path fill="#e1b660" d="M364.4,0L364.4,0C374,0,382,8,382,16.8v29.6c0,9.6-8,16.8-17.6,16.8l0,0"/>
                </svg>
              </div>
              <p className="font-handwritten text-gray-600">
                Nenhum evento neste dia
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderListView = () => {
    const sortedEvents = events
      .sort((a, b) => new Date(a.date + 'T' + a.startTime) - new Date(b.date + 'T' + b.startTime));

    return (
      <div className="space-y-4">
        {sortedEvents.length > 0 ? (
          <div className="space-y-3">
            {sortedEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg width="72" height="72" viewBox="0 0 492 492" className="mx-auto">
                <path fill="#e1ce7a" d="M486,437.6c0,28-24,54.4-52,54.4H58c-28,0-52-26.4-52-54.4V84.8C6,56.8,30,36,58,36h376 c28,0,52,20.8,52,48.8V437.6z"/>
                <path fill="#e1b660" d="M7.6,85.6C7.6,57.6,30,36,58,36h376c28,0,52,20.8,52,48.8v352.8c0,28-24,54.4-52,54.4"/>
                <path fill="#00233F" d="M434,36H58C30,36,6,56.8,6,84.8V132h480V84.8C486,56.8,462,36,434,36z"/>
                <path fill="#104C75" d="M486,132V84.8c0-28-24-48.8-52-48.8H62"/>
                <circle fill="#024651" cx="90" cy="210.4" r="12.8"/>
                <circle fill="#024651" cx="168.4" cy="210.4" r="12.8"/>
                <circle fill="#024651" cx="246" cy="210.4" r="12.8"/>
                <circle fill="#024651" cx="323.6" cy="210.4" r="12.8"/>
                <circle fill="#024651" cx="90" cy="277.6" r="12.8"/>
                <circle fill="#024651" cx="168.4" cy="277.6" r="12.8"/>
                <circle fill="#024651" cx="246" cy="277.6" r="12.8"/>
                <circle fill="#024651" cx="323.6" cy="277.6" r="12.8"/>
                <circle fill="#024651" cx="402" cy="277.6" r="12.8"/>
                <circle fill="#024651" cx="90" cy="344.8" r="12.8"/>
                <circle fill="#024651" cx="168.4" cy="344.8" r="12.8"/>
                <circle fill="#024651" cx="246" cy="344.8" r="12.8"/>
                <circle fill="#024651" cx="323.6" cy="344.8" r="12.8"/>
                <circle fill="#024651" cx="402" cy="344.8" r="12.8"/>
                <circle fill="#024651" cx="90" cy="412" r="12.8"/>
                <circle fill="#024651" cx="168.4" cy="412" r="12.8"/>
                <circle fill="#024651" cx="246" cy="412" r="12.8"/>
                <circle fill="#024651" cx="323.6" cy="412" r="12.8"/>
                <circle fill="#024651" cx="402" cy="412" r="12.8"/>
                <path fill="#e1ce7a" d="M142,46.4c0,9.6-6.4,16.8-16,16.8l0,0c-9.6,0-16-8-16-16.8V16.8C110,7.2,116.4,0,126,0l0,0 c9.6,0,16,8,16,16.8V46.4z"/>
                <path fill="#e1b660" d="M126.8,0L126.8,0c9.6,0,15.2,8,15.2,16.8v29.6c0,9.6-6.4,16.8-16,16.8l0,0"/>
                <path fill="#e1ce7a" d="M382,46.4c0,9.6-6.4,16.8-16,16.8l0,0c-9.6,0-16-8-16-16.8V16.8C350,7.2,356.4,0,366,0l0,0 c9.6,0,16,8,16,16.8V46.4z"/>
                <path fill="#e1b660" d="M364.4,0L364.4,0C374,0,382,8,382,16.8v29.6c0,9.6-8,16.8-17.6,16.8l0,0"/>
              </svg>
            </div>
            <h3 className="font-cute text-xl text-purple-800 mb-2">
              Sua agenda está vazia!
            </h3>
            <p className="font-handwritten text-gray-600 mb-6">
              Crie seu primeiro evento e organize sua rotina.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Criar Primeiro Evento
            </button>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-pastel-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-handwritten text-gray-600">Carregando agenda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controles de visualização */}
      <div className="flex items-center justify-between">
        <div className="flex bg-white/50 rounded-2xl p-1 shadow-lg">
          <button
            onClick={() => setView('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-handwritten transition-all ${
              view === 'calendar'
                ? 'bg-white shadow-md text-purple-800'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <CalendarIcon size={16} />
            Calendário
          </button>
          <button
            onClick={() => setView('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-handwritten transition-all ${
              view === 'list'
                ? 'bg-white shadow-md text-purple-800'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <List size={16} />
            Lista
          </button>
        </div>

      </div>

      {/* Conteúdo */}
      {view === 'calendar' ? renderCalendarView() : renderListView()}

      {/* Modal do formulário */}
      {showForm && (
        <EventForm
          event={editingEvent}
          onSave={handleSaveEvent}
          onClose={() => {
            setShowForm(false);
            setEditingEvent(null);
          }}
        />
      )}
    </div>
  );
};

export default Calendar;