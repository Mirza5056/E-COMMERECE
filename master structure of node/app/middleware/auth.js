const User = require ('../models/Users');
const jwt = require('jsonwebtoken');
exports.authenticate = async(req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token) return res.status(400).json({message : 'Access denied'});
    try
    {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await user.findById(decode.id).select('-password');
        next();
    }catch(err) {
        res.status(500).json({message : 'Something went wrong please try again later.'});
    }
};

exports.isAdmin=(req,res,next)=>{
    if(req.user?.role === 'admin') 
        return next();
    res.status(400).json({message : 'Only Admin can access'});
};