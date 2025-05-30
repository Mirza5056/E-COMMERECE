const mongoose = require('mongoose');
const {Schema} = mongoose;
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: Number,
    categoryId: {type : Schema.Types.ObjectId, ref : 'category'},
    images: [String],
    stock: Number,
    ratings: {
        avg: Number,
        count: Number
    },
    createdAt: Date,
    updatedAt: Date
});

module.exports = mongoose.model('product', productSchema);