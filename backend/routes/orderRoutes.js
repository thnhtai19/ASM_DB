const express = require('express');
const router = express.Router();
const orderController = require('../controllers/ordercontroller');

router.get('/', orderController.getOrdersByBuyerId);

router.get('/statistics', orderController.getOrderStatisticsByDate);



module.exports = router;
