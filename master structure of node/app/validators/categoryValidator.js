const Joi = require('joi');
const mongoose = require('mongoose');
exports.categoryValidate = Joi.object({
    name: Joi.string().min(3).required().messages({
        'string.empty' : 'Name cannot be empty!',
        'string.min' : 'Name must me at least 3 character long.',
        'any.required': 'Name is required.'
    }),
    description: Joi.string().required().messages({
        'string.empty' : 'description cannot be empty!',
        'string.min' : 'description must me at least 3 character long.',
        'any.required': 'description is required.'
    }),
    image: Joi.any(),
    status : Joi.optional()
});

exports.idValidateForDelete = Joi.string().required().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value))
        return helpers.error('any. valid');
    return value;
}, 'ObjectId Validation');