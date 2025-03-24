const { Product } = require('../model/Product')

exports.createProduct = async (req, res) => {
    const product = new Product(req.body);
    try {

        const response = await product.save();
        res.status(201).json(response);
    } catch (error) {
        res.status(400).json(error);
    }
}