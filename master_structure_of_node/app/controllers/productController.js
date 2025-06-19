const Product = require('../models/Product');
const { idValidateForProduct, productValidator } = require('../validators/productValidator');
exports.createProduct = async (req, res) => {
    try {
        const { error } = productValidator.validate(req.body);
        if (error)
            return res.status(400).json({ message: error.details[0].message });
        const { name, price, description, category, stock, avg, count } = req.body;
        if (!req.files || req.files.length === 0)
            return res.status(400).json({ message: "Image is required." });
        //const imageFile = req.files;
        const imagePath = req.files.map(file => file.path);
        const product = new Product({
            name,
            price,
            description,
            category,
            stock,
            averageRating: avg,
            ratingCount: count,
            image: imagePath
        });
        await product.save();
        res.status(200).json({ message: "Product saved successfully" });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};


exports.getProduct = async (req, res) => {
    try {
        //const host = req.protocol + '://' + req.get('host');
        const products = await Product.find().populate('category');
        // const imageUrl = products.map(cat => ({
        //     ...cat.toObject(),
        //     image: `${host}/uploads/${cat.image}`
        // }))
        res.status(200).json({ products });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};


exports.updateProduct = async (req, res) => {
    //const { error } = idValidateForDelete.validate(req.body);
    //if (error) return res.status(400).json({ error: error.details[0].message });
    try {
        const { id, name, price, description, category, stock, avg, count } = req.body;
        const imageFile = req.files;
        const imagePath = imageFile.map(file => file.path);
        const updated = await Product.findByIdAndUpdate(id, {
            name,
            price,
            description,
            category,
            stock,
            averageRating: avg,
            ratingCount: count,
            image: imagePath
        }, { new: true });
        if (!updated) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json({ message: 'Updated successfully.', updated });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    const id = req.params.id;
    const { error } = idValidateForProduct.validate(id);
    if (error) return res.status(400).json({ error: 'Invalid Product Id' });
    try {
        const deleted = await Product.findByIdAndDelete(id);
        if (!deleted)
            return res.status(404).json({ message: "Product Id Not Found." });
        res.status(200).json({ message: "successfully deleted." });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};


exports.getByProductId = async (req, res) => {
    const id = req.params.id;
    //const host = req.protocol + "://"+req.get('host');
    const { error } = idValidateForProduct.validate(id);
    if (error) return res.status(400).json({ error: 'Invalid product ID' });
    try {
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        // const productImage = {
        //     ...product.toObject(),
        //     image : `${host}/uploads/${product.image}`
        // }
        res.status(200).json({product});
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};