import { useState } from 'react';
import { Home, Plus } from 'lucide-react';
import AsteroidIcon from '../Icons/AsteroidIcon';
import HabitsIcon from '../Icons/HabitsIcon';
import CalendarIcon from '../Icons/CalendarIcon';
import SettingsIcon from '../Icons/SettingsIcon';

const Navigation = ({ currentView, onViewChange, onAddClick }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', icon: AsteroidIcon, label: 'B-612' },
    { id: 'habits', icon: HabitsIcon, label: 'Hábitos' },
    { id: 'calendar', icon: CalendarIcon, label: 'Agenda' },
    { id: 'settings', icon: SettingsIcon, label: 'Config' },
  ];

  const handleAddClick = (type) => {
    onAddClick(type);
    setIsAddOpen(false);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-white/50 p-4 z-50">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`flex flex-col items-center p-2 rounded-2xl transition-all duration-300 ${
              currentView === item.id
                ? 'bg-pastel-purple text-purple-800 shadow-lg'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <item.icon size={20} />
            <span className="text-xs font-handwritten mt-1">{item.label}</span>
          </button>
        ))}
        
        <div className="relative">
          <button
            onClick={() => setIsAddOpen(!isAddOpen)}
            className="bg-pastel-salmon text-orange-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Plus size={24} />
          </button>
          
          {isAddOpen && (
            <div className="absolute bottom-16 right-0 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-2 animate-slide-up">
              <button
                onClick={() => handleAddClick('habit')}
                className="block w-full text-left px-4 py-3 font-handwritten text-purple-800 hover:bg-pastel-purple rounded-xl transition-colors"
              >
                ✨ Novo Hábito
              </button>
              <button
                onClick={() => handleAddClick('event')}
                className="block w-full text-left px-4 py-3 font-handwritten text-blue-800 hover:bg-pastel-blue rounded-xl transition-colors"
              >
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 492 492" className="inline-block">
                    <path fill="#e1ce7a" d="M486,437.6c0,28-24,54.4-52,54.4H58c-28,0-52-26.4-52-54.4V84.8C6,56.8,30,36,58,36h376 c28,0,52,20.8,52,48.8V437.6z"/>
                    <path fill="#e1b660" d="M7.6,85.6C7.6,57.6,30,36,58,36h376c28,0,52,20.8,52,48.8v352.8c0,28-24,54.4-52,54.4"/>
                    <path fill="#00233F" d="M434,36H58C30,36,6,56.8,6,84.8V132h480V84.8C486,56.8,462,36,434,36z"/>
                    <path fill="#104C75" d="M486,132V84.8c0-28-24-48.8-52-48.8H62"/>
                    <circle fill="#024651" cx="90" cy="210.4" r="12.8"/>
                    <circle fill="#024651" cx="168.4" cy="210.4" r="12.8"/>
                    <circle fill="#024651" cx="246" cy="210.4" r="12.8"/>
                    <circle fill="#024651" cx="323.6" cy="210.4" r="12.8"/>
                    <path fill="#e1ce7a" d="M142,46.4c0,9.6-6.4,16.8-16,16.8l0,0c-9.6,0-16-8-16-16.8V16.8C110,7.2,116.4,0,126,0l0,0 c9.6,0,16,8,16,16.8V46.4z"/>
                    <path fill="#e1ce7a" d="M382,46.4c0,9.6-6.4,16.8-16,16.8l0,0c-9.6,0-16-8-16-16.8V16.8C350,7.2,356.4,0,366,0l0,0 c9.6,0,16,8,16,16.8V46.4z"/>
                  </svg>
                  Novo Evento
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;