const Joi = require('joi');
const mongoose = require('mongoose');
exports.productValidator = Joi.object({
    name: Joi.string().min(3).required(),
    price: Joi.number().required(),
    description : Joi.string().required(),
    category: Joi.number().required(),
    stock: Joi.number().required(),
    image: Joi.string().required()
});


exports.idValidateForProduct = Joi.string().required().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value))
        return helpers.error('any. valid');
    return value;
}, 'ObjectId Validation');