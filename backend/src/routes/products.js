const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const productValidation = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('categoryId').isInt({ min: 1 }).withMessage('Valid category is required')
];

router.post(
  '/',
  authenticate,
  authorize('admin'),
  upload.array('images', 5),
  productValidation,
  productController.createProduct
);

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  upload.array('images', 5),
  productValidation,
  productController.updateProduct
);

router.delete('/:id', authenticate, authorize('admin'), productController.deleteProduct);

router.get('/section/new-arrivals', productController.getNewArrivals);
router.get('/section/trending', productController.getTrendingProducts);
router.get('/section/best-selling', productController.getBestSelling);
router.get('/section/most-popular', productController.getMostPopular);
router.get('/section/featured', productController.getFeaturedProducts);
router.get('/section/hero-banner', productController.getHeroBannerProducts);

module.exports = router;