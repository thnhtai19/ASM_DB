const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const  authenticateToken  = require('../helper/authMiddleware');

router.get('/',authenticateToken,orderController.getAllBuyersAndOrders);

router.get('/statistics', authenticateToken, orderController.getOrderStatisticsByDate);



module.exports = router;
