/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/design-system/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pastel-purple': '#E6E6FA',
        'pastel-mint': '#98FB98',
        'pastel-salmon': '#FFA07A',
        'pastel-blue': '#87CEEB',
        'pastel-pink': '#FFB6C1',
        'pastel-yellow': '#FFFFE0',
      },
      fontFamily: {
        'handwritten': ['Patrick Hand', 'Indie Flower', 'cursive'],
        'cute': ['Sacramento', 'cursive'],
      },
      borderRadius: {
        '2xl': '1rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
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
      },
    },
  },
  plugins: [],
}