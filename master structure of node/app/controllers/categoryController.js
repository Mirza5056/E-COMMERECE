const Category = require('../models/Categories');
const { idValidateForDelete } = require('../validators/categoryValidator');
//const categoryValidator = require('../validators/categoryValidator');
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        console.log(name,description);
        if (!req.file) {
            return res.status(400).json({ message: "Image is required." });
        }
        const imageUrl = req.file.filename;
        const categories = new Category({
            name,
            description,
            image: imageUrl
        });
        await categories.save();
        res.status(200).json({ message: 'Category Have been added.' });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

exports.updateCategory = async (req, res) => {
    const { error } = idValidateForDelete.validate(req.body);
    //if (error) return res.status(400).json({ error: error.details[0].message });
    const { id, name, description } = req.body;
    try {
        const updated = await Category.findByIdAndUpdate(id, { name, description }, { new: true });
        if (!updated) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json({ message: 'Updated successfully.', updated });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

exports.deleteCategory = async (req, res) => {
    const id = req.params.id;
    //console.log(id);
    const { error } = idValidateForDelete.validate(id);
    if (error) return res.status(400).json({ error: 'Invalid Category Id' });
    try {
        const deleted = await Category.findByIdAndDelete(id);
        if (!deleted)
            return res.status(404).json({ message: "Category Id Not Found." });
        res.status(200).json({ message: "successfully deleted." });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};


exports.getByCategoryId = async (req, res) => {
    const id = req.params.id;
    const { error } = idValidateForDelete.validate(id);
    if (error) return res.status(400).json({ error: 'Invalid category ID' });
    try {
        const category = await Category.findById(id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json(category);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

exports.getCategory = async (req, res) => {
    try {
        const category = await Category.find();
        res.json(category);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};