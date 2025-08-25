import { useState } from 'react';
import { X, Bell } from 'lucide-react';

const EventForm = ({ event, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    date: event?.date || new Date().toISOString().split('T')[0],
    startTime: event?.startTime || '09:00',
    endTime: event?.endTime || '',
    category: event?.category || 'selfcare',
    frequency: event?.frequency || 'once',
    customDays: event?.customDays || [],
    hasNotification: event?.hasNotification || false,
    notificationTime: event?.notificationTime || '09:00'
  });

  const [showNotificationOptions, setShowNotificationOptions] = useState(false);

  const frequencies = [
    { value: 'once', label: 'Uma vez' },
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

  const categories = [
    { value: 'selfcare', label: 'Autocuidado', color: 'pastel-pink' },
    { value: 'work', label: 'Trabalho', color: 'pastel-blue' },
    { value: 'home', label: 'Casa', color: 'pastel-mint' },
    { value: 'appointments', label: 'Compromissos', color: 'pastel-salmon' },
    { value: 'people', label: 'Pessoas Importantes', color: 'pastel-yellow' },
    { value: 'leisure', label: 'Lazer', color: 'pastel-purple' },
    { value: 'other', label: 'Outros', color: 'gray-300' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    // Validar frequência personalizada
    if (formData.frequency === 'custom' && formData.customDays.length === 0) {
      alert('Por favor, selecione pelo menos um dia da semana para frequência personalizada.');
      return;
    }

    const eventData = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      customDays: formData.frequency === 'custom' ? formData.customDays : []
    };

    await onSave(eventData);
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-cute text-purple-800">
            {event ? 'Editar Evento' : 'Novo Evento'}
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
              placeholder="Ex: Reunião, Consulta médica..."
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
              placeholder="Detalhes do evento..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-handwritten text-gray-700 mb-2">
                Data *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="input-field w-full"
                required
              />
            </div>
            <div>
              <label className="block font-handwritten text-gray-700 mb-2">
                Início *
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                className="input-field w-full"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-handwritten text-gray-700 mb-2">
              Término (opcional)
            </label>
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
              className="input-field w-full"
            />
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
                          ? 'bg-pastel-blue text-blue-800 shadow-lg scale-105'
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

          <div>
            <label className="block font-handwritten text-gray-700 mb-2">
              Categoria
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                  className={`p-3 rounded-2xl font-handwritten transition-all ${
                    formData.category === cat.value
                      ? `bg-${cat.color} shadow-lg scale-105`
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
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
                  Qual dia e horário?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value="same-day"
                    className="input-field"
                  >
                    <option value="same-day">No mesmo dia</option>
                    <option value="day-before">1 dia antes</option>
                    <option value="hour-before">1 hora antes</option>
                  </select>
                  <input
                    type="time"
                    value={formData.notificationTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, notificationTime: e.target.value }))}
                    className="input-field"
                  />
                </div>
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
              {event ? 'Salvar' : 'Criar Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;