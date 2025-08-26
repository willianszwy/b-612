import { useState, useEffect } from 'react';
import { X, Bell } from 'lucide-react';
import { useModal } from '../../design-system';

const HabitForm = ({ habit, onSave, onClose }) => {
  const modal = useModal();
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);
  
  const [formData, setFormData] = useState({
    title: habit?.title || '',
    description: habit?.description || '',
    icon: habit?.icon || '✨',
    frequency: habit?.frequency || 'daily',
    customDays: habit?.customDays || [],
    hasNotification: habit?.hasNotification || false,
    notificationTime: habit?.notificationTime || '09:00'
  });

  const [showNotificationOptions, setShowNotificationOptions] = useState(false);

  const icons = ['✨', '💪', '📚', '🏃‍♂️', '🧘‍♀️', '💧', '🥗', '😴', '🎯', '💼', '🎨', '🎵'];
  
  const frequencies = [
    { value: 'daily', label: 'Diário' },
    { value: 'weekly', label: 'Semanal' },
    { value: 'custom', label: 'Personalizado' }
  ];

  const weekDays = [
    { value: 0, label: 'Dom', short: 'D' },
    { value: 1, label: 'Seg', short: 'S' },
    { value: 2, label: 'Ter', short: 'T' },
    { value: 3, label: 'Qua', short: 'Q' },
    { value: 4, label: 'Qui', short: 'Q' },
    { value: 5, label: 'Sex', short: 'S' },
    { value: 6, label: 'Sáb', short: 'S' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    // Validar frequência personalizada
    if (formData.frequency === 'custom' && formData.customDays.length === 0) {
      await modal.alert(
        'Por favor, selecione pelo menos um dia da semana para frequência personalizada.',
        {
          title: 'Frequência personalizada',
          variant: 'warning',
          icon: '⚠️'
        }
      );
      return;
    }

    const habitData = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      customDays: formData.frequency === 'custom' ? formData.customDays : []
    };

    await onSave(habitData);
  };

  const handleFrequencyChange = (frequency) => {
    setFormData(prev => ({
      ...prev,
      frequency,
      customDays: frequency === 'custom' ? prev.customDays : []
    }));
  };

  const toggleCustomDay = (dayValue) => {
    setFormData(prev => ({
      ...prev,
      customDays: prev.customDays.includes(dayValue)
        ? prev.customDays.filter(day => day !== dayValue)
        : [...prev.customDays, dayValue].sort((a, b) => a - b)
    }));
  };

  const handleNotificationToggle = () => {
    if (!formData.hasNotification) {
      setShowNotificationOptions(true);
    }
    setFormData(prev => ({
      ...prev,
      hasNotification: !prev.hasNotification
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-[60] overflow-y-auto modal-overlay">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 w-full max-w-md animate-slide-up my-auto min-h-0 max-h-[90vh] overflow-y-auto modal-content">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-cute text-purple-800">
            {habit ? 'Editar Hábito' : 'Novo Hábito'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-handwritten text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="input-field w-full"
              placeholder="Ex: Beber água, Exercitar-se..."
              required
            />
          </div>

          <div>
            <label className="block font-handwritten text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="input-field w-full h-20 resize-none"
              placeholder="Descreva seu hábito..."
            />
          </div>

          <div>
            <label className="block font-handwritten text-gray-700 mb-2">
              Ícone
            </label>
            <div className="grid grid-cols-6 gap-2">
              {icons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, icon }))}
                  className={`p-3 text-xl rounded-2xl transition-all ${
                    formData.icon === icon
                      ? 'bg-pastel-purple shadow-lg scale-110'
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-handwritten text-gray-700 mb-2">
              Frequência
            </label>
            <select
              value={formData.frequency}
              onChange={(e) => handleFrequencyChange(e.target.value)}
              className="input-field w-full"
            >
              {frequencies.map((freq) => (
                <option key={freq.value} value={freq.value}>
                  {freq.label}
                </option>
              ))}
            </select>
            
            {formData.frequency === 'custom' && (
              <div className="mt-3 animate-slide-up">
                <label className="block font-handwritten text-gray-700 mb-2">
                  Selecione os dias da semana
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => toggleCustomDay(day.value)}
                      className={`p-3 rounded-2xl font-handwritten text-sm transition-all ${
                        formData.customDays.includes(day.value)
                          ? 'bg-pastel-purple text-purple-800 shadow-lg scale-105'
                          : 'bg-white/50 hover:bg-white/70 text-gray-700'
                      }`}
                    >
                      <div className="text-xs">{day.short}</div>
                      <div className="text-xs font-bold">{day.label}</div>
                    </button>
                  ))}
                </div>
                
                {formData.customDays.length === 0 && (
                  <p className="text-xs font-handwritten text-red-600 mt-2">
                    ⚠️ Selecione pelo menos um dia da semana
                  </p>
                )}
                
                <div className="mt-2 text-xs font-handwritten text-gray-600">
                  {formData.customDays.length > 0 && (
                    <span>
                      Dias selecionados: {formData.customDays.map(day => 
                        weekDays.find(w => w.value === day)?.label
                      ).join(', ')}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="font-handwritten text-gray-700">
                Deseja cadastrar uma notificação?
              </span>
              <button
                type="button"
                onClick={handleNotificationToggle}
                className={`p-2 rounded-full transition-all ${
                  formData.hasNotification
                    ? 'bg-pastel-yellow text-yellow-800'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                <Bell size={20} />
              </button>
            </div>

            {(formData.hasNotification || showNotificationOptions) && (
              <div className="mt-3 animate-slide-up">
                <label className="block font-handwritten text-gray-700 mb-2">
                  Horário da notificação
                </label>
                <input
                  type="time"
                  value={formData.notificationTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, notificationTime: e.target.value }))}
                  className="input-field"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 font-handwritten font-semibold py-3 px-6 rounded-2xl transition-all duration-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
            >
              {habit ? 'Salvar' : 'Criar Hábito'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HabitForm;