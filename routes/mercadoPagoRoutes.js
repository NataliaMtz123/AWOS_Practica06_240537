const router = require('express').Router();
const mercadoPagoController = require('../controllers/mercadoPagoController');

router.get('/pago', mercadoPagoController.getPagoPage);
router.post('/crear-pago', mercadoPagoController.crearPago);
router.get('/success', mercadoPagoController.getSuccess);
router.get('/failure', mercadoPagoController.getFailure);
router.get('/pending', mercadoPagoController.getPending);
router.post('/webhook', mercadoPagoController.recibirWebhook);

module.exports = router;