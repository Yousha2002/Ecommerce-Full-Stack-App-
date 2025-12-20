
const express = require('express');
const router = express.Router();
const seasonalController = require('../controllers/seasonalController');

router.get('/collections', seasonalController.getAllCollections);
router.get('/collection/:collection', seasonalController.getSeasonalCollections);

module.exports = router;