const express = require('express');
const router = express.Router();
const { createCategory, getCategory, deleteCategory, updateCategory, getCatgeoryByIdAndProductDetail, getByCategoryId } = require('../controllers/categoryController');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');
const authorizeRole = require('../middleware/authorizeRule');
const validate = require('../middleware/validate');
const { categoryValidate } = require('../validators/categoryValidator');

// Only Admin and Super Admin will create Catgeory List...
router.post('/createCategory', validate(categoryValidate), upload.single('image'), authenticate, authorizeRole('admin', 'super-admin'), createCategory);
router.post('/updateCategory', authenticate, authorizeRole('admin', 'super-admin'), updateCategory);
router.delete('/deleteCategory/:id', authenticate, authorizeRole('admin', 'super-admin'), deleteCategory);


// And Users and See Catgeory List
router.get('/getCategory', getCategory);
router.get('/getById/:id', getByCategoryId);
router.get('/getByCategoryId/:id', getCatgeoryByIdAndProductDetail);
module.exports = router;