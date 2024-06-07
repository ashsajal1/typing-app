/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'sans': ['Ubuntu', 'ui-sans-serif', 'system-ui'],
    },
    extend: {},
  },
  plugins: [require('daisyui'),],
}