const Joi = require('joi');
const mongoose = require('mongoose');
exports.productValidator = Joi.object({
    name: Joi.string().min(3).required().messages({
        'string.empty': 'Name cannot be empty!',
        'string.min': 'Name must be at least 3 characters long.',
        'any.required': 'Name is required.'
    }),
    price: Joi.number().min(0.01).required().messages({
        'number.base': 'Price must be a number.',
        'number.min': 'Price must be greater than 0.',
        'any.required': 'Price is required.'
    }),
    description: Joi.string().min(5).required().messages({
        'string.empty': 'Description cannot be empty!',
        'string.min': 'Description must be at least 5 characters long.',
        'any.required': 'Description is required.'
    }),
    category: Joi.string().required().messages({
        'string.empty': 'Category is required.',
        'any.required': 'Category is required.'
    }),
    stock: Joi.number().integer().min(0).required().messages({
        'number.base': 'Stock must be a number.',
        'number.min': 'Stock cannot be negative.',
        'any.required': 'Stock is required.'
    }),
    image: Joi.any(), // optional, handled via multer not req.body
    avg: Joi.number().optional(),
    count: Joi.number().optional()
});


exports.idValidateForProduct = Joi.string().required().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value))
        return helpers.error('any. valid');
    return value;
}, 'ObjectId Validation');