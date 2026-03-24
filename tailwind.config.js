/** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs", "./public/**/*.js"],
  theme: {
    extend: {
      colors: {
        'azul-mercado': '#FF69B4',      // Rosa para Mercado Pago
        'padlet': '#DA70D6',           // Lila para Padlet
        'ia': '#FFB6C1',               // Rosa claro para IA
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