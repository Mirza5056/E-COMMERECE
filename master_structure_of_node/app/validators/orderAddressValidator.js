const Joi = require('joi');
const mongoose = require('mongoose');
const addressValidator = Joi.object({
    fullName: Joi.string().min(3).max(20).required(),
    phone: Joi.string().max(10).required(),
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    pincode: Joi.string().pattern(/^[0-9]{6}$/).max(6).required(),
    country: Joi.string().required()
});

exports.orderSchema=Joi.object({
    items : Joi.array().items(
        Joi.object({
            productId : Joi.string().hex().length(24).required(),
            quantity : Joi.number().integer().min(1).required()
        })
    ).min(1).required(),
    address : addressValidator.required()
});