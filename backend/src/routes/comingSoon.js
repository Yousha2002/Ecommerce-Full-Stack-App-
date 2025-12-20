const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const comingSoonController = require('../controllers/comingSoonController');
const { authenticate, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const comingSoonValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('displayOrder').optional().isInt().withMessage('Display order must be a number'),
  body('startDate').optional().isISO8601().withMessage('Valid start date is required'),
  body('endDate').optional().isISO8601().withMessage('Valid end date is required')
];

router.get('/active', comingSoonController.getActiveComingSoon);
router.get('/:id', comingSoonController.getComingSoonById);


router.post(
  '/',
  authenticate,
  authorize('admin'),
  upload.single('image'),
  comingSoonValidation,
  comingSoonController.createComingSoon
);

router.get('/', authenticate, authorize('admin'), comingSoonController.getAllComingSoon);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  upload.single('image'),
  comingSoonValidation,
  comingSoonController.updateComingSoon
);

router.delete('/:id', authenticate, authorize('admin'), comingSoonController.deleteComingSoon);

module.exports = router;