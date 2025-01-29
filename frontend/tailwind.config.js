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
      },
      // Définir les animations
      animation: {
        slideInRight: 'slideInRight 0.1s ease-out ',
        slideOutRight: 'slideOutRight 0.5s ease-in',
      },
    },
  },
  plugins: [],
});