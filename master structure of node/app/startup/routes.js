const express = require('express');
const adminRoutes = require('../routes/adminRoutes');
const userRoutes = require('../routes/userRoutes');
// more routes will come here 
// user routes...
module.exports = function (app) {
    app.use(express.json());
    app.use('/admin', adminRoutes);
    app.use('/users', userRoutes);
    app.use('/',adminRoutes);
};