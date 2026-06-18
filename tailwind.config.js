/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        serif: ['"Bodoni Moda"', 'serif'],
      },
      colors: {
        brand: {
          bg: '#030610',
          dark: '#0A0618',
          blue: '#3b82f6',
          purple: '#8b5cf6',
        }
      }
    },
  },
  plugins: [],
}
