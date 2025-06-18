const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin, authenticate } = require('../middleware/auth');
const { getUsers, getAdmins, createAdmin } = require('../controllers/adminController');
const authorizeRole = require('../middleware/authorizeRule');

router.post('/products', authenticate, isAdmin, adminController.createProduct);

// Only super admin can create admin and view
router.get('/admins', authenticate, authorizeRole('super-admin'), getAdmins);
router.post('/admins', authenticate, authorizeRole('super-admin'), createAdmin);

// admin and super admin can view users
router.get('/users', authenticate, authorizeRole('admin', 'super-admin'), getUsers);


module.exports = router;