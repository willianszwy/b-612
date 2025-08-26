import { useState, useEffect } from 'react';
import { Download, Upload, Trash2, Database, AlertTriangle } from 'lucide-react';
import { backupService } from '../../services/backupService';
import { useModal, useToast } from '../../design-system';

const BackupSection = () => {
  const [storageInfo, setStorageInfo] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const modal = useModal();
  const toast = useToast();

  useEffect(() => {
    loadStorageInfo();
  }, []);

  const loadStorageInfo = async () => {
    try {
      const info = await backupService.getStorageInfo();
      setStorageInfo(info);
    } catch (error) {
      console.error('Erro ao carregar informações de armazenamento:', error);
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const data = await backupService.exportData();
      backupService.downloadBackup(data);
      
      setTimeout(() => {
        toast.success('Backup exportado com sucesso!', {
          title: 'Download Iniciado! 💾'
        });
      }, 500);
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      toast.error('Erro ao exportar dados. Tente novamente.', {
        title: 'Erro no Export! 😔'
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const data = await backupService.readFile(file);
      await backupService.importData(data);
      await loadStorageInfo();
      toast.success('Dados importados com sucesso!', {
        title: 'Import Concluído! 📥'
      });
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      toast.error(error.message, {
        title: 'Erro no Import! 😔'
      });
    } finally {
      setIsImporting(false);
      event.target.value = '';
    }
  };

  const handleClearData = async () => {
    const confirmed = await modal.confirm(
      'Esta ação irá remover TODOS os seus dados (hábitos, eventos, progresso). Esta ação não pode ser desfeita. Tem certeza?',
      {
        title: 'Limpar Todos os Dados',
        variant: 'error',
        confirmText: 'Sim, limpar tudo',
        cancelText: 'Cancelar',
        icon: '🗑️'
      }
    );

    if (!confirmed) return;

    try {
      await backupService.clearAllData();
      await loadStorageInfo();
      setShowClearConfirm(false);
      toast.success('Todos os dados foram removidos!', {
        title: 'Dados Limpos! 🧹'
      });
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      toast.error('Erro ao limpar dados. Tente novamente.', {
        title: 'Erro na Limpeza! 😔'
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Informações de armazenamento */}
      {storageInfo && (
        <div className="habit-card">
          <div className="flex items-center gap-2 mb-3">
            <Database className="text-blue-600" size={20} />
            <h4 className="font-handwritten text-lg text-blue-800">
              Armazenamento
            </h4>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm font-handwritten">
            <div className="text-center p-3 bg-white/50 rounded-xl">
              <div className="text-xl font-bold text-purple-800">
                {storageInfo.counts.habits}
              </div>
              <div className="text-gray-600">Hábitos</div>
            </div>
            <div className="text-center p-3 bg-white/50 rounded-xl">
              <div className="text-xl font-bold text-blue-800">
                {storageInfo.counts.events}
              </div>
              <div className="text-gray-600">Eventos</div>
            </div>
          </div>
          
          {storageInfo.storage.available > 0 && (
            <div className="mt-3 text-xs text-gray-600 font-handwritten text-center">
              Usando {storageInfo.storage.usedFormatted} de {storageInfo.storage.availableFormatted}
            </div>
          )}
        </div>
      )}

      {/* Backup e Restauração */}
      <div className="habit-card">
        <h4 className="font-handwritten text-lg text-purple-800 mb-4">
          Backup dos Dados
        </h4>
        
        <div className="space-y-3">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-handwritten transition-all ${
              isExporting
                ? 'bg-gray-200 text-gray-500'
                : 'bg-pastel-mint text-green-800 hover:bg-green-200'
            }`}
          >
            <Download size={20} />
            {isExporting ? 'Exportando...' : 'Exportar Dados'}
          </button>
          
          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              disabled={isImporting}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="import-file"
            />
            <label
              htmlFor="import-file"
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-handwritten transition-all cursor-pointer ${
                isImporting
                  ? 'bg-gray-200 text-gray-500'
                  : 'bg-pastel-blue text-blue-800 hover:bg-blue-200'
              }`}
            >
              <Upload size={20} />
              {isImporting ? 'Importando...' : 'Importar Dados'}
            </label>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-yellow-100 rounded-xl">
          <p className="text-xs font-handwritten text-yellow-800">
            💡 <strong>Dica:</strong> Exporte seus dados regularmente para não perder seus progressos!
          </p>
        </div>
      </div>

      {/* Limpar dados */}
      <div className="habit-card">
        <h4 className="font-handwritten text-lg text-red-800 mb-4">
          Zona de Perigo
        </h4>
        
        {!showClearConfirm ? (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-100 text-red-800 rounded-2xl font-handwritten hover:bg-red-200 transition-all"
          >
            <Trash2 size={20} />
            Limpar Todos os Dados
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-xl">
              <AlertTriangle className="text-red-600 mt-1" size={20} />
              <div>
                <p className="font-handwritten text-red-800 font-semibold">
                  Atenção!
                </p>
                <p className="text-sm font-handwritten text-red-700">
                  Esta ação irá remover permanentemente todos os seus hábitos, eventos e progresso. 
                  Esta ação não pode ser desfeita!
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="py-2 px-4 bg-gray-200 text-gray-700 rounded-2xl font-handwritten hover:bg-gray-300 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleClearData}
                className="py-2 px-4 bg-red-600 text-white rounded-2xl font-handwritten hover:bg-red-700 transition-all"
              >
                Confirmar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackupSection;