const Product = require('../models/Product');
const User = require('../models/Users');
exports.createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// get All admins
exports.getAdmins = async (req, res) => {
    const admins = await User.find({ role: 'admin' });
    res.json(admins);
};


// super admin create which can manage admin and users 
exports.createAdmin = async (req, res) => {
    const { name, email, password } = req.body;
    const admin = new User({ name, email, password, role: 'admin' });
    await admin.save();
    res.status(200).json({ message: 'Admin created Successfully' });
};

// get All Users 
exports.getUsers = async (req, res) => {
    const users = await User.find({ role: 'user' });
    res.json({ users });
};