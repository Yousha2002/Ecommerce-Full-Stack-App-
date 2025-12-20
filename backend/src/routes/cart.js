const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticate } = require('../middlewares/auth');

const cartValidation = [
  body('productId').isInt({ min: 1 }).withMessage('Valid product ID is required'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1')
  
];

router.get('/', authenticate, cartController.getCart);
router.post('/', authenticate, cartValidation, cartController.addToCart);
router.put('/:id', authenticate, cartController.updateCartItem);
router.delete('/:id', authenticate, cartController.removeFromCart);
router.delete('/', authenticate, cartController.clearCart);

module.exports = router;