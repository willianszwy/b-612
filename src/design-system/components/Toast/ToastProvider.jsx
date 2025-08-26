import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from './Toast';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children, maxToasts = 5 }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toastConfig) => {
    const id = Date.now() + Math.random();
    const toast = { id, ...toastConfig };
    
    setToasts(prev => {
      const newToasts = [...prev, toast];
      // Limitar número máximo de toasts
      if (newToasts.length > maxToasts) {
        return newToasts.slice(-maxToasts);
      }
      return newToasts;
    });
    
    return id;
  }, [maxToasts]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Métodos de conveniência
  const success = useCallback((message, options = {}) => {
    return addToast({
      variant: 'success',
      title: options.title || 'Sucesso!',
      message,
      duration: options.duration || 5000,
      ...options,
    });
  }, [addToast]);

  const error = useCallback((message, options = {}) => {
    return addToast({
      variant: 'error',
      title: options.title || 'Erro!',
      message,
      duration: options.duration || 7000, // Erros ficam mais tempo
      ...options,
    });
  }, [addToast]);

  const warning = useCallback((message, options = {}) => {
    return addToast({
      variant: 'warning',
      title: options.title || 'Atenção!',
      message,
      duration: options.duration || 6000,
      ...options,
    });
  }, [addToast]);

  const info = useCallback((message, options = {}) => {
    return addToast({
      variant: 'info',
      title: options.title || 'Informação',
      message,
      duration: options.duration || 4000,
      ...options,
    });
  }, [addToast]);

  const custom = useCallback((config) => {
    return addToast(config);
  }, [addToast]);

  const value = {
    success,
    error,
    warning,
    info,
    custom,
    removeToast,
    removeAllToasts,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* Container para renderizar toasts */}
      <div className="fixed inset-0 pointer-events-none z-[9999]">
        {toasts.map((toast) => {
          // Calcular posição baseado no índice para empilhar
          const index = toasts.findIndex(t => t.id === toast.id);
          const offset = index * 80; // 80px de espaço entre toasts
          
          const position = toast.position || 'top-right';
          const positionStyle = position.includes('top') 
            ? { top: `${16 + offset}px` }
            : { bottom: `${16 + offset}px` };

          return (
            <div
              key={toast.id}
              className="absolute pointer-events-auto max-w-sm w-full"
              style={{
                ...positionStyle,
                right: position.includes('right') ? '16px' : undefined,
                left: position.includes('center') ? '50%' : position.includes('left') ? '16px' : undefined,
                transform: position.includes('center') ? 'translateX(-50%)' : undefined,
              }}
            >
              <Toast
                variant={toast.variant}
                title={toast.title}
                message={toast.message}
                duration={toast.duration}
                closable={toast.closable}
                icon={toast.icon}
                position={toast.position}
                onClose={() => removeToast(toast.id)}
              />
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};