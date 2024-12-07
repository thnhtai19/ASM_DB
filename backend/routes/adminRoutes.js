const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/', adminController.getNumberProductSoldbyId);

router.get('/rating', adminController.getRating);


module.exports = router;
