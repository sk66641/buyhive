const SendmailTransport = require('nodemailer/lib/sendmail-transport');
const { Order } = require('../model/Order');
const { User } = require('../model/User');
const { sendMail, invoiceTemplate } = require('../services/common');
const { Product } = require('../model/Product');

exports.fetchOrdersByUser = async (req, res) => {
    const { id } = req.user;
    try {
        const orders = await Order.find({ user: id }).sort({ createdAt: -1 });
        res.status(201).json(orders);
    } catch (error) {
        console.error("Error fetching orders by user:", error);
        res.status(400).json({ message: 'Error fetching orders' });
    }
}

exports.createOrder = async (req, res) => {
    try {
        const order = new Order(req.body);

        // Checking stock before updating
        for (let item of order.items) {
            const product = await Product.findById(item.product.id);
            if (product.deleted) {
                return res.status(400).json({ message: 'Product deleted' });
            }
            if (!(product.stock > 0)) {
                return res.status(400).json({ message: 'Product out of stock' });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: 'Insufficient stock for product' });
            }
        }

        // Updating stock after validation
        for (let item of order.items) {
            await Product.findByIdAndUpdate(item.product.id, { $inc: { stock: -1 * item.quantity } });
        }

        const getOrder = await order.save();
        const user = await User.findById(getOrder.user);

        const subject = "Order Confirmation";
        const html = invoiceTemplate(getOrder);

        sendMail(user.email, subject, html);
        res.status(201).json(getOrder);
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(400).json({ message: 'Error creating order' });
    }
}

exports.deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        await Order.findByIdAndDelete(id);
        res.status(200).json({ id });
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(400).json({ message: 'Error deleting order' });
    }
}

exports.updateOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findByIdAndUpdate(id, req.body, { new: true });
        res.status(201).json(order);
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(400).json({ message: 'Error updating order' });
    }
}

exports.fetchAllOrders = async (req, res) => {
    let query = Order.find({ deleted: { $ne: true } });

    // Default sort by updatedAt descending
    let sortField = 'updatedAt';
    let sortOrder = -1;

    if (req.query._sort) {
        sortField = req.query._sort[0] === "-" ? req.query._sort.slice(1) : req.query._sort;
        sortOrder = req.query._sort === "rating" ? -1 : req.query._sort[0] === '-' ? -1 : 1;
    }

    query = query.sort({ [sortField]: sortOrder });

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
        console.error("Error fetching all orders:", error);
        res.status(400).json({ message: 'Error fetching all orders' });
    }
}
