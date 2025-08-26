import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';

const Toast = ({
  variant = 'info',
  title = '',
  message = '',
  duration = 5000,
  closable = true,
  icon = null,
  position = 'top-right',
  onClose,
  className = '',
  ...props
}) => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (duration > 0) {
      // Iniciar progresso
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (duration / 100));
          if (newProgress <= 0) {
            clearInterval(progressInterval);
            return 0;
          }
          return newProgress;
        });
      }, 100);

      // Auto fechar
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => {
        clearInterval(progressInterval);
        clearTimeout(timer);
      };
    }
  }, [duration]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300); // Aguarda animação de saída
  };

  const getVariantClasses = () => {
    const variants = {
      info: {
        bgColor: 'bg-blue-50/90',
        borderColor: 'border-blue-200',
        iconColor: 'text-blue-600',
        titleColor: 'text-blue-800',
        messageColor: 'text-blue-700',
        progressColor: 'bg-blue-400',
        defaultIcon: <Info size={20} />
      },
      success: {
        bgColor: 'bg-green-50/90',
        borderColor: 'border-green-200',
        iconColor: 'text-green-600',
        titleColor: 'text-green-800',
        messageColor: 'text-green-700',
        progressColor: 'bg-green-400',
        defaultIcon: <CheckCircle size={20} />
      },
      warning: {
        bgColor: 'bg-yellow-50/90',
        borderColor: 'border-yellow-200',
        iconColor: 'text-yellow-600',
        titleColor: 'text-yellow-800',
        messageColor: 'text-yellow-700',
        progressColor: 'bg-yellow-400',
        defaultIcon: <AlertTriangle size={20} />
      },
      error: {
        bgColor: 'bg-red-50/90',
        borderColor: 'border-red-200',
        iconColor: 'text-red-600',
        titleColor: 'text-red-800',
        messageColor: 'text-red-700',
        progressColor: 'bg-red-400',
        defaultIcon: <XCircle size={20} />
      }
    };
    
    return variants[variant] || variants.info;
  };

  const getPositionClasses = () => {
    const positions = {
      'top-left': 'top-4 left-4',
      'top-right': 'top-4 right-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'bottom-left': 'bottom-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
    };
    
    return positions[position] || positions['top-right'];
  };

  const variantStyles = getVariantClasses();

  if (!visible) {
    return null;
  }

  return (
    <div 
      className={`
        fixed z-[9999] max-w-sm w-full
        ${getPositionClasses()}
        ${visible ? 'animate-slide-up' : 'animate-fade-out'}
        ${className}
      `}
      {...props}
    >
      <div className={`
        ${variantStyles.bgColor} ${variantStyles.borderColor}
        backdrop-blur-md border rounded-2xl p-4 shadow-lg
        transform transition-all duration-300
        ${visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
      `}>
        {/* Conteúdo */}
        <div className="flex items-start gap-3">
          {/* Ícone */}
          <div className={`${variantStyles.iconColor} flex-shrink-0 mt-0.5`}>
            {icon || variantStyles.defaultIcon}
          </div>

          {/* Texto */}
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className={`${variantStyles.titleColor} font-handwritten font-semibold text-sm mb-1`}>
                {title}
              </h4>
            )}
            
            {message && (
              <p className={`${variantStyles.messageColor} font-handwritten text-sm leading-relaxed`}>
                {message}
              </p>
            )}
          </div>

          {/* Botão de fechar */}
          {closable && (
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              aria-label="Fechar notificação"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Barra de progresso */}
        {duration > 0 && (
          <div className="mt-3 h-1 bg-gray-200/50 rounded-full overflow-hidden">
            <div 
              className={`h-full ${variantStyles.progressColor} transition-all duration-100 ease-linear rounded-full`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Toast;