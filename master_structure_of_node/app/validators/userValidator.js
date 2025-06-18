const joi = require('joi');
exports.registerSchema = joi.object({
    name: joi.string().min(3).max(10).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    role: joi.string().valid('user', 'super-admin', 'admin').default('user')
});

exports.loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
});

exports.forgetSchema = joi.object({
    email: joi.string().email().required()
});

exports.resetPassword = joi.object({
    newPassword : joi.string().min(6).required(),
    confirmPassword : joi.ref('newPassword')
});