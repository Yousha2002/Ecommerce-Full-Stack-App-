const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { authenticate } = require('../middlewares/auth');


router.use(authenticate);

router.post('/', wishlistController.addToWishlist);
router.get('/', wishlistController.getWishlist);
router.get('/check/:productId', wishlistController.checkWishlist);
router.delete('/:id', wishlistController.removeFromWishlist);

module.exports = router;