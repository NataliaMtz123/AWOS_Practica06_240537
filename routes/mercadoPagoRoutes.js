const express = require('express');
const router = express.Router();
const mercadoPagoController = require('../controllers/mercadoPagoController');

// Verificar que el controlador existe
if (!mercadoPagoController) {
  console.error('❌ Error: mercadoPagoController no encontrado');
}

// Rutas - Asegurarse de que todas las funciones existen
router.get('/pago', (req, res) => {
  if (mercadoPagoController.getPagoPage) {
    mercadoPagoController.getPagoPage(req, res);
  } else {
    res.status(500).send('Error: getPagoPage no implementado');
  }
});

router.post('/crear-pago', (req, res) => {
  if (mercadoPagoController.crearPago) {
    mercadoPagoController.crearPago(req, res);
  } else {
    res.status(500).json({ error: 'crearPago no implementado' });
  }
});

router.get('/success', (req, res) => {
  if (mercadoPagoController.getSuccess) {
    mercadoPagoController.getSuccess(req, res);
  } else {
    res.send('<h1>Pago Exitoso!</h1><p>Tu pago se ha procesado correctamente.</p><a href="/">Volver al inicio</a>');
  }
});

router.get('/failure', (req, res) => {
  if (mercadoPagoController.getFailure) {
    mercadoPagoController.getFailure(req, res);
  } else {
    res.send('<h1>Pago Fallido</h1><p>Hubo un problema con tu pago.</p><a href="/pago">Intentar nuevamente</a>');
  }
});

router.get('/pending', (req, res) => {
  if (mercadoPagoController.getPending) {
    mercadoPagoController.getPending(req, res);
  } else {
    res.send('<h1>Pago Pendiente</h1><p>Tu pago está siendo procesado.</p><a href="/">Volver al inicio</a>');
  }
});

router.post('/webhook', (req, res) => {
  if (mercadoPagoController.recibirWebhook) {
    mercadoPagoController.recibirWebhook(req, res);
  } else {
    res.status(200).send('OK');
  }
});

module.exports = router;