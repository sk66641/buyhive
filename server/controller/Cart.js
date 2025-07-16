const { Cart } = require('../model/Cart')

exports.fetchCartByUser = async (req, res) => {
    const { id } = req.user;
    try {
        const cart = await Cart.find({ user: id })
            .populate({ path: 'product', match: { deleted: { $ne: true }, stock: { $gt: 0 } } })
            .populate('user');
        const filteredCart = cart.filter(item => item.product !== null);
        res.status(201).json(filteredCart);
    } catch (error) {
        res.status(400).json(error);
    }
}

exports.addToCart = async (req, res) => {
    const cart = new Cart(req.body);
    try {
        const getCart = await cart.save();
        const finalCart = await getCart.populate('product');
        res.status(201).json(finalCart);
    } catch (error) {
        res.status(400).json(error);
    }
}

exports.deleteFromCart = async (req, res) => {
    const { id } = req.params;

    try {
        const cart = await Cart.findByIdAndDelete(id);
        // const finalResponse = await response.populate('product');
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json(error);
    }
}

exports.updateCart = async (req, res) => {
    const { id } = req.params;
    try {
        const cart = await Cart.findByIdAndUpdate(id, req.body, { new: true }).populate('product user');
        res.status(201).json(cart);
    } catch (error) {
        res.status(400).json(error);
    }
}