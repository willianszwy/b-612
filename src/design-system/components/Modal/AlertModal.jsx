import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';

const AlertModal = ({ 
  message, 
  title = 'Atenção', 
  icon, 
  variant = 'info',
  onConfirm,
  onClose 
}) => {
  // Prevenir scroll do body quando modal está aberto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Fechar com ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleConfirm();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleConfirm = () => {
    onConfirm?.();
    onClose?.();
  };

  const getVariantStyles = () => {
    const styles = {
      info: {
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        iconColor: 'text-blue-600',
        buttonColor: 'bg-blue-600 hover:bg-blue-700',
        defaultIcon: <Info size={24} />
      },
      success: {
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200', 
        iconColor: 'text-green-600',
        buttonColor: 'bg-green-600 hover:bg-green-700',
        defaultIcon: <CheckCircle size={24} />
      },
      warning: {
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        iconColor: 'text-yellow-600',
        buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
        defaultIcon: <AlertTriangle size={24} />
      },
      error: {
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        iconColor: 'text-red-600',
        buttonColor: 'bg-red-600 hover:bg-red-700',
        defaultIcon: <XCircle size={24} />
      }
    };
    
    return styles[variant] || styles.info;
  };

  const variantStyles = getVariantStyles();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999] animate-fade-in">
      <div 
        className="bg-white/90 backdrop-blur-md rounded-2xl p-6 w-full max-w-md animate-slide-up shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="alert-title"
        aria-describedby="alert-message"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`${variantStyles.iconColor} ${variantStyles.bgColor} ${variantStyles.borderColor} border rounded-full p-2`}>
              {icon ? (
                <span className="text-xl">{icon}</span>
              ) : (
                variantStyles.defaultIcon
              )}
            </div>
            <h2 
              id="alert-title"
              className="text-lg font-cute text-gray-800"
            >
              {title}
            </h2>
          </div>
          
          <button 
            onClick={handleConfirm}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mensagem */}
        <div className="mb-6">
          <p 
            id="alert-message"
            className="font-handwritten text-gray-700 text-base leading-relaxed"
          >
            {message}
          </p>
        </div>

        {/* Botão de ação */}
        <div className="flex justify-end">
          <button
            onClick={handleConfirm}
            className={`
              ${variantStyles.buttonColor}
              text-white font-handwritten font-semibold 
              py-3 px-6 rounded-2xl 
              transition-all duration-300 
              shadow-md hover:shadow-lg 
              transform hover:-translate-y-1
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            `}
            autoFocus
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;