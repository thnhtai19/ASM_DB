const express = require('express');
const router = express.Router();
const orderController = require('../controllers/ordercontroller');
const  authenticateToken  = require('../helper/authMiddleware');

router.get('/',authenticateToken,orderController.getOrdersByBuyerId);

router.get('/statistics', authenticateToken, orderController.getOrderStatisticsByDate);



module.exports = router;
