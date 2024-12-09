const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/add', productController.addProduct);


router.patch('/update', productController.updateProduct);

router.delete('/delete', productController.deleteProduct);

router.get('/list', productController.getAllProducts);



module.exports = router;
