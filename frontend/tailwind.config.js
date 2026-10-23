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
        canvas: '#0A0A0A',
        surface: {
          DEFAULT: '#111111',
          elevated: '#171717',
          hover: '#1F1F1F',
        },
        border: {
          DEFAULT: '#292929',
          light: '#333333',
        },
        text: {
          primary: '#D8D8D8',
          secondary: '#A0A0A0',
          muted: '#777777',
        },
        brand: {
          yellow: '#F2D35E',
          hover: '#FFE58A',
          dark: '#BFA238',
        },
        // Forensic severity accents
        severity: {
          critical: '#EF4444',
          high: '#F87171',
          medium: '#F59E0B',
          low: '#60A5FA',
          info: '#A0A0A0',
          normal: '#10B981',
        }
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['Manrope', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
        widest: '0.12em',
      }
    },
  },
  plugins: [],
}
