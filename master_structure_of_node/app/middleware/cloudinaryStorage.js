const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'uploads',
        allowed_formats: ['jpg', 'jpeg', 'png'],
    },
});

module.exports = storage;