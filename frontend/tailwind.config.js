/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blue-icons': '#0B87AC',
        'blue-nav': '#E9EFF8',
        'blue-conf': '#0071FF',
        'blue-menu': '#152259',
        'success-green': '#276E27',
        'await-orange': '#FFA000',
        'alert-red': '#FF0000',
        'subfont-gray': '#8C8C8C',
        'status-gray': '#A3ADB8',
        'font-gray': '#262E36',
      },
      // Définir les keyframes
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-10px)' },
    },
     fadeIn: {
      from: { opacity: '0', transform: 'translateY(10px)' },
      to: { opacity: '1', transform: 'translateY(0)' },
    },
      },
      // Définir les animations
      animation: {
    slideInRight: 'slideInRight 0.1s ease-out',
    slideOutRight: 'slideOutRight 0.5s ease-in',
    float: 'float 3s ease-in-out infinite',
    fadeIn: 'fadeIn 1.2s ease-in-out',
  },
    },
  },
  plugins: [],
});