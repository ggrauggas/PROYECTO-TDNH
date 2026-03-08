const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');
const Validators = require('../utils/validators');

// Rutas públicas (solo lectura)
router.get(
  '/',
  authMiddleware.optionalAuth,
  postController.getAll
);

router.get(
  '/:id',
  Validators.validateId(),
  Validators.checkValidation,
  authMiddleware.optionalAuth,
  postController.getById
);

router.get(
  '/user/:userId',
  Validators.validateId('userId'),
  Validators.checkValidation,
  postController.getByUser
);

// Rutas protegidas (requieren autenticación)
router.post(
  '/',
  authMiddleware.authenticate,
  Validators.validatePost(),
  Validators.checkValidation,
  postController.create
);

router.put(
  '/:id',
  authMiddleware.authenticate,
  Validators.validateId(),
  Validators.validatePost(),
  Validators.checkValidation,
  postController.update
);

router.delete(
  '/:id',
  authMiddleware.authenticate,
  Validators.validateId(),
  Validators.checkValidation,
  postController.delete
);

module.exports = router;