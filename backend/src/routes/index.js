const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/admin', require('./admin'));
router.use('/categories', require('./categories'));
router.use('/products', require('./products'));
router.use('/cart', require('./cart'));
router.use('/users', require('./users'));
router.use('/wishlist', require('./wishlist'));
router.use('/reviews', require('./reviews'));
router.use('/hero-banners', require('./heroBanner'));
router.use('/flash-sales', require('./flashSales'));
router.use('/coming-soon', require('./comingSoon'));

module.exports = router;