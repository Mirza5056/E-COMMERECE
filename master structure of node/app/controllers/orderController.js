const Order = require('../models/Order');
const User = require('../models/Users');
const Product = require('../models/Product');
const {orderSchema} = require('../validators/orderAddressValidator');
exports.createOrder = async (req, res) => {
    try {
        const {error} = orderSchema.validate(req.body);
        if(error) 
            return res.status(400).json({message : error.details[0].message});

        const { items, address } = req.body;
        let total = 0;
        for (let item of items) {
            const product = await Product.findById(item.productId);
            if (!product)
                return res.status(404).json({ message: 'Product Not Found.' });
            if (product.stock < item.quantity)
                return res.status(404).json({ message: `No enough stock available ${product.name}` });
            total += product.price * item.quantity;
        }

        const order = new Order({
            userId: req.user.id,
            items,
            totalAmount: total,
            address
        });
        await order.save();

        for (let item of items) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { stock: -item.quantity }
            });
        }
        res.status(200).json({ message: "Order Placed", orderId: order._id });
    } catch (err) {
        res.status(500).send("Server error");
    }
};



exports.getDetailsOfOrderPlaced = async (req, res) => {
    try {
        //console.log('hello');
        const orders = await Order.find().populate('userId', 'name email address').populate({
            path: 'items.productId',
            populate: {
                path: 'category',
                model: 'category',
                select: 'name'
            },
            select: 'name price category'
        })
        res.json(orders);
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const allowStatusToUpdate = ['pending', 'delivered', 'confirmed', 'shipped', 'cancelled'];
        if (!allowStatusToUpdate.includes(status))
            return res.status(400).json({ message: "Invalid Status" });

        const updateStatus = await Order.findByIdAndUpdate(orderId, { status }, { new: true }).
            populate('userId', 'name email').populate({
                path: 'items.productId',
                populate: { path: 'category', select: 'name' }
            });

        if (!updateStatus)
            return res.status(404).json({ message: "Order Not Found." });

        res.status(200).json({ message: 'Order updated', order: updateStatus });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}