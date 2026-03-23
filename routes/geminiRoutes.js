const router = require('express').Router();
const geminiController = require('../controllers/geminiController');

router.get('/ia', geminiController.getIndex);
router.post('/ia/generate-text', geminiController.generateText);
router.post('/ia/sentiment', geminiController.analyzeSentiment);
router.post('/ia/summarize', geminiController.summarize);

module.exports = router;