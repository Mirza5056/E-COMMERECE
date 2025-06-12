const Joi = require('joi');
const mongoose = require('mongoose');
exports.categoryValidate = Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string().required(),
    image: Joi.string().required()
});

exports.idValidateForDelete = Joi.string().required().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value))
        return helpers.error('any. valid');
    return value;
}, 'ObjectId Validation');