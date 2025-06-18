const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, unique: true, require: true },
    role: { type: String, enum: ['user', 'admin', 'super-admin'], default: "user" },
    otp: { type: String, default : null },
    otpExpiry: { type: Date, default : null },
}, { timestamps: true });

module.exports = mongoose.model('user', userSchema);