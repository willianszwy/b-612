import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, CheckCircle2, Target, Flame } from 'lucide-react';
import { habitService, eventService } from '../db';
import { format, isToday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Dashboard = () => {
  const [stats, setStats] = useState({
    todayHabits: { completed: 0, total: 0 },
    weekStreak: 0,
    todayEvents: [],
    totalHabits: 0
  });

  const [todayHabits, setTodayHabits] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const habits = await habitService.getHabits();
      const today = new Date().toISOString().split('T')[0];
      const todayStart = new Date(today).toISOString();
      const todayEnd = new Date(today + 'T23:59:59').toISOString();
      
      const events = await eventService.getEvents(todayStart, todayEnd);

      const habitsActiveToday = habits.filter(habit => {
        return habitService.isHabitActiveToday(habit, new Date());
      });

      const completedToday = habitsActiveToday.filter(habit => {
        if (!habit.lastCompleted) return false;
        const lastDate = new Date(habit.lastCompleted).toISOString().split('T')[0];
        return lastDate === today;
      });

      const averageStreak = habits.length > 0 
        ? Math.round(habits.reduce((sum, habit) => sum + (habit.streak || 0), 0) / habits.length)
        : 0;

      setStats({
        todayHabits: { completed: completedToday.length, total: habitsActiveToday.length },
        weekStreak: averageStreak,
        todayEvents: events.filter(event => isToday(parseISO(event.date))),
        totalHabits: habits.length
      });

      setTodayHabits(habitsActiveToday);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    }
  };

  const getMotivationalMessage = () => {
    const { completed, total } = stats.todayHabits;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    if (percentage === 100) return "🎉 Parabéns! Você completou todos os hábitos hoje!";
    if (percentage >= 75) return "🌟 Quase lá! Você está indo muito bem!";
    if (percentage >= 50) return "💪 Continue assim! Você está no caminho certo!";
    if (percentage >= 25) return "🌱 Todo progresso conta! Continue tentando!";
    return "✨ Um novo dia, novas oportunidades! Vamos começar?";
  };

  const completionPercentage = stats.todayHabits.total > 0 
    ? Math.round((stats.todayHabits.completed / stats.todayHabits.total) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Mensagem Motivacional */}
      <div className="habit-card text-center">
        <div className="text-4xl mb-3">
          {completionPercentage === 100 ? '🎉' : 
           completionPercentage >= 75 ? '🌟' :
           completionPercentage >= 50 ? '💪' :
           completionPercentage >= 25 ? '🌱' : '✨'}
        </div>
        <p className="font-handwritten text-lg text-purple-800 mb-2">
          {getMotivationalMessage()}
        </p>
        <div className="text-sm font-handwritten text-gray-600">
          {format(new Date(), 'EEEE, dd MMMM yyyy', { locale: ptBR })}
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="habit-card text-center">
          <div className="flex items-center justify-center mb-2">
            <CheckCircle2 className="text-green-600 mr-2" size={24} />
            <span className="text-2xl font-handwritten font-bold text-green-800">
              {stats.todayHabits.completed}
            </span>
            <span className="text-gray-500 font-handwritten">/{stats.todayHabits.total}</span>
          </div>
          <p className="font-handwritten text-gray-700 text-sm">Hábitos Hoje</p>
          
          {stats.todayHabits.total > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          )}
        </div>

        <div className="habit-card text-center">
          <div className="flex items-center justify-center mb-2">
            <Flame className="text-orange-600 mr-2" size={24} />
            <span className="text-2xl font-handwritten font-bold text-orange-800">
              {stats.weekStreak}
            </span>
          </div>
          <p className="font-handwritten text-gray-700 text-sm">Sequência Média</p>
        </div>
      </div>

      {/* Progresso Visual */}
      {stats.todayHabits.total > 0 && (
        <div className="habit-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-handwritten text-lg text-purple-800">Progresso de Hoje</h3>
            <span className="font-handwritten text-purple-600 font-bold">
              {completionPercentage}%
            </span>
          </div>
          
          <div className="space-y-2">
            {todayHabits.slice(0, 3).map((habit, index) => {
              const isCompleted = habit.lastCompleted && 
                new Date(habit.lastCompleted).toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
              
              return (
                <div key={habit.id} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className={`font-handwritten text-sm flex-1 ${isCompleted ? 'text-green-800 line-through' : 'text-gray-700'}`}>
                    {habit.icon} {habit.title}
                  </span>
                  {isCompleted && <CheckCircle2 size={16} className="text-green-500" />}
                </div>
              );
            })}
            
            {todayHabits.length > 3 && (
              <div className="text-xs font-handwritten text-gray-500 text-center pt-2">
                +{todayHabits.length - 3} mais hábitos
              </div>
            )}
          </div>
        </div>
      )}

      {/* Eventos de Hoje */}
      {stats.todayEvents.length > 0 && (
        <div className="habit-card">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="text-blue-600" size={20} />
            <h3 className="font-handwritten text-lg text-blue-800">Agenda de Hoje</h3>
          </div>
          
          <div className="space-y-2">
            {stats.todayEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-3 p-2 bg-white/50 rounded-xl">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <span className="font-handwritten text-sm text-gray-800">{event.title}</span>
                  <div className="text-xs font-handwritten text-gray-600">
                    {event.startTime}
                    {event.endTime && ` - ${event.endTime}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mensagem de Encorajamento */}
      <div className="habit-card text-center bg-gradient-to-br from-pastel-purple to-pastel-mint">
        <div className="text-2xl mb-2">🌟</div>
        <p className="font-handwritten text-purple-800 text-sm">
          "Pequenos passos todos os dias levam a grandes mudanças!"
        </p>
      </div>
    </div>
  );
};

export default Dashboard;