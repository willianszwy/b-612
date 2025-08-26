import { useState } from 'react';
import { Bell, Download, Database } from 'lucide-react';
import BackupSection from '../components/Settings/BackupSection';
import SettingsIcon from '../components/Icons/SettingsIcon';
import { notificationService } from '../services/notificationService';
import { useToast, useModal, Card, Button, Badge } from '../design-system';

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    Notification?.permission === 'granted'
  );
  const toast = useToast();
  const modal = useModal();

  const handleNotificationToggle = async () => {
    if (!notificationsEnabled) {
      const permission = await notificationService.requestPermission();
      setNotificationsEnabled(permission === 'granted');
      
      if (permission === 'granted') {
        notificationService.testNotification();
      }
    } else {
      await modal.alert(
        'Para desativar notificações, use as configurações do seu navegador.',
        {
          title: 'Gerenciar Notificações',
          variant: 'info',
          icon: '⚙️'
        }
      );
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="glass" padding="lg">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <SettingsIcon size={64} className="text-purple-600" />
          </div>
          <Card.Title>Configurações</Card.Title>
          <Card.Description>
            Personalize sua experiência no B-612
          </Card.Description>
        </div>
      </Card>

      {/* Notificações */}
      <Card variant="default" padding="lg">
        <Card.Header>
          <div className="flex items-center gap-2">
            <Bell className="text-yellow-600" size={20} />
            <Card.Title>Notificações</Card.Title>
          </div>
        </Card.Header>

        <Card.Content>
        
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
            <div className="space-y-3 animate-slide-up">
              <div className="p-3 bg-green-50 rounded-xl">
                <p className="text-sm font-handwritten text-green-800 mb-2">
                  ✅ <strong>Notificações ativadas!</strong>
                </p>
                <p className="text-xs font-handwritten text-green-700">
                  Você receberá lembretes sobre seus hábitos mesmo com o app minimizado por alguns minutos.
                </p>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm font-handwritten text-blue-800 mb-2">
                  📱 <strong>Como funcionam:</strong>
                </p>
                <ul className="text-xs font-handwritten text-blue-700 space-y-1">
                  <li>• <strong>App aberto:</strong> Notificações instantâneas</li>
                  <li>• <strong>App minimizado:</strong> Funciona por ~5-10 min</li>
                  <li>• <strong>PWA instalado:</strong> Melhor persistência</li>
                  <li>• <strong>App fechado:</strong> Re-agenda ao abrir</li>
                </ul>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={() => notificationService.testNotification()}
                className="w-full"
                icon="🧪"
              >
                Testar Notificação
              </Button>
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
        </Card.Content>
      </Card>


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

    </div>
  );
};

export default Settings;