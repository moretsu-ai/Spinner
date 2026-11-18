/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#8B5CF6',
          violet: '#7C3AED',
          cyan: '#06B6D4',
          blue: '#3B82F6',
          pink: '#EC4899',
          orange: '#F97316',
          emerald: '#10B981',
          amber: '#F59E0B',
        },
        dark: {
          950: '#0a0b10',
          900: '#0f111a',
          850: '#151824',
          800: '#1c2030',
          700: '#282e42',
          600: '#38415d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)' },
          '100%': { boxShadow: '0 0 30px rgba(139, 92, 246, 0.8), 0 0 50px rgba(6, 182, 212, 0.4)' },
        }
      }
    },
  },
  plugins: [],
}
