const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const  authenticateToken  = require('../helper/authMiddleware');

router.get('/',authenticateToken,orderController.getAllBuyersAndOrders);

router.post('/statistics', authenticateToken, orderController.getOrderStatisticsByDate);

router.put('/update',authenticateToken,orderController.updateOrderStatus);

module.exports = router;
