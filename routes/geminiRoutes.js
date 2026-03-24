const express = require('express');
const router = express.Router();
const geminiController = require('../controllers/geminiController');

// Verificar que el controlador existe
if (!geminiController) {
  console.error('❌ Error: geminiController no encontrado');
}

// Rutas
router.get('/ia', geminiController.getIndex);
router.post('/ia/api/generate', geminiController.generateText);      // <--- Esta es la URL correcta
router.post('/ia/api/sentiment', geminiController.analyzeSentiment);  // <--- Esta es la URL correcta
router.post('/ia/api/summarize', geminiController.summarize);         // <--- Esta es la URL correcta
router.post('/ia/api/chat', geminiController.chat);

module.exports = router;