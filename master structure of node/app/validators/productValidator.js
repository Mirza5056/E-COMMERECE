const Joi = require('joi');
exports.productValidator = Joi.object({
    name: Joi.string().min(3).required(),
    price: Joi.number().required(),
    categoryId: Joi.number().required(),
    stock: Joi.number().required(),
    images: Joi.string().required()
});


exports.idValidateForProduct = Joi.string().required().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value))
        return helpers.error('any. valid');
    return value;
}, 'ObjectId Validation');