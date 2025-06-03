const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const passwordController = require('../controllers/passwordReset');
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/forget-password', passwordController.forgetPassword);
router.post('/reset-password', passwordController.resetPassword);
module.exports = router;