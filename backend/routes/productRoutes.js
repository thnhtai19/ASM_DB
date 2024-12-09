const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const  authenticateToken  = require('../helper/authMiddleware');


router.post('/add',authenticateToken, productController.addProduct);


router.patch('/update',authenticateToken, productController.updateProduct);

router.delete('/delete',authenticateToken, productController.deleteProduct);

router.get('/list',authenticateToken, productController.getAllProducts);


module.exports = router;
