import { Clock, Edit, Trash2, Bell } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import Portal from '../Portal';

const EventCard = ({ event, onEdit, onDelete }) => {
  const [showActions, setShowActions] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setShowActions(false);
      }
    };

    const updatePosition = () => {
      if (buttonRef.current && showActions) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + 8,
          left: rect.right - 120
        });
      }
    };

    if (showActions) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [showActions]);

  const handleToggleActions = () => {
    if (!showActions && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.right - 120 // 120px é a largura aproximada do dropdown
      });
    }
    setShowActions(!showActions);
  };

  const getCategoryColor = (category) => {
    const colors = {
      selfcare: 'bg-pastel-pink text-pink-800',
      work: 'bg-pastel-blue text-blue-800',
      home: 'bg-pastel-mint text-green-800',
      appointments: 'bg-pastel-salmon text-red-800',
      people: 'bg-pastel-yellow text-yellow-800',
      leisure: 'bg-pastel-purple text-purple-800',
      other: 'bg-gray-300 text-gray-800'
    };
    return colors[category] || colors.other;
  };

  const getCategoryLabel = (category) => {
    const labels = {
      selfcare: 'Autocuidado',
      work: 'Trabalho',
      home: 'Casa',
      appointments: 'Compromissos',
      people: 'Pessoas Importantes',
      leisure: 'Lazer',
      other: 'Outros'
    };
    return labels[category] || 'Outros';
  };

  return (
    <>
      <div className="habit-card relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-handwritten text-lg text-gray-800">
                {event.title}
              </h3>
              {event.hasNotification && (
                <Bell size={16} className="text-yellow-600" />
              )}
            </div>
            
            {event.description && (
              <p className="text-sm text-gray-600 font-handwritten mb-2">
                {event.description}
              </p>
            )}
            
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1 text-gray-600">
                <Clock size={14} />
                <span className="font-handwritten">
                  {event.startTime}
                  {event.endTime && ` - ${event.endTime}`}
                </span>
              </div>
              
              <span className={`px-2 py-1 rounded-full text-xs font-handwritten ${getCategoryColor(event.category)}`}>
                {getCategoryLabel(event.category)}
              </span>
            </div>
          </div>
          
          <div className="relative ml-3">
            <button
              ref={buttonRef}
              onClick={handleToggleActions}
              className="p-1 rounded-full hover:bg-white/50 transition-colors"
            >
              <div className="w-1 h-1 bg-gray-400 rounded-full mb-1"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full mb-1"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </button>
          </div>
        </div>
      </div>
      
      {showActions && (
        <Portal>
          <div 
            className="fixed bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-2 z-[100] min-w-[120px]"
            style={{ 
              top: `${dropdownPosition.top}px`, 
              left: `${dropdownPosition.left}px`
            }}
          >
            <button
              onClick={() => {
                onEdit(event);
                setShowActions(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-left font-handwritten text-blue-700 hover:bg-pastel-blue rounded-lg transition-colors"
            >
              <Edit size={14} />
              Editar
            </button>
            <button
              onClick={() => {
                onDelete(event.id);
                setShowActions(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-left font-handwritten text-red-600 hover:bg-red-100 rounded-lg transition-colors"
            >
              <Trash2 size={14} />
              Excluir
            </button>
          </div>
        </Portal>
      )}
    </>
  );
};

export default EventCard;