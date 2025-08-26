/**
 * B-612 Design System
 * 
 * Sistema de design inspirado em "O Pequeno Príncipe"
 * Tema espacial e astronômico com cores pastel e tipografia handwritten
 * 
 * Características:
 * - PWA-first (Mobile responsivo)
 * - Glassmorphism e efeitos de blur
 * - Animações suaves
 * - Componentes acessíveis
 * - Sistema de tokens consistente
 * - Modais e toasts customizados
 * 
 * @version 1.0.0
 * @author B-612 Team
 */

// Re-exportar tudo dos componentes
export * from './components';

// Utilitários e helpers
export { default as designTokens } from './tokens';

// Versão do design system
export const VERSION = '1.0.0';

// Configurações padrão
export const DEFAULT_CONFIG = {
  theme: {
    primary: 'pastel-purple',
    secondary: 'pastel-mint',
    accent: 'pastel-salmon',
  },
  animations: {
    duration: '300ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
  },
  modals: {
    maxStack: 5,
    closeOnOverlay: true,
    closeOnEscape: true,
  },
  toasts: {
    maxVisible: 5,
    defaultDuration: 5000,
    position: 'top-right',
  },
};