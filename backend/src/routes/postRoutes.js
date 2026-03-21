const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas públicas
router.get('/', authMiddleware.optionalAuth, postController.getAll);
router.get('/:id', authMiddleware.optionalAuth, postController.getById);
router.get('/user/:userId', postController.getByUser);

// Rutas protegidas
router.post('/', authMiddleware.authenticate, postController.create);
router.put('/:id', authMiddleware.authenticate, postController.update);
router.delete('/:id', authMiddleware.authenticate, postController.delete);

module.exports = router;