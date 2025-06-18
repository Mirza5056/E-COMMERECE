const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
            required: true
        },
        quantity: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'],
        default: 'pending'
    },
    address: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        country: { type: String, required: true }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);