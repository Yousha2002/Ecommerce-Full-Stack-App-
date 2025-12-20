const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const flashSaleController = require('../controllers/flashSaleController');
const { authenticate, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const flashSaleValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('discountPercentage').isInt({ min: 1, max: 100 }).withMessage('Valid discount percentage (1-100) is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('displayOrder').optional().isInt().withMessage('Display order must be a number')
];


router.get('/active', flashSaleController.getActiveFlashSales);
router.get('/:id', flashSaleController.getFlashSaleById);
router.get('/code/:code', flashSaleController.getFlashSaleByCode);


router.post(
  '/',
  authenticate,
  authorize('admin'),
  upload.single('image'),
  flashSaleValidation,
  flashSaleController.createFlashSale
);

router.get('/', authenticate, authorize('admin'), flashSaleController.getAllFlashSales);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  upload.single('image'),
  flashSaleValidation,
  flashSaleController.updateFlashSale
);

router.delete('/:id', authenticate, authorize('admin'), flashSaleController.deleteFlashSale);

module.exports = router;