/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/@ionic/**/*.{html,ts}", // jika menggunakan Ionic
  ],
  theme: {
    extend: {
      animation:{
        'shake': 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes: {
          'shake' : {
              '10%, 90%': {
                  transform: 'translate3d(-1px, 0, 0)'
              },
              '20%, 80%' : {
                  transform: 'translate3d(2px, 0, 0)'
              },
              '30%, 50%, 70%': {
                  transform: 'translate3d(-4px, 0, 0)'
              },
              '40%, 60%': {
                  transform: 'translate3d(4px, 0, 0)'
              }
          }
      }
    },
    screens: {
      // 'dmw-1': { max: '425px', min: '375px' },
      // 'dmw-2': { max: '375px', min: '320px' },
      // 'dmw-3': { max: '320px', min: '300px' },
      'cw-1': { max: '371px', min: '327px' },
      'cw-2': { max: '359px', min: '300px' },
      'cw-3': { max: '327px', min: '300px' },
      'cw-4': { max: '375px', min: '300px' },
      'cw-5': { max: '425px', min: '375px' },
    },
  },
  plugins: [],
}