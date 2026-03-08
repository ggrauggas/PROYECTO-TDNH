const jwtUtils = require('../utils/jwtUtils');
const userModel = require('../models/userModel');

class AuthMiddleware {
  // Verificar si el usuario está autenticado
  async authenticate(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      const token = jwtUtils.extractTokenFromHeader(authHeader);

      if (!token) {
        return res.status(401).json({
          status: 'error',
          message: 'No autorizado. Token no proporcionado.'
        });
      }

      const decoded = jwtUtils.verifyToken(token);
      
      if (!decoded) {
        return res.status(401).json({
          status: 'error',
          message: 'Token inválido o expirado.'
        });
      }

      // Verificar que el usuario aún existe en la BD
      const user = await userModel.findById(decoded.id);
      
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Usuario no encontrado.'
        });
      }

      // Añadir información del usuario a la request
      req.user = {
        id: decoded.id,
        username: decoded.username,
        email: decoded.email,
        role: decoded.role
      };

      next();
    } catch (error) {
      console.error('Error en autenticación:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Error en el servidor'
      });
    }
  }

  // Verificar si el usuario es el propietario del recurso
  async isOwner(req, res, next) {
    // Esta función se usa después de authenticate
    // y asume que req.user ya está definido
    const resourceUserId = req.resourceUserId; // Debe ser establecido por el controlador
    
    if (req.user.role === 'admin') {
      return next(); // Admin puede todo
    }

    if (req.user.id !== resourceUserId) {
      return res.status(403).json({
        status: 'error',
        message: 'No tienes permiso para realizar esta acción.'
      });
    }

    next();
  }

  // Verificar si el usuario es admin
  isAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Acceso denegado. Se requieren permisos de administrador.'
      });
    }
    next();
  }

  // Middleware opcional (no requiere autenticación, pero si hay token lo procesa)
  async optionalAuth(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      const token = jwtUtils.extractTokenFromHeader(authHeader);

      if (token) {
        const decoded = jwtUtils.verifyToken(token);
        if (decoded) {
          const user = await userModel.findById(decoded.id);
          if (user) {
            req.user = {
              id: decoded.id,
              username: decoded.username,
              email: decoded.email,
              role: decoded.role
            };
          }
        }
      }
      next();
    } catch (error) {
      // Si hay error, simplemente continuamos sin usuario
      next();
    }
  }
}

module.exports = new AuthMiddleware();