const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { authenticate } = require('../middleware/auth');
const authorizeRole = require('../middleware/authorizeRule');
const { createProduct, getProduct, getByProductId, updateProduct, deleteProduct } = require('../controllers/productController');
const { validate } = require('../models/Product');
const { productValidator } = require('../validators/productValidator');

// Only Admin and Super Admin will create Product... They have to provide JWT_TOKEN
router.post('/createProduct', authenticate, authorizeRole('admin', 'super-admin'), upload.array('image', 5), createProduct);
router.post('/updateProduct', authenticate, authorizeRole('admin', 'super-admin'), upload.array('image', 5), updateProduct);
router.delete('/deleteProduct/:id', authenticate, authorizeRole('admin','super-admin'), upload.array('image',5), deleteProduct);


// And Users and See Products
router.get('/getProduct', getProduct);
router.get('/getByProductId/:id', getByProductId);
module.exports = router;