const { Cart } = require('../model/Cart')

exports.fetchCartByUser = async (req, res) => {
    const { id } = req.user;
    try {
        const cart = await Cart.find({ user: id })
            .populate({ path: 'product', select: '-createdAt -updatedAt', match: { deleted: { $ne: true }, stock: { $gt: 0 } } })
        const filteredCart = cart.filter(item => item.product !== null);
        res.status(201).json(filteredCart);
    } catch (error) {
        console.error("Error fetching cart by user:", error);
        res.status(400).json({ message: 'Error fetching cart' });
    }
}

exports.addToCart = async (req, res) => {
    const cart = new Cart(req.body);
    try {
        const getCart = await cart.save();
        const finalCart = await getCart.populate('product', '-createdAt -updatedAt');
        res.status(201).json(finalCart);
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(400).json({ message: 'Error adding to cart' });
    }
}

exports.deleteFromCart = async (req, res) => {
    const { id } = req.params;

    try {
        await Cart.findByIdAndDelete(id);
        res.status(200).json({ id });
    } catch (error) {
        console.error("Error deleting from cart:", error);
        res.status(400).json({ message: 'Error deleting from cart' });
    }
}

exports.updateCart = async (req, res) => {
    const { id } = req.params;
    try {
        const cart = await Cart.findByIdAndUpdate(id, req.body, { new: true }).populate('product', '-createdAt -updatedAt');
        res.status(201).json(cart);
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(400).json({ message: 'Error updating cart' });
    }
}