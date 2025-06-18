const express = require('express');
const router = express.Router();
const { createOrder, getDetailsOfOrderPlaced, updateProduct } = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');
const authorizeRole = require('../middleware/authorizeRule');
const validate = require('../middleware/authorizeRule');
const { orderSchema } = require('../validators/orderAddressValidator');


// Only Admin and Super Admin Can see Orders List
router.get('/getOrder', authenticate, authorizeRole('admin', 'super-admin'), getDetailsOfOrderPlaced);
router.put('/updateStatus/:orderId/status', authenticate, authorizeRole('admin', 'super-admin'), updateProduct);


// Only Users can place order's.
router.post('/placeOrder', authenticate, authorizeRole('user'), createOrder);
module.exports = router;