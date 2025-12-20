const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/dashboard', authenticate, authorize('admin'), adminController.getDashboardStats);

module.exports = router;