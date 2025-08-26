// B-612 Design System Tokens
// Inspirado em "O Pequeno Príncipe" - Tema espacial e astronômico

export const designTokens = {
  // Cores primárias - Paleta pastel inspirada no espaço
  colors: {
    // Cores base do sistema
    primary: {
      50: '#F8F6FF',
      100: '#F0EBFF', 
      200: '#E6E6FA', // pastel-purple
      300: '#C7B6F5',
      400: '#A688E8',
      500: '#8B5CF6',
      600: '#7C3AED',
      700: '#6D28D9',
      800: '#5B21B6',
      900: '#4C1D95',
    },
    
    // Cores secundárias
    secondary: {
      50: '#F0FDF9',
      100: '#DCFCE7',
      200: '#98FB98', // pastel-mint
      300: '#86EFAC',
      400: '#4ADE80',
      500: '#22C55E',
      600: '#16A34A',
      700: '#15803D',
      800: '#166534',
      900: '#14532D',
    },

    // Cores de apoio
    accent: {
      salmon: '#FFA07A',
      blue: '#87CEEB', 
      pink: '#FFB6C1',
      yellow: '#FFFFE0',
    },

    // Cores neutras
    neutral: {
      0: '#FFFFFF',
      50: '#FAFAF9',
      100: '#F5F5F4',
      200: '#E7E5E4',
      300: '#D6D3D1',
      400: '#A8A29E',
      500: '#78716C',
      600: '#57534E',
      700: '#44403C',
      800: '#292524',
      900: '#1C1917',
    },

    // Cores semânticas
    semantic: {
      success: '#22C55E',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },

    // Backgrounds gradientes
    gradients: {
      primary: 'linear-gradient(135deg, #E6E6FA 0%, #87CEEB 50%, #98FB98 100%)',
      card: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.5) 100%)',
      modal: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
    }
  },

  // Tipografia
  typography: {
    // Famílias de fonte
    fontFamily: {
      handwritten: ['Patrick Hand', 'Indie Flower', 'cursive'],
      cute: ['Sacramento', 'cursive'],
      sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
    },

    // Tamanhos de fonte
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    },

    // Pesos de fonte
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },

  // Espaçamentos
  spacing: {
    0: '0px',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px  
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
  },

  // Bordas e raios
  border: {
    radius: {
      none: '0px',
      sm: '0.25rem',
      base: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
      '2xl': '1rem',      // Padrão do sistema
      '3xl': '1.5rem',
      full: '9999px',
    },
    width: {
      0: '0px',
      1: '1px',
      2: '2px',
      4: '4px',
    },
  },

  // Sombras
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    glass: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  },

  // Animações
  animation: {
    // Durações
    duration: {
      fast: '150ms',
      base: '300ms',
      slow: '500ms',
    },
    
    // Curvas de animação
    easing: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },

    // Transformações
    transform: {
      hover: 'translateY(-2px)',
      press: 'translateY(0px)',
      scale: 'scale(1.05)',
    },
  },

  // Breakpoints
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Z-indexes
  zIndex: {
    base: 1,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    modal: 50,
    popover: 60,
    tooltip: 70,
    notification: 80,
    max: 9999,
  },

  // Efeitos especiais do B-612
  effects: {
    glassmorphism: {
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
    },
    
    starField: {
      background: 'radial-gradient(2px 2px at 20px 30px, #eee, transparent), radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent)',
      backgroundSize: '80px 80px',
    },
  }
};

export default designTokens;