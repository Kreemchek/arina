/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF5F7',
          100: '#FFE1E9',
          200: '#FFC7D6',
          300: '#FFA3BD',
          400: '#FF7FA4',
          500: '#FF5B8B',
          600: '#E6427A',
          700: '#CC2E68',
          800: '#B31E56',
          900: '#991444',
        },
        pastel: {
          pink: '#FFB6C1',
          blue: '#AEC6CF',
          purple: '#D8BFD8',
          peach: '#FFDAB9',
          mint: '#C1E1C1',
          lavender: '#E6E6FA',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

