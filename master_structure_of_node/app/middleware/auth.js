const User = require('../models/Users');
const jwt = require('jsonwebtoken');

// Checking if token is valid or not
exports.authenticate = async (req, res, next) => {
    const token = req.headers.authorization;   
    if (!token) return res.status(401).json({ message: 'Access denied' });
    try {
        //console.log("Code not coming here...");
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decode.id).select('-password');
        //console.log("Code will executed here...");
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid token.' });
    }
};

// Only Admin Can Access It...
exports.isAdmin = (req, res, next) => {
    if (req.user?.role === 'admin')
        return next();
    res.status(400).json({ message: 'Only Admin can access' });
};