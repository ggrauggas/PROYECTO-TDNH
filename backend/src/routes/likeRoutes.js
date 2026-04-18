const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas las rutas de likes requieren autenticación
router.use(authMiddleware.authenticate);

// Likes en posts
router.get('/post/:postId/likers', likeController.getPostLikers);
router.post('/post/:postId', likeController.likePost);
router.delete('/post/:postId', likeController.unlikePost);

// Likes en comentarios
router.post('/comment/:commentId', likeController.likeComment);
router.delete('/comment/:commentId', likeController.unlikeComment);

module.exports = router;