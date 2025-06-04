const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: '../uploads' });
const { authenticate } = require('../middleware/auth');
const authorizeRole = require('../middleware/authorizeRule');
const { createProduct, getProduct } = require('../controllers/productController');

// Only Admin and Super Admin will create Product...
router.post('/createProduct', authenticate, authorizeRole('admin', 'super-admin'), upload.single('image'), createProduct);
// And Users and See Products
router.post('/getProduct', getProduct);

module.exports = router;