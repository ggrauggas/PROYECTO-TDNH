const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_jwt_super_seguro_cambiame_en_produccion';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

class JWTUtils {
  // Generar token
  generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  // Verificar token
  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  // Decodificar token sin verificar (útil para depuración)
  decodeToken(token) {
    return jwt.decode(token);
  }

  // Extraer token del header de autorización
  extractTokenFromHeader(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7); // Quita 'Bearer ' del inicio
  }
}

module.exports = new JWTUtils();