const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'category' },
    stock: { type: Number, default: 0 },
    averageRating: { type: Number },
    ratingCount: { type: Number },
    image: [String],
}, { timestamps: true });

module.exports = mongoose.model('product', productSchema);