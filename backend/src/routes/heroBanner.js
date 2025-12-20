
const express = require('express');
const router = express.Router();
const heroBannerController = require('../controllers/heroBannerController');
const { authenticate, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');


router.get('/active', heroBannerController.getActiveHeroBanners);


router.get('/admin', authenticate, authorize('admin'), heroBannerController.getAdminHeroBanners);
router.post(
  '/',
  authenticate,
  authorize('admin'),
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'mobileImage', maxCount: 1 }
  ]),
  heroBannerController.createHeroBanner
);

router.get('/:id', authenticate, authorize('admin'), heroBannerController.getHeroBannerById);
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'mobileImage', maxCount: 1 }
  ]),
  heroBannerController.updateHeroBanner
);
router.delete('/:id', authenticate, authorize('admin'), heroBannerController.deleteHeroBanner);

module.exports = router;