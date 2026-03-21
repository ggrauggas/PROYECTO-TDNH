const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas públicas
router.get('/post/:postId', authMiddleware.optionalAuth, commentController.getByPost);

// Rutas protegidas
router.post('/', authMiddleware.authenticate, commentController.create);
router.put('/:id', authMiddleware.authenticate, commentController.update);
router.delete('/:id', authMiddleware.authenticate, commentController.delete);

module.exports = router;