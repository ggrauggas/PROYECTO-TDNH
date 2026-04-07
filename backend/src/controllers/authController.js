const userModel = require('../models/userModel');
const jwtUtils = require('../utils/jwtUtils');

class AuthController {
  // Registro de nuevo usuario
  async register(req, res) {
    try {
      const { username, email, password, full_name, diabetes_type, diagnosis_date, bio } = req.body;

      // Verificar si el email ya existe
      const existingEmail = await userModel.findByEmail(email);
      if (existingEmail) {
        return res.status(400).json({
          status: 'error',
          message: 'El email ya está registrado'
        });
      }

      // Verificar si el username ya existe
      const existingUsername = await userModel.findByUsername(username);
      if (existingUsername) {
        return res.status(400).json({
          status: 'error',
          message: 'El nombre de usuario ya está en uso'
        });
      }

      // Crear usuario
      const newUser = await userModel.create({
        username,
        email,
        password,
        full_name,
        diabetes_type,
        diagnosis_date,
        bio
      });

      // Generar token
      const token = jwtUtils.generateToken({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role || 'user'
      });

      res.status(201).json({
        status: 'success',
        message: 'Usuario registrado exitosamente',
        data: {
          user: newUser,
          token
        }
      });

    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error al registrar usuario'
      });
    }
  }

  // Login de usuario
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Buscar usuario por email
      const user = await userModel.findByEmail(email);
      
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Email o contraseña incorrectos'
        });
      }

      // Verificar contraseña
      const isValidPassword = await userModel.verifyPassword(password, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({
          status: 'error',
          message: 'Email o contraseña incorrectos'
        });
      }

      // Actualizar último login
      await userModel.updateLastLogin(user.id);

      // Generar token
      const token = jwtUtils.generateToken({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      });

      // No enviar la contraseña en la respuesta
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        status: 'success',
        message: 'Login exitoso',
        data: {
          user: userWithoutPassword,
          token
        }
      });

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error al iniciar sesión'
      });
    }
  }

  // Obtener perfil del usuario actual
  async getProfile(req, res) {
    try {
      const user = await userModel.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'Usuario no encontrado'
        });
      }

      res.json({
        status: 'success',
        data: { user }
      });

    } catch (error) {
      console.error('Error al obtener perfil:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error al obtener perfil'
      });
    }
  }

  // Actualizar perfil
  async updateProfile(req, res) {
    try {
      const { full_name, diabetes_type, diagnosis_date, bio, avatar_url } = req.body;

      const updatedUser = await userModel.update(req.user.id, {
        full_name,
        diabetes_type,
        diagnosis_date,
        bio,
        avatar_url
      });

      res.json({
        status: 'success',
        message: 'Perfil actualizado exitosamente',
        data: { user: updatedUser }
      });

    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error al actualizar perfil'
      });
    }
  }
}

module.exports = new AuthController();