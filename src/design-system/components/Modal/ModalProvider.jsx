import React, { createContext, useContext, useState, useCallback } from 'react';
import AlertModal from './AlertModal';
import ConfirmModal from './ConfirmModal';
import CustomModal from './CustomModal';

const ModalContext = createContext();

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal deve ser usado dentro de um ModalProvider');
  }
  return context;
};

export const ModalProvider = ({ children }) => {
  const [modals, setModals] = useState([]);

  const createModal = useCallback((modalConfig) => {
    const id = Date.now() + Math.random();
    const modal = { id, ...modalConfig };
    setModals(prev => [...prev, modal]);
    return id;
  }, []);

  const closeModal = useCallback((id) => {
    setModals(prev => prev.filter(modal => modal.id !== id));
  }, []);

  const closeAllModals = useCallback(() => {
    setModals([]);
  }, []);

  // Método para mostrar alert
  const alert = useCallback((message, options = {}) => {
    return new Promise((resolve) => {
      createModal({
        type: 'alert',
        message,
        title: options.title || 'Atenção',
        icon: options.icon || '⚠️',
        variant: options.variant || 'info',
        onClose: resolve,
      });
    });
  }, [createModal]);

  // Método para mostrar confirm
  const confirm = useCallback((message, options = {}) => {
    return new Promise((resolve) => {
      createModal({
        type: 'confirm',
        message,
        title: options.title || 'Confirmação',
        icon: options.icon || '❓',
        variant: options.variant || 'warning',
        confirmText: options.confirmText || 'Confirmar',
        cancelText: options.cancelText || 'Cancelar',
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  }, [createModal]);

  // Método para mostrar modal customizado
  const custom = useCallback((component, props = {}) => {
    return new Promise((resolve) => {
      createModal({
        type: 'custom',
        component,
        props: {
          ...props,
          onClose: resolve,
        },
      });
    });
  }, [createModal]);

  const value = {
    alert,
    confirm,
    custom,
    closeModal,
    closeAllModals,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      
      {/* Renderizar modais */}
      {modals.map((modal) => {
        const commonProps = {
          onClose: () => {
            closeModal(modal.id);
            if (modal.onClose) modal.onClose();
          },
        };

        switch (modal.type) {
          case 'alert':
            return (
              <AlertModal
                key={modal.id}
                {...commonProps}
                message={modal.message}
                title={modal.title}
                icon={modal.icon}
                variant={modal.variant}
                onConfirm={() => {
                  closeModal(modal.id);
                  if (modal.onClose) modal.onClose();
                }}
              />
            );

          case 'confirm':
            return (
              <ConfirmModal
                key={modal.id}
                {...commonProps}
                message={modal.message}
                title={modal.title}
                icon={modal.icon}
                variant={modal.variant}
                confirmText={modal.confirmText}
                cancelText={modal.cancelText}
                onConfirm={() => {
                  closeModal(modal.id);
                  if (modal.onConfirm) modal.onConfirm();
                }}
                onCancel={() => {
                  closeModal(modal.id);
                  if (modal.onCancel) modal.onCancel();
                }}
              />
            );

          case 'custom': {
            const CustomComponent = modal.component;
            return (
              <CustomModal
                key={modal.id}
                {...commonProps}
                onClose={() => {
                  closeModal(modal.id);
                  if (modal.props?.onClose) modal.props.onClose();
                }}
              >
                <CustomComponent
                  {...modal.props}
                  onClose={() => {
                    closeModal(modal.id);
                    if (modal.props?.onClose) modal.props.onClose();
                  }}
                />
              </CustomModal>
            );
          }

          default:
            return null;
        }
      })}
    </ModalContext.Provider>
  );
};