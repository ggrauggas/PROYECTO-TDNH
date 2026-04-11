const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET no está definido. Es obligatorio en producción.');
  }
  console.warn('[jwtUtils] JWT_SECRET no definido — usando valor de desarrollo inseguro.');
}

const SECRET = JWT_SECRET || 'dev_only_insecure_secret_change_me';

class JWTUtils {
  generateToken(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, SECRET);
    } catch (error) {
      return null;
    }
  }

  decodeToken(token) {
    return jwt.decode(token);
  }

  extractTokenFromHeader(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
}

module.exports = new JWTUtils();
