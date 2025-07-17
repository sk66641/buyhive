const { Category } = require('../model/Category')

exports.fetchAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json(categories);
    } catch (error) {
        console.log("Error fetching categories:", error);
        res.status(400).json({ message: 'Error fetching categories' });
    }
}

exports.createCategory = async (req, res) => {
    const category = new Category(req.body);
    try {
        const response = await category.save();
        res.status(201).json(response);
    } catch (error) {
        console.log("Error creating category:", error);
        res.status(400).json({ message: 'Error creating category' });
    }
}