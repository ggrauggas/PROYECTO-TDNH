const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const Validators = require('../utils/validators');

// Rutas públicas
router.post(
  '/register',
  Validators.validateRegister(),
  Validators.checkValidation,
  authController.register
);

router.post(
  '/login',
  Validators.validateLogin(),
  Validators.checkValidation,
  authController.login
);

// Rutas protegidas
router.get(
  '/profile',
  authMiddleware.authenticate,
  authController.getProfile
);

router.put(
  '/profile',
  authMiddleware.authenticate,
  authController.updateProfile
);

module.exports = router;