/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Gradiente principal azul → violeta
        'gradient-start': '#3b82f6', // blue-500
        'gradient-end': '#8b5cf6',   // violet-500
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
        'gradient-subtle': 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)',
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif'
        ],
      },
      lineHeight: {
        'relaxed-plus': '1.75', // Melhor legibilidade para TDAH
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-top': 'env(safe-area-inset-top)',
      }
    },
  },
  plugins: [],
}
