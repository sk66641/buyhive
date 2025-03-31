const { Order } = require('../model/Order')

exports.fetchOrdersByUser = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.find({ user: id });
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json(error);
    }
}

exports.createOrder = async (req, res) => {
    const order = new Order(req.body);
    try {
        const getOrder = await order.save();
        // const finalOrder = await getCart.populate('product');
        res.status(201).json(getOrder);
    } catch (error) {
        res.status(400).json(error);
    }
}

exports.deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findByIdAndDelete(id);
        // const finalResponse = await response.populate('product');
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json(error);
    }
}

exports.updateOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findByIdAndUpdate(id, req.body, { new: true });
        // const finalResponse = await response.populate('product');
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json(error);
    }
}

exports.fetchAllOrders = async (req, res) => {
    let query = Order.find({ deleted: { $ne: true } });

    if (req.query._sort) {
        const sortBy = req.query._sort[0] === "-" ? req.query._sort.slice(1) : req.query._sort;
        const order = req.query._sort === "rating" ? -1 : req.query._sort[0] === '-' ? -1 : 1;
        console.log(sortBy, order)
        query = query.sort({ [sortBy]: order });
    }
    if (req.query.brand) {
        query = query.find({ brand: req.query.brand });
    }
    if (req.query.category) {
        query = query.find({ category: req.query.category });
    }

    const totalDocs = await query.clone().countDocuments().exec();

    if (req.query._page && req.query._per_page) {
        const pageSize = req.query._per_page;
        const page = req.query._page;
        query = query.skip(pageSize * (page - 1)).limit(pageSize);
    }
    try {
        const orders = await query.exec();

        res.status(200).send({ items: totalDocs, data: orders });
    } catch (error) {
        res.status(400).json(error);
    }
}
