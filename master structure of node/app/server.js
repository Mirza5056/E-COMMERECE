const os = require('os');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const routesPath = require('./startup/routes');
dotenv.config();
//const port = process.env.PORT || 8080;
const app = express();
routesPath(app);
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to Mongoodb');
    }).catch((err) => {
        console.error(err);
    });
///app.listen(port, (err) => {
// if (err) console.log('unable to connect try after some time.');
//console.log(`server running on port ${port}`);
//});

const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
    const ip = getLocalIp();
    console.log(`Server is running at http://${ip}:${PORT}`);
});


function getLocalIp() {
    const interfaces = os.networkInterfaces();
    for (let name of Object.keys(interfaces)) {
        for (let iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}