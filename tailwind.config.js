/** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs", "./public/**/*.js"],
  theme: {
    extend: {
      colors: {
        'azul-mercado': '#009EE3',      // Color oficial de Mercado Pago
        'padlet': '#7B68EE',
        'ia': '#10A37F',
        // Mantén tus colores anteriores si los necesitas
        nasa: '#0B3D91',
        inegi: '#2E7D32',
        fifa: '#326295',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}