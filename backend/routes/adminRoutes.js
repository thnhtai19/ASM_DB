const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticateToken = require('../helper/authMiddleware');

router.get('/',authenticateToken, adminController.getNumberProductSoldbyId);

router.get('/rating',authenticateToken, adminController.getRating);


router.post('/login', adminController.loginAdmin);

router.post('/logout', adminController.logoutAdmin);

router.get('/getAllStoreRatings',authenticateToken, adminController.getAllStoreRatings);

module.exports = router;

