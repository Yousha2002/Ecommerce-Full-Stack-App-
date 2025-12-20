
const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const { authenticate, authorize } = require('../middlewares/auth');


router.get('/', testimonialController.getFeaturedTestimonials);

router.post('/', authenticate, authorize('admin'), testimonialController.addTestimonial);

module.exports = router;