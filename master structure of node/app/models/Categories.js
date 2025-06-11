const mongoose = require('mongoose');
const categoriesSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String }
}, { timestamps: true });
module.exports = mongoose.model('category', categoriesSchema);