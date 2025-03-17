/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/@ionic/**/*.{html,ts}", // jika menggunakan Ionic
  ],
  theme: {
    extend: {},
    screens: {
      'cw-1': { max: '371px', min: '327px' },
      'cw-2': { max: '359px', min: '300px' },
      'cw-3': { max: '327px', min: '300px' },
      'cw-4': { max: '375px', min: '300px' },
      'cw-5': { max: '425px', min: '375px' },
    },
  },
  plugins: [],
}