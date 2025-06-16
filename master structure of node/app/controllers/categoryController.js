const Category = require('../models/Categories');
const Product = require('../models/Product');
const { idValidateForDelete, categoryValidate } = require('../validators/categoryValidator');
exports.createCategory = async (req, res) => {
    try {
        const { error } = categoryValidate.validate(req.body);
        if (error)
            return res.status(400).json({ message: error.details[0].message });
        const { name, description, status } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: "Image is required." });
        }
        const imageUrl = req.file.filename;
        const existingName = await Category.findOne({ name: req.body.name });
        if (existingName)
            return res.status(409).json({ success: false, message: 'Category Name already exists.' });
        const categories = new Category({
            name,
            description,
            image: imageUrl,
            status: status !== undefined ? status : true
        });
        await categories.save();
        res.status(200).json({ success: true, message: 'Category Have been added.' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};



exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description, status } = req.body;
    const { error } = idValidateForDelete.validate(id);
    if (error) return res.status(400).json({ error: 'Invalid Category Id' });
    const { errorValidator } = categoryValidate.validate(req.body);
    if (errorValidator)
        return res.status(400).json({ message: errorValidator.details[0].message });
    try {

        const updateData = { name, description, status };
        if (req.file)
            updateData.image = req.file.filename;
        const updated = await Category.findByIdAndUpdate(id, {
            ...updateData,
            status: status !== undefined ? status : true
        }, { new: true });
        if (!updated)
            return res.status(404).json({ message: 'Category not found' });
        res.status(200).json({ success: true, message: 'Updated successfully.' });
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
        const deleted = await Category.findById(id);
        if (!deleted)
            return res.status(404).json({ message: "Category Id Not Found." });

        await Product.deleteMany({ category: id });
        await Category.findByIdAndDelete(id);
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
        //const BASE_URL = `${req.portocol}://${req.get('192.168.26.146:8080')}`;
        const category = await Category.find();
        // const updateCategories = category.map(cat=>({
        //     ...cat._doc,
        //     image : `$`
        // }))
        res.status(200).json({ category });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};


exports.getCatgeoryByIdAndProductDetail = async (req, res) => {
    const id = req.params.id;
    const { error } = idValidateForDelete.validate(id);
    if (error) return res.status(400).json({ error: 'Invalid category ID' });
    try {
        const category = await Category.findById(id);
        if (!category)
            return res.status(404).json({ message: 'Category not found' });

        const product = await Product.find({ category: id });
        res.status(200).json({
            category,
            product
        })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getCategoryPagination = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // 1 page
        const rows = parseInt(req.query.rows) || 10; // 10 rows
        const skip = (page - 1) * rows;
        const total = await Category.countDocuments();
        const categories = await Category.find().skip(skip).limit(rows).sort({ createdAt: -1 });
        res.status(200).json({
            totalItems: total,
            totalPages: Math.ceil(total / rows),
            currentPage: page,
            pageSize: rows,
            data: categories
        })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}