const express = require('express');
const adminRoutes = require('../routes/adminRoutes');
const userRoutes = require('../routes/userRoutes');
const productRoutes = require('../routes/productRoutes');
const categoryRoutes = require('../routes/categoryRoutes');
const orderRoutes = require('../routes/orderRoutes');
const cors = require('cors');
// more routes will come here 
// user routes...
module.exports = function (app) {
    app.use(cors({
        origin: "http://localhost:3000",
        credentials: true
    }));
    app.use(express.json());
    app.use('/admin', adminRoutes);
    app.use('/users', userRoutes);
    app.use('/product', productRoutes);
    app.use('/category', categoryRoutes);
    app.use('/orders', orderRoutes);
};