/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // toggle dark mode by adding/removing `dark` on <html>
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Premium handmade chocolate brand palette
        chocolate: {
          DEFAULT: '#5D4037',
          light: '#795548',
          dark: '#3E2723',
        },
        cream: '#FFF8E1',
        gold: {
          DEFAULT: '#C9A227',
          light: '#E0C158',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
};
