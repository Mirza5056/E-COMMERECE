const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'category' },
    stock: { type: Number, default: 0 },
    images: { type: String },
    ratings: {
        avg: { type: Number },
        count: { type: Number }
    },
    createdAt: { type: Date },
    updatedAt: { type: Date }
});

module.exports = mongoose.model('product', productSchema);