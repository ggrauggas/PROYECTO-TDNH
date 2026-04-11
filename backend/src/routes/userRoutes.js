const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/:id/profile', userController.getPublicProfile);
router.get('/:id/stats', authMiddleware.authenticate, userController.getStats);

module.exports = router;
