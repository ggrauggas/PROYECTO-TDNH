const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const authMiddleware = require('../middlewares/authMiddleware');
const Validators = require('../utils/validators');

// Todas las rutas de likes requieren autenticación
router.use(authMiddleware.authenticate);

// Likes en posts
router.post(
  '/post/:postId',
  Validators.validateId('postId'),
  Validators.checkValidation,
  likeController.likePost
);

router.delete(
  '/post/:postId',
  Validators.validateId('postId'),
  Validators.checkValidation,
  likeController.unlikePost
);

// Likes en comentarios
router.post(
  '/comment/:commentId',
  Validators.validateId('commentId'),
  Validators.checkValidation,
  likeController.likeComment
);

router.delete(
  '/comment/:commentId',
  Validators.validateId('commentId'),
  Validators.checkValidation,
  likeController.unlikeComment
);

module.exports = router;