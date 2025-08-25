import { CheckCircle2, Circle, Flame, Edit, Trash2 } from 'lucide-react';
import { habitService } from '../../db';
import { useState } from 'react';

const HabitCard = ({ habit, onUpdate, onEdit, onDelete }) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const isCompletedToday = () => {
    if (!habit.lastCompleted) return false;
    const today = new Date().toISOString().split('T')[0];
    const lastDate = new Date(habit.lastCompleted).toISOString().split('T')[0];
    return today === lastDate;
  };

  const handleComplete = async () => {
    if (isCompletedToday()) return;
    
    setIsCompleting(true);
    try {
      const result = await habitService.completeHabit(habit.id);
      if (result.success) {
        onUpdate();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Erro ao completar hábito:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const getFrequencyText = (frequency, customDays) => {
    const frequencies = {
      daily: 'Diário',
      weekly: 'Semanal',
      custom: 'Personalizado'
    };
    
    if (frequency === 'custom' && customDays && customDays.length > 0) {
      const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      const selectedDays = customDays.map(day => dayNames[day]).join(', ');
      return `${selectedDays}`;
    }
    
    return frequencies[frequency] || frequency;
  };

  const completed = isCompletedToday();

  return (
    <div className={`habit-card relative ${completed ? 'ring-2 ring-green-300' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={handleComplete}
            disabled={isCompleting || completed}
            className={`transition-all duration-300 ${
              completed
                ? 'text-green-600 scale-110'
                : 'text-gray-400 hover:text-green-500 hover:scale-105'
            } ${isCompleting ? 'animate-pulse' : ''}`}
          >
            {completed ? <CheckCircle2 size={28} /> : <Circle size={28} />}
          </button>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{habit.icon || '✨'}</span>
              <h3 className={`font-handwritten text-lg ${
                completed ? 'text-green-800 line-through' : 'text-gray-800'
              }`}>
                {habit.title}
              </h3>
            </div>
            
            {habit.description && (
              <p className="text-sm text-gray-600 font-handwritten mb-2">
                {habit.description}
              </p>
            )}
            
            <div className="flex items-center justify-between text-xs">
              <span className="bg-pastel-blue text-blue-800 px-2 py-1 rounded-full font-handwritten">
                {getFrequencyText(habit.frequency, habit.customDays)}
              </span>
              
              {habit.streak > 0 && (
                <div className="flex items-center gap-1 text-orange-600">
                  <Flame size={14} />
                  <span className="font-handwritten font-semibold">
                    {habit.streak} dia{habit.streak !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-1 rounded-full hover:bg-white/50 transition-colors"
          >
            <div className="w-1 h-1 bg-gray-400 rounded-full mb-1"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full mb-1"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </button>
          
          {showActions && (
            <div className="absolute top-8 right-0 bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-2 z-10 animate-slide-up">
              <button
                onClick={() => {
                  onEdit(habit);
                  setShowActions(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-left font-handwritten text-blue-700 hover:bg-pastel-blue rounded-lg transition-colors"
              >
                <Edit size={14} />
                Editar
              </button>
              <button
                onClick={() => {
                  onDelete(habit.id);
                  setShowActions(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-left font-handwritten text-red-600 hover:bg-red-100 rounded-lg transition-colors"
              >
                <Trash2 size={14} />
                Excluir
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HabitCard;