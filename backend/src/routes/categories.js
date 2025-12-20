const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticate, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const categoryValidation = [
  body('name').notEmpty().withMessage('Category name is required')
];

router.post(
  '/',
  authenticate,
  authorize('admin'),
  upload.single('image'),
  categoryValidation,
  categoryController.createCategory
);

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.get('/:id/products', categoryController.getProductsByCategory);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  upload.single('image'),
  categoryValidation,
  categoryController.updateCategory
);

router.delete('/:id', authenticate, authorize('admin'), categoryController.deleteCategory);

module.exports = router;