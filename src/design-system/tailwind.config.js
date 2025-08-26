/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,jsx,ts,tsx}",
    "./example-implementation.jsx",
    "../**/*.{js,jsx,ts,tsx}" // Para uso no projeto pai
  ],
  theme: {
    extend: {
      // Cores do B-612 Design System
      colors: {
        // Cores primárias
        'pastel-purple': '#E6E6FA',
        'pastel-mint': '#98FB98', 
        'pastel-salmon': '#FFA07A',
        'pastel-blue': '#87CEEB',
        'pastel-pink': '#FFB6C1',
        'pastel-yellow': '#FFFFE0',
        
        // Paleta estendida baseada nos tokens
        primary: {
          50: '#F8F6FF',
          100: '#F0EBFF',
          200: '#E6E6FA',
          300: '#C7B6F5',
          400: '#A688E8',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        
        secondary: {
          50: '#F0FDF9',
          100: '#DCFCE7',
          200: '#98FB98',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        
        accent: {
          salmon: '#FFA07A',
          blue: '#87CEEB',
          pink: '#FFB6C1', 
          yellow: '#FFFFE0',
        },
      },

      // Tipografia
      fontFamily: {
        'handwritten': ['Patrick Hand', 'Indie Flower', 'cursive'],
        'cute': ['Sacramento', 'cursive'],
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },

      // Bordas arredondadas
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },

      // Animações customizadas
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
        'pulse-gentle': 'pulseGentle 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-10px) rotate(1deg)' },
          '66%': { transform: 'translateY(5px) rotate(-1deg)' },
        },
      },

      // Sombras customizadas
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },

      // Backdrop blur
      backdropBlur: {
        xs: '2px',
      },

      // Espaçamentos específicos do B-612
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },

      // Z-indexes organizados
      zIndex: {
        'dropdown': '10',
        'sticky': '20', 
        'fixed': '30',
        'modal': '50',
        'popover': '60',
        'tooltip': '70',
        'notification': '80',
        'max': '9999',
      },

      // Gradientes customizados
      backgroundImage: {
        'b612-primary': 'linear-gradient(135deg, #E6E6FA 0%, #87CEEB 50%, #98FB98 100%)',
        'b612-card': 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.5) 100%)',
        'b612-modal': 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
        'b612-starfield': 'radial-gradient(2px 2px at 20px 30px, #eee, transparent), radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent)',
      },
    },
  },
  plugins: [
    // Plugin customizado para classes utilitárias do B-612
    function({ addUtilities }) {
      const newUtilities = {
        '.b612-glassmorphism': {
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        },
        '.b612-hover-lift': {
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
        '.b612-hover-glow': {
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
          },
        },
      };
      
      addUtilities(newUtilities, ['responsive', 'hover']);
    }
  ],
};