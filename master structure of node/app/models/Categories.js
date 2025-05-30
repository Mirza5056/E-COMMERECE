const mongoose = require('mongoose');
const categoriesSchema= new mongoose.Schema({
    name : String,
    description : String,
    createdAt : Date
});
module.export = mongoose.model('category',categoriesSchema);