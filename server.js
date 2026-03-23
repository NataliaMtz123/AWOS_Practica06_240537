const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas principales
app.get('/', (req, res) => {
  res.render('index', { title: 'Inicio' });
});

// Importar rutas
const mercadoPagoRoutes = require('./routes/mercadoPagoRoutes');
const padletRoutes = require('./routes/padletRoutes');
const geminiRoutes = require('./routes/geminiRoutes');

// Usar rutas
app.use('/', mercadoPagoRoutes);
app.use('/', padletRoutes);
app.use('/', geminiRoutes);

// Manejo de errores 404 (opcional)
app.use((req, res) => {
  res.status(404).render('error', { 
    title: 'Página no encontrada',
    message: 'La página que buscas no existe.'
  });
});

// Manejo de errores generales (opcional)
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).render('error', { 
    title: 'Error del servidor',
    message: 'Ocurrió un error en el servidor.'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📋 Padlet: http://localhost:${PORT}/padlet`);
  console.log(`🤖 IA: http://localhost:${PORT}/ia`);
  console.log(`💳 Mercado Pago: http://localhost:${PORT}/pago`);
});