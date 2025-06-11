const Product = require('../models/Product');
const { idValidateForProduct } = require('../validators/productValidator');
exports.createProduct = async (req, res) => {
    try {
        const { name, price, description, category, stock, avg, count } = req.body;
        //if (!req.file) {
        //return res.status(400).json({ message: "Image is required." });
        //}
        const imageFile = req.files;
        const imagePath = imageFile.map(file => file.path);
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
        res.status(200).json({ message: "Product saved successfully", product });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};


exports.getProduct = async (req, res) => {
    try {
        const products = await Product.find().populate('category');
        res.json(products);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};


exports.updateProduct = async (req, res) => {
    //const { error } = idValidateForDelete.validate(req.body);
    //if (error) return res.status(400).json({ error: error.details[0].message });
    try {
        const { id,name, price, description, category, stock, avg, count } = req.body;
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
    const { error } = idValidateForProduct.validate(id);
    if (error) return res.status(400).json({ error: 'Invalid product ID' });
    try {
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};