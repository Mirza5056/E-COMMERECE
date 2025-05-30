const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, unique: true, require: true },
    role: { type: String, enum: ['user', 'admin'], default: "user" },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zip: { type: String },
        country: { type: String }
    }
}, { timestamps: true });

module.exports = mongoose.model('user', userSchema);