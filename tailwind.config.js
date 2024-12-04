/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./*.html",
    "./js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0077ED',
        secondary: '#00A3FF',
      },
      container: {
        center: true,
        padding: '1rem',
      },
    },
  },
  plugins: [],
}