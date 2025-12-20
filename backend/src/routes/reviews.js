const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticate, authorize } = require('../middlewares/auth');

const reviewValidation = [
  body('productId').isInt({ min: 1 }).withMessage('Valid product ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').notEmpty().withMessage('Review title is required'),
  body('comment').notEmpty().withMessage('Review comment is required')
];

router.post('/', authenticate, reviewValidation, reviewController.addReview);
router.get('/user', authenticate, reviewController.getUserReviews);
router.get('/product/:productId', reviewController.getProductReviews);
router.put('/:id', authenticate, reviewValidation, reviewController.updateReview);
router.delete('/:id', authenticate, reviewController.deleteReview);

router.get('/admin/all', authenticate, authorize('admin'), reviewController.getAllReviews);
router.put('/admin/:id/verify', authenticate, authorize('admin'), reviewController.toggleReviewVerification);
router.get('/testimonials', reviewController.getApprovedTestimonials);
module.exports = router;