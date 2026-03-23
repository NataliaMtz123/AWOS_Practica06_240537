const router = require('express').Router();
const padletController = require('../controllers/padletController');

// Verificar que todas las funciones existen
router.get('/padlet', padletController.getIndex);
router.get('/padlet/posts', padletController.getPosts);
router.post('/padlet/create-post', padletController.createPost);
router.post('/padlet/create-board', padletController.createBoard);
router.delete('/padlet/posts/:postId', padletController.deletePost);

module.exports = router;