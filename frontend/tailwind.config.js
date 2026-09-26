/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF7F2',
        blush: '#FCEEE9',
        lavender: '#EAE6F5',
        gold: {
          light: '#DFCBAB',
          DEFAULT: '#C5A880',
          dark: '#A68A60',
        },
        bronze: {
          light: '#4A3E3D',
          DEFAULT: '#2C221E',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        luxury: '0 10px 30px -10px rgba(197, 168, 128, 0.25)',
        glass: '0 8px 32px 0 rgba(44, 34, 30, 0.08)',
      },
    },
  },
  plugins: [],
};
