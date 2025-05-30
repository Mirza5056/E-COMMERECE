const Product = require('../models/Product');
exports.createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};