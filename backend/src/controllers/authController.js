const userModel = require('../models/userModel');
const jwtUtils = require('../utils/jwtUtils');
const { sendVerificationEmail } = require('../utils/emailUtils');

function generateCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

class AuthController {
  // Registro de nuevo usuario
  async register(req, res) {
    try {
      const { username, email, password, full_name, diabetes_type, diagnosis_date, bio, glucose_enabled } = req.body;

      const existingEmail = await userModel.findByEmail(email);
      if (existingEmail) {
        if (existingEmail.is_verified) {
          return res.status(400).json({ status: 'error', message: 'El email ya está registrado' });
        }
        await userModel.deleteById(existingEmail.id);
      }

      const existingUsername = await userModel.findByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ status: 'error', message: 'El nombre de usuario ya está en uso' });
      }

      const newUser = await userModel.create({
        username, email, password, full_name, diabetes_type, diagnosis_date, bio,
        glucose_enabled: glucose_enabled !== undefined ? Boolean(glucose_enabled) : false
      });

      const code = generateCode();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
      await userModel.saveVerificationCode(newUser.id, code, expiresAt);

      res.status(201).json({
        status: 'success',
        message: 'Registro completado. Hemos enviado un código de verificación a tu email.',
        data: { email }
      });

      sendVerificationEmail(email, code).catch(err => {
        console.error('[Email] Error enviando verificación a', email, '-', err.message, err.code || '', err.responseCode || '');
      });

    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({ status: 'error', message: 'Error al registrar usuario' });
    }
  }

  // Verificar código de email
  async verifyEmail(req, res) {
    try {
      const { email, code } = req.body;

      if (!email || !code) {
        return res.status(400).json({ status: 'error', message: 'Email y código son requeridos' });
      }

      const result = await userModel.verifyEmailCode(email, code.trim());

      if (!result.success) {
        const messages = {
          user_not_found: 'Usuario no encontrado',
          already_verified: 'La cuenta ya está verificada',
          invalid_code: 'Código incorrecto',
          expired: 'El código ha caducado. Solicita uno nuevo.'
        };
        return res.status(400).json({ status: 'error', message: messages[result.reason] || 'Código inválido' });
      }

      const user = await userModel.findByEmail(email);
      const token = jwtUtils.generateToken({ id: user.id, username: user.username, email: user.email, role: user.role });
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        status: 'success',
        message: 'Cuenta verificada correctamente',
        data: { user: userWithoutPassword, token }
      });

    } catch (error) {
      console.error('Error en verificación:', error);
      res.status(500).json({ status: 'error', message: 'Error al verificar el código' });
    }
  }

  // Reenviar código de verificación
  async resendVerification(req, res) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ status: 'error', message: 'Email requerido' });

      const user = await userModel.findByEmail(email);
      if (!user) return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
      if (user.is_verified) return res.status(400).json({ status: 'error', message: 'La cuenta ya está verificada' });

      const code = generateCode();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
      await userModel.saveVerificationCode(user.id, code, expiresAt);

      res.json({ status: 'success', message: 'Código reenviado a tu email' });

      sendVerificationEmail(email, code).catch(err => {
        console.error('[Email] Error reenviando verificación a', email, '-', err.message, err.code || '', err.responseCode || '');
      });

    } catch (error) {
      console.error('Error al reenviar código:', error);
      res.status(500).json({ status: 'error', message: 'Error al reenviar el código' });
    }
  }

  // Login de usuario
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await userModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ status: 'error', message: 'Email o contraseña incorrectos' });
      }

      const isValidPassword = await userModel.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ status: 'error', message: 'Email o contraseña incorrectos' });
      }

      if (!user.is_verified) {
        return res.status(403).json({
          status: 'error',
          message: 'Debes verificar tu cuenta antes de iniciar sesión',
          data: { requiresVerification: true, email: user.email }
        });
      }

      await userModel.updateLastLogin(user.id);

      const token = jwtUtils.generateToken({ id: user.id, username: user.username, email: user.email, role: user.role });
      const { password: _, ...userWithoutPassword } = user;

      res.json({ status: 'success', message: 'Login exitoso', data: { user: userWithoutPassword, token } });

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ status: 'error', message: 'Error al iniciar sesión' });
    }
  }

  // Obtener perfil del usuario actual
  async getProfile(req, res) {
    try {
      const user = await userModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
      }
      res.json({ status: 'success', data: { user } });
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      res.status(500).json({ status: 'error', message: 'Error al obtener perfil' });
    }
  }

  // Actualizar perfil
  async updateProfile(req, res) {
    try {
      const { full_name, diabetes_type, diagnosis_date, bio, avatar_url, glucose_enabled, current_password, new_password } = req.body;

      let hashedPassword = null;

      if (new_password) {
        const user = await userModel.findByEmail(req.user.email);
        const isValid = await userModel.verifyPassword(current_password || '', user.password);
        if (!isValid) {
          return res.status(400).json({ status: 'error', message: 'La contraseña actual es incorrecta' });
        }
        if (new_password.length < 6) {
          return res.status(400).json({ status: 'error', message: 'La nueva contraseña debe tener al menos 6 caracteres' });
        }
        const bcrypt = require('bcrypt');
        hashedPassword = await bcrypt.hash(new_password, 10);
      }

      const updatedUser = await userModel.update(req.user.id, {
        full_name, diabetes_type,
        diagnosis_date: diagnosis_date || null,
        bio, avatar_url,
        glucose_enabled: glucose_enabled !== undefined ? Boolean(glucose_enabled) : undefined,
        hashedPassword
      });

      res.json({ status: 'success', message: 'Perfil actualizado exitosamente', data: { user: updatedUser } });

    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      res.status(500).json({ status: 'error', message: 'Error al actualizar perfil' });
    }
  }
}

module.exports = new AuthController();
