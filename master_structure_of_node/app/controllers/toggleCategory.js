const Categories = require("../models/Categories");

exports.toggleCategory=async(req, res)=>{
    const {id} = req.params;
    try
    {
        const category = await Categories.findById(id);
        if(!category) 
            return res.status(404).json({message : 'category not found.'});

        category.status = !category.status;
        await category.save();
        res.status(200).json({ message: `Category ${category.status ? 'active' : 'inactive'}.`, category });
    }catch(err) {
        res.status(500).json({message : err.message});
    }
}