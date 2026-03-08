class ErrorMiddleware {
  // Middleware para manejar rutas no encontradas
  notFound(req, res, next) {
    const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
    error.status = 404;
    next(error);
  }

  // Middleware para manejar errores generales
  errorHandler(err, req, res, next) {
    const status = err.status || 500;
    const message = err.message || 'Error interno del servidor';

    // Log del error para debugging
    console.error(`[ERROR] ${status}: ${message}`);
    if (err.stack) {
      console.error(err.stack);
    }

    res.status(status).json({
      status: 'error',
      message: message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  // Middleware para manejar errores de base de datos
  databaseError(err, req, res, next) {
    if (err.code) {
      // Errores de PostgreSQL
      switch (err.code) {
        case '23505': // Unique violation
          return res.status(409).json({
            status: 'error',
            message: 'El registro ya existe',
            detail: err.detail
          });
        case '23503': // Foreign key violation
          return res.status(400).json({
            status: 'error',
            message: 'Referencia a registro no existente',
            detail: err.detail
          });
        case '42P01': // Undefined table
          return res.status(500).json({
            status: 'error',
            message: 'Error en la base de datos'
          });
        default:
          next(err);
      }
    } else {
      next(err);
    }
  }
}

module.exports = new ErrorMiddleware();