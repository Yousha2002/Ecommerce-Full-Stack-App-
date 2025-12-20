const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/', authenticate, authorize('admin'), userController.getAllUsers);
router.get('/:id', authenticate, authorize('admin'), userController.getUserById);
router.put('/:id/status', authenticate, authorize('admin'), userController.updateUserStatus);
router.delete('/:id', authenticate, authorize('admin'), userController.deleteUser);

module.exports = router;