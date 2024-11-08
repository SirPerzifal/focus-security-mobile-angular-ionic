/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/@ionic/**/*.{html,ts}", // jika menggunakan Ionic
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}