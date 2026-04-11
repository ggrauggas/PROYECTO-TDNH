const userModel = require('../models/userModel');

class UserController {
  async getPublicProfile(req, res) {
    try {
      const id = parseInt(req.params.id);
      const profile = await userModel.getPublicProfile(id);
      if (!profile) {
        return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
      }
      res.json({ status: 'success', data: { user: profile } });
    } catch (error) {
      console.error('Error al obtener perfil público:', error);
      res.status(500).json({ status: 'error', message: 'Error al obtener el perfil' });
    }
  }

  async getStats(req, res) {
    try {
      const userId = parseInt(req.params.id);

      if (req.user.id !== userId) {
        return res.status(403).json({
          status: 'error',
          message: 'No autorizado'
        });
      }

      const stats = await userModel.getStats(userId);

      res.json({
        status: 'success',
        data: { stats }
      });
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error al obtener las estadísticas'
      });
    }
  }
}

module.exports = new UserController();
