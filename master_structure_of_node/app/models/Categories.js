const mongoose = require('mongoose');
const categoriesSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String, required : true },
    status : {type : Boolean, default : true}
}, { timestamps: true });
module.exports = mongoose.model('category', categoriesSchema);