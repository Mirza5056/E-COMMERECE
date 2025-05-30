const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) res.status(400).json({ message: 'User have already exists' });
        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashPassword, role });
        await user.save();
        res.status(200).json({ message: 'User regiter successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email,password);
        const user = await User.findOne({ email });
        if (!user)
            res.status(400).json({ message: "Invalid email or password." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            res.status(400).json({ message: "Invalid email or password." });

        console.log('upper code is running smooth...');
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SCERET, { expiresIn: '1d' });
        console.log('Code not coming here');
        res.status(200).json({ token });
        console.log('Code have been executed.');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};