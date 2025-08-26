import { useState } from 'react';
import { Bell, Download, Database, Smartphone } from 'lucide-react';
import BackupSection from '../components/Settings/BackupSection';
import SettingsIcon from '../components/Icons/SettingsIcon';
import { notificationService } from '../services/notificationService';
import backgroundNotificationService from '../services/backgroundNotificationService';
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

  const handleTestBackgroundNotification = async () => {
    try {
      await backgroundNotificationService.showTestNotification();
      toast.success('Notificação de teste enviada!', {
        title: 'Background Test 🔔',
        duration: 2000
      });
    } catch (error) {
      console.error('Erro ao testar notificação background:', error);
      toast.error('Erro ao testar notificação background', {
        title: 'Erro 😔'
      });
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
            <div className="p-3 bg-green-50 rounded-xl animate-slide-up">
              <p className="text-sm font-handwritten text-green-800">
                ✅ Você receberá lembretes sobre seus hábitos e eventos!
              </p>
              <div className="flex gap-2 mt-2">
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => notificationService.testNotification()}
                >
                  Testar notificação
                </Button>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={handleTestBackgroundNotification}
                >
                  Testar background
                </Button>
              </div>
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

      {/* Notificações Background */}
      {notificationsEnabled && (
        <Card variant="glass" padding="lg">
          <Card.Header>
            <div className="flex items-center gap-2">
              <Smartphone className="text-blue-600" size={20} />
              <Card.Title>Notificações em Background</Card.Title>
            </div>
          </Card.Header>

          <Card.Content>
          
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-xl">
              <p className="text-sm font-handwritten text-blue-800 mb-2">
                🚀 <strong>Funciona mesmo com app fechado!</strong>
              </p>
              <p className="text-xs font-handwritten text-blue-700">
                Suas notificações de hábitos continuarão funcionando mesmo quando o B-612 não estiver aberto na tela.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Badge variant="success" size="lg" className="justify-center p-3">
                <div className="text-center">
                  <div className="font-semibold">✅ Com App Fechado</div>
                  <div className="text-xs">Service Worker</div>
                </div>
              </Badge>
              <Badge variant="warning" size="lg" className="justify-center p-3">
                <div className="text-center">
                  <div className="font-semibold">🔄 Sem Servidor</div>
                  <div className="text-xs">100% Local</div>
                </div>
              </Badge>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleTestBackgroundNotification}
              className="w-full"
              icon="🧪"
            >
              Testar Notificação Background
            </Button>
          </div>
          </Card.Content>
        </Card>
      )}


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