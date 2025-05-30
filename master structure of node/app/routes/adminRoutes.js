const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin, authenticate } = require('../middleware/auth');
router.post('/products', authenticate, isAdmin, adminController.createProduct);
module.exports = router;