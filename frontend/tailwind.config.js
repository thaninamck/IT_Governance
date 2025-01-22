/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
/** @type {import('tailwindcss').Config} */


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
    },
  },
  plugins: [],
});