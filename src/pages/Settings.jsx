import { useState } from 'react';
import { Bell, Palette, Download, Database } from 'lucide-react';
import BackupSection from '../components/Settings/BackupSection';
import { notificationService } from '../services/notificationService';

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    Notification?.permission === 'granted'
  );

  const handleNotificationToggle = async () => {
    if (!notificationsEnabled) {
      const permission = await notificationService.requestPermission();
      setNotificationsEnabled(permission === 'granted');
      
      if (permission === 'granted') {
        notificationService.testNotification();
      }
    } else {
      alert('Para desativar notificações, use as configurações do seu navegador.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="habit-card text-center">
        <div className="text-4xl mb-4">⚙️</div>
        <h3 className="font-cute text-xl text-purple-800 mb-2">
          Configurações
        </h3>
        <p className="font-handwritten text-gray-600">
          Personalize sua experiência no B-612
        </p>
      </div>

      {/* Notificações */}
      <div className="habit-card">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="text-yellow-600" size={20} />
          <h4 className="font-handwritten text-lg text-purple-800">
            Notificações
          </h4>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-handwritten text-gray-700">
              Permitir notificações
            </span>
            <button
              onClick={handleNotificationToggle}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                notificationsEnabled ? 'bg-green-400' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  notificationsEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          {notificationsEnabled && (
            <div className="p-3 bg-green-50 rounded-xl animate-slide-up">
              <p className="text-sm font-handwritten text-green-800">
                ✅ Você receberá lembretes sobre seus hábitos e eventos!
              </p>
              <button
                onClick={() => notificationService.testNotification()}
                className="mt-2 text-xs font-handwritten text-green-700 underline"
              >
                Testar notificação
              </button>
            </div>
          )}
          
          {!notificationsEnabled && (
            <div className="p-3 bg-yellow-50 rounded-xl">
              <p className="text-sm font-handwritten text-yellow-800">
                💡 Ative as notificações para não perder nenhum hábito!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tema */}
      <div className="habit-card">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="text-pink-600" size={20} />
          <h4 className="font-handwritten text-lg text-purple-800">
            Aparência
          </h4>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-gradient-to-br from-pastel-purple to-pastel-mint rounded-2xl border-2 border-purple-300">
            <div className="text-center">
              <div className="text-sm font-handwritten text-purple-800">Pastel</div>
              <div className="text-xs font-handwritten text-gray-600">Atual</div>
            </div>
          </div>
          <div className="p-3 bg-gray-100 rounded-2xl opacity-50">
            <div className="text-center">
              <div className="text-sm font-handwritten text-gray-600">Escuro</div>
              <div className="text-xs font-handwritten text-gray-500">Em breve</div>
            </div>
          </div>
          <div className="p-3 bg-gray-100 rounded-2xl opacity-50">
            <div className="text-center">
              <div className="text-sm font-handwritten text-gray-600">Claro</div>
              <div className="text-xs font-handwritten text-gray-500">Em breve</div>
            </div>
          </div>
        </div>
      </div>

      {/* Backup e Dados */}
      <BackupSection />
      
      {/* Sobre o App */}
      <div className="habit-card">
        <h4 className="font-handwritten text-lg text-purple-800 mb-3">
          Sobre o B-612
        </h4>
        <div className="space-y-2 font-handwritten text-sm text-gray-600">
          <p>• PWA para gestão de hábitos e agenda pessoal</p>
          <p>• Funciona offline após o primeiro carregamento</p>
          <p>• Dados salvos localmente no seu dispositivo</p>
          <p>• Inspirado no mundo do Pequeno Príncipe</p>
          <p>• Desenvolvido com React + Tailwind CSS</p>
        </div>
        
        <div className="mt-4 p-3 bg-pastel-blue rounded-xl">
          <p className="text-xs font-handwritten text-blue-800 text-center">
            💝 Feito com carinho para ajudar você a construir hábitos saudáveis!
          </p>
        </div>
      </div>

      {/* Informações Técnicas */}
      <div className="habit-card">
        <h4 className="font-handwritten text-lg text-gray-700 mb-3">
          Informações Técnicas
        </h4>
        <div className="space-y-2 font-handwritten text-xs text-gray-500">
          <p>Versão: 1.0.0</p>
          <p>PWA: {typeof navigator !== 'undefined' && 'serviceWorker' in navigator ? 'Suportado' : 'Não suportado'}</p>
          <p>Notificações: {typeof Notification !== 'undefined' ? 'Suportadas' : 'Não suportadas'}</p>
          <p>Armazenamento: IndexedDB</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;