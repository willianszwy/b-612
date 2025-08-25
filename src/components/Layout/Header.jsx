import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Header = ({ title, subtitle }) => {
  const today = new Date();
  const greeting = getGreeting();

  function getGreeting() {
    const hour = today.getHours();
    if (hour < 12) return '🌅 Bom dia!';
    if (hour < 18) return '☀️ Boa tarde!';
    return '🌙 Boa noite!';
  }

  return (
    <header className="bg-white/30 backdrop-blur-md p-6 mb-6 rounded-b-2xl shadow-lg">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-cute text-purple-800">{title}</h1>
          <span className="text-sm font-handwritten text-gray-600">
            {format(today, 'dd/MM', { locale: ptBR })}
          </span>
        </div>
        
        {subtitle && (
          <p className="text-gray-700 font-handwritten">{subtitle}</p>
        )}
        
        <div className="mt-3 flex items-center gap-2">
          <span className="font-handwritten text-purple-700">{greeting}</span>
          <div className="text-xs font-handwritten text-gray-500">
            {format(today, 'EEEE', { locale: ptBR })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;