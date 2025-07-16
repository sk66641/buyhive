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

exports.fetchAllProducts = async (req, res) => {
    let query;
    if (req?.user?.role === 'admin') {
        query = Product.find();
        console.log("i ran")
    } else {
        query = Product.find({ deleted: { $ne: true } });
    }

    if (req.query._sort) {
        const sortBy = req.query._sort[0] === "-" ? req.query._sort.slice(1) : req.query._sort;
        const order = req.query._sort === "rating" ? -1 : req.query._sort[0] === '-' ? -1 : 1;
        console.log(sortBy, order)
        query = query.sort({ [sortBy]: order });
    }

    if (req.query.brand) {
        query = query.find({ brand: { $in: req.query.brand.split(',') } });
    }
    if (req.query.category) {
        query = query.find({ category: { $in: req.query.category.split(',') } });
    }

    const totalDocs = await query.clone().countDocuments().exec();

    if (req.query._page && req.query._per_page) {
        const pageSize = req.query._per_page;
        const page = req.query._page;
        query = query.skip(pageSize * (page - 1)).limit(pageSize);
    }
    try {
        const products = await query.exec();
        res.status(200).send({ items: totalDocs, data: products });
    } catch (error) {
        res.status(400).json(error);
    }
}

exports.fetchProductById = async (req, res) => {
    const { id } = req.params;
    try {
        let query;
        if (req?.user?.role === 'admin') {
            query = Product.findById(id);
        } else {
            query = Product.findOne({ _id: id, deleted: { $ne: true } });
        }
        const product = await query.exec();
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json(error);
    }
}

exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json(error);
    }
}

// ? So many questiongs:
// should i put package-lock.json file in .gitignore
// why exec()?
// why query.clone()
// put and patch
// send and json