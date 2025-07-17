const { Brand } = require('../model/Brand')

exports.fetchAllBrands = async (req, res) => {
    try {
        const brands = await Brand.find({});
        res.status(200).json(brands);
    } catch (error) {
        console.log("Error fetching brands:", error);
        res.status(400).json({ message: 'Error fetching brands' });
    }
}

exports.createBrand = async (req, res) => {
    const brand = new Brand(req.body);
    try {
        const response = await brand.save();
        res.status(201).json(response);
    } catch (error) {
        console.log("Error creating brand:", error);
        res.status(400).json({ message: 'Error creating brand' });
    }
}