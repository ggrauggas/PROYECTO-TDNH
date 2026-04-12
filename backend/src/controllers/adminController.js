const userModel = require('../models/userModel');
const { pool } = require('../db/config/database');
const bcrypt = require('bcrypt');

class AdminController {
  async getUsers(req, res) {
    try {
      const users = await userModel.findAll();
      res.json({ status: 'success', data: { users } });
    } catch (error) {
      console.error('Error obteniendo usuarios (admin):', error);
      res.status(500).json({ status: 'error', message: 'Error al obtener los usuarios' });
    }
  }

  async updateUser(req, res) {
    try {
      const id = parseInt(req.params.id);

      // Un admin no puede bloquearse ni quitarse el rol a sí mismo
      if (id === req.user.id && req.body.is_active === false) {
        return res.status(400).json({ status: 'error', message: 'No puedes bloquearte a ti mismo' });
      }
      if (id === req.user.id && req.body.role === 'user') {
        return res.status(400).json({ status: 'error', message: 'No puedes quitarte el rol de administrador' });
      }

      const isBlocking = req.body.is_active === false;

      // Hash de contraseña si se envía
      let hashedPassword = null;
      if (req.body.password) {
        hashedPassword = await bcrypt.hash(req.body.password, 10);
      }

      if (isBlocking) {
        // Bloquear + borrar publicaciones (y sus comentarios por CASCADE) en una transacción
        const client = await pool.connect();
        try {
          await client.query('BEGIN');
          await client.query(
            `UPDATE posts SET is_deleted = true, deleted_by = 'admin', updated_at = CURRENT_TIMESTAMP
             WHERE user_id = $1 AND is_deleted = false`,
            [id]
          );
          const result = await client.query(
            `UPDATE users
             SET full_name     = COALESCE($1, full_name),
                 username      = COALESCE($2, username),
                 email         = COALESCE($3, email),
                 diabetes_type = COALESCE($4, diabetes_type),
                 bio           = COALESCE($5, bio),
                 role          = COALESCE($6, role),
                 is_active     = false,
                 password      = COALESCE($8, password),
                 updated_at    = CURRENT_TIMESTAMP
             WHERE id = $7
             RETURNING id, username, email, full_name, diabetes_type, bio, role, is_active, created_at`,
            [
              req.body.full_name   ?? null,
              req.body.username    ?? null,
              req.body.email       ?? null,
              req.body.diabetes_type ?? null,
              req.body.bio         ?? null,
              req.body.role        ?? null,
              id,
              hashedPassword
            ]
          );
          await client.query('COMMIT');
          const updated = result.rows[0];
          if (!updated) {
            return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
          }
          return res.json({ status: 'success', data: { user: updated } });
        } catch (err) {
          await client.query('ROLLBACK');
          throw err;
        } finally {
          client.release();
        }
      }

      const updated = await userModel.adminUpdate(id, { ...req.body, hashedPassword });
      if (!updated) {
        return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
      }
      res.json({ status: 'success', data: { user: updated } });
    } catch (error) {
      console.error('Error actualizando usuario (admin):', error);
      res.status(500).json({ status: 'error', message: 'Error al actualizar el usuario' });
    }
  }

  async deleteUser(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (id === req.user.id) {
        return res.status(400).json({ status: 'error', message: 'No puedes eliminarte a ti mismo' });
      }
      await userModel.adminDelete(id);
      res.json({ status: 'success', message: 'Usuario eliminado correctamente' });
    } catch (error) {
      console.error('Error eliminando usuario (admin):', error);
      res.status(500).json({ status: 'error', message: 'Error al eliminar el usuario' });
    }
  }
}

module.exports = new AdminController();
