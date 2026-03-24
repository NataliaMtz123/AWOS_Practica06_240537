const express = require('express');
const router = express.Router();
const padletController = require('../controllers/padletController');

// Verificar que el controlador existe
if (!padletController) {
  console.error('❌ Error: padletController no encontrado');
}

// Rutas
router.get('/padlet', (req, res) => {
  if (padletController.getIndex) {
    padletController.getIndex(req, res);
  } else {
    res.status(500).send('Error: getIndex no implementado');
  }
});

router.get('/padlet/api/posts', (req, res) => {
  if (padletController.getPosts) {
    padletController.getPosts(req, res);
  } else {
    res.json({ success: false, posts: [] });
  }
});

router.post('/padlet/api/posts', (req, res) => {
  if (padletController.createPost) {
    padletController.createPost(req, res);
  } else {
    res.status(500).json({ success: false, error: 'createPost no implementado' });
  }
});

router.get('/padlet/api/posts/:postId', (req, res) => {
  if (padletController.getPost) {
    padletController.getPost(req, res);
  } else {
    res.json({ success: false, error: 'getPost no implementado' });
  }
});

router.put('/padlet/api/posts/:postId', (req, res) => {
  if (padletController.updatePost) {
    padletController.updatePost(req, res);
  } else {
    res.json({ success: false, error: 'updatePost no implementado' });
  }
});

router.delete('/padlet/api/posts/:postId', (req, res) => {
  if (padletController.deletePost) {
    padletController.deletePost(req, res);
  } else {
    res.json({ success: false, error: 'deletePost no implementado' });
  }
});

router.get('/padlet/api/stats', (req, res) => {
  if (padletController.getBoardStats) {
    padletController.getBoardStats(req, res);
  } else {
    res.json({ success: false, stats: {} });
  }
});

module.exports = router;