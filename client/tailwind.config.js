/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          DEFAULT: '#FF671F',
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#FF671F',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          hover: '#e5530f',
        },
        ink: {
          DEFAULT: '#14100b',
          900: '#14100b',
          800: '#1e1a14',
          700: '#2d261e',
          600: '#3c352d',
          500: '#52493e',
        },
        cream: {
          DEFAULT: '#fbf8f3',
          50: '#ffffff',
          100: '#fbf8f3',
          200: '#f5f0e8',
          300: '#ede4d6',
          400: '#e2d5c1',
        },
        paper: {
          DEFAULT: '#ffffff',
          dark: '#16212C',
        },
        line: {
          DEFAULT: '#e6e0d5',
          dark: '#223040',
        },
        navy: {
          DEFAULT: '#16212C',
          950: '#16212C',
          900: '#16212C',
          800: '#22303e',
        },
        primary: {
          50: '#fdf2f3',
          100: '#fbe6e8',
          500: '#d1495a',
          800: '#8B1E2E', // ABES Maroon
          900: '#6d1623',
          DEFAULT: '#8B1E2E',
        },
        'event-green': {
          DEFAULT: '#0b6623',
          light: '#15803d',
          deep: '#074d1a',
        },
        darkbg: {
          DEFAULT: '#16212C',
          surface: '#16212C',
          card: '#16212C',
          border: '#223040',
          input: '#16212C',
          muted: '#9ba6b5',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        'hack-card': '0 2px 0 0 #e6e0d5, 0 10px 20px -5px rgba(20, 16, 11, 0.05)',
        'hack-card-dark': '0 2px 0 0 #223040, 0 10px 20px -5px rgba(0, 0, 0, 0.3)',
        'hack-glow': '0 0 25px -3px rgba(255, 103, 31, 0.35)',
      },
    },
  },
  plugins: [],
}
