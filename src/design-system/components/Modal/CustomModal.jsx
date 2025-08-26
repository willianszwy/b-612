import React, { useEffect } from 'react';

const CustomModal = ({ children, onClose, className = "" }) => {
  // Prevenir scroll do body quando modal está aberto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Fechar com ESC (pode ser sobrescrito pelo componente filho)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Fechar ao clicar no overlay (pode ser sobrescrito)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-[9999] overflow-y-auto animate-fade-in"
      onClick={handleOverlayClick}
    >
      <div className={`animate-slide-up my-auto min-h-0 ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default CustomModal;