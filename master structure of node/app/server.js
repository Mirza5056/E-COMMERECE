const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const routesPath = require('./startup/routes');
dotenv.config();
const port = process.env.PORT || 8080;
const app = express();
routesPath(app);
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to Mongoodb');
    }).catch((err) => {
        console.error(err);
    });
app.listen(port, (err) => {
    if (err) console.log('unable to connect try after some time.');
    console.log(`server running on port ${port}`);
});