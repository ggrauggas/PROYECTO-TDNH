const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');
const Validators = require('../utils/validators');

// Rutas públicas
router.get(
  '/post/:postId',
  Validators.validateId('postId'),
  Validators.checkValidation,
  authMiddleware.optionalAuth,
  commentController.getByPost
);

// Rutas protegidas
router.post(
  '/',
  authMiddleware.authenticate,
  Validators.validateComment(),
  Validators.checkValidation,
  commentController.create
);

router.put(
  '/:id',
  authMiddleware.authenticate,
  Validators.validateId(),
  Validators.validateComment(),
  Validators.checkValidation,
  commentController.update
);

router.delete(
  '/:id',
  authMiddleware.authenticate,
  Validators.validateId(),
  Validators.checkValidation,
  commentController.delete
);

module.exports = router;