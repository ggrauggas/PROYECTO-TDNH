const { body, param, validationResult } = require('express-validator');

class Validators {
  // Validadores para autenticación
  static validateRegister() {
    return [
      body('username')
        .notEmpty().withMessage('El nombre de usuario es requerido')
        .isLength({ min: 3, max: 50 }).withMessage('El username debe tener entre 3 y 50 caracteres')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('El username solo puede contener letras, números y guiones bajos'),
      
      body('email')
        .notEmpty().withMessage('El email es requerido')
        .isEmail().withMessage('Email inválido')
        .normalizeEmail(),
      
      body('password')
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)/).withMessage('La contraseña debe contener al menos una letra y un número'),
      
      body('full_name')
        .optional()
        .isLength({ max: 100 }).withMessage('El nombre no puede exceder 100 caracteres'),
      
      body('diabetes_type')
        .optional()
        .isIn(['Tipo 1', 'Tipo 2', 'Gestacional', 'Otro']).withMessage('Tipo de diabetes inválido'),
      
      body('diagnosis_date')
        .optional()
        .isDate().withMessage('Fecha de diagnóstico inválida')
    ];
  }

  static validateLogin() {
    return [
      body('email')
        .notEmpty().withMessage('El email es requerido')
        .isEmail().withMessage('Email inválido')
        .normalizeEmail(),
      
      body('password')
        .notEmpty().withMessage('La contraseña es requerida')
    ];
  }

  // Validadores para posts
  static validatePost() {
    return [
      body('title')
        .notEmpty().withMessage('El título es requerido')
        .isLength({ min: 5, max: 200 }).withMessage('El título debe tener entre 5 y 200 caracteres'),
      
      body('content')
        .notEmpty().withMessage('El contenido es requerido')
        .isLength({ min: 10 }).withMessage('El contenido debe tener al menos 10 caracteres'),
      
      body('category')
        .optional()
        .isIn(['general', 'pregunta', 'experiencia', 'consejo']).withMessage('Categoría inválida'),
      
      body('tags')
        .optional()
        .isString().withMessage('Tags debe ser texto')
    ];
  }

  // Validadores para comentarios
  static validateComment() {
    return [
      body('content')
        .notEmpty().withMessage('El comentario es requerido')
        .isLength({ min: 1, max: 1000 }).withMessage('El comentario debe tener entre 1 y 1000 caracteres'),
      
      body('parent_comment_id')
        .optional()
        .isInt().withMessage('ID de comentario padre inválido')
    ];
  }

  // Validar ID en parámetros
  static validateId(paramName = 'id') {
    return [
      param(paramName)
        .isInt().withMessage(`El ${paramName} debe ser un número entero`)
        .toInt()
    ];
  }

  // Middleware para verificar resultados de validación
  static checkValidation(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    next();
  }
}

module.exports = Validators;