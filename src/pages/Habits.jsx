import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import HabitCard from '../components/Habits/HabitCard';
import PlantIcon from '../components/Icons/PlantIcon';
import { habitService } from '../db';
import { useModal, useToast } from '../design-system';

const Habits = ({ onAddClick }) => {
  const [habits, setHabits] = useState([]);
  const [filteredHabits, setFilteredHabits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingHabit, setEditingHabit] = useState(null);
  const modal = useModal();
  const toast = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHabits();
  }, []);

  useEffect(() => {
    const filtered = habits.filter(habit =>
      habit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (habit.description && habit.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredHabits(filtered);
  }, [habits, searchTerm]);

  const loadHabits = async () => {
    try {
      setLoading(true);
      const data = await habitService.getHabits();
      console.log('Hábitos carregados:', data);
      setHabits(data);
    } catch (error) {
      console.error('Erro ao carregar hábitos:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleEditHabit = (habit) => {
    // TODO: Implementar edição de hábitos
    console.log('Editar hábito:', habit);
  };

  const handleDeleteHabit = async (habitId) => {
    const confirmed = await modal.confirm(
      'Tem certeza que deseja excluir este hábito?',
      {
        title: 'Excluir Hábito',
        variant: 'error',
        confirmText: 'Sim, excluir',
        cancelText: 'Cancelar',
        icon: '🗑️'
      }
    );

    if (confirmed) {
      try {
        await habitService.deleteHabit(habitId);
        await loadHabits();
        toast.success('Hábito excluído com sucesso', {
          title: 'Excluído! 🗑️'
        });
      } catch (error) {
        console.error('Erro ao deletar hábito:', error);
        toast.error('Erro ao deletar hábito. Tente novamente.', {
          title: 'Ops! 😔'
        });
      }
    }
  };

  const handleAddNew = () => {
    if (onAddClick) {
      onAddClick('habit');
    } else {
      setEditingHabit(null);
      setShowForm(true);
    }
  };

  const getStats = () => {
    if (habits.length === 0) return { active: 0, completed: 0, streak: 0 };
    
    const today = new Date().toISOString().split('T')[0];
    const completedToday = habits.filter(habit => {
      if (!habit.lastCompleted) return false;
      const lastDate = new Date(habit.lastCompleted).toISOString().split('T')[0];
      return lastDate === today;
    });

    const totalStreak = habits.reduce((sum, habit) => sum + (habit.streak || 0), 0);
    
    return {
      active: habits.length,
      completed: completedToday.length,
      streak: Math.round(totalStreak / habits.length)
    };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-pastel-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-handwritten text-gray-600">Carregando hábitos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg border border-white/50">
          <div className="text-2xl font-handwritten font-bold text-purple-800">{stats.active}</div>
          <div className="text-xs font-handwritten text-gray-600">Ativos</div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg border border-white/50">
          <div className="text-2xl font-handwritten font-bold text-green-800">{stats.completed}</div>
          <div className="text-xs font-handwritten text-gray-600">Hoje</div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg border border-white/50">
          <div className="text-2xl font-handwritten font-bold text-orange-800">{stats.streak}</div>
          <div className="text-xs font-handwritten text-gray-600">Sequência</div>
        </div>
      </div>

      {/* Barra de pesquisa */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Buscar hábitos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/70 rounded-2xl font-handwritten text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:border-transparent"
        />
      </div>

      {/* Lista de hábitos */}
      {filteredHabits.length > 0 ? (
        <div className="space-y-4">
          {filteredHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onUpdate={loadHabits}
              onEdit={handleEditHabit}
              onDelete={handleDeleteHabit}
            />
          ))}
        </div>
      ) : habits.length === 0 ? (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <PlantIcon size={96} />
          </div>
          <h3 className="font-cute text-xl text-purple-800 mb-2">
            Comece sua jornada!
          </h3>
          <p className="font-handwritten text-gray-600 mb-6">
            Crie seu primeiro hábito e dê o primeiro passo para uma vida mais organizada.
          </p>
          <button
            onClick={handleAddNew}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Criar Primeiro Hábito
          </button>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🔍</div>
          <p className="font-handwritten text-gray-600">
            Nenhum hábito encontrado com "{searchTerm}"
          </p>
        </div>
      )}

      {/* Botão flutuante para adicionar */}
      {habits.length > 0 && (
        <button
          onClick={handleAddNew}
          className="fixed bottom-24 right-4 bg-pastel-purple text-purple-800 p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 z-40"
        >
          <Plus size={24} />
        </button>
      )}

    </div>
  );
};

export default Habits;