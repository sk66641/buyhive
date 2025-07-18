const { Address } = require('../model/Address');

exports.addAddress = async (req, res) => {
    const address = new Address(req.body);
    try {
        const savedAddress = await address.save();
        res.status(201).json(savedAddress);
    } catch (error) {
        console.error("Error adding address:", error);
        res.status(400).json({ message: 'Error adding address' });
    }
}

exports.fetchAddressByUser = async (req, res) => {
    const { id } = req.user;
    try {
        const addresses = await Address.find({ userId: id });
        res.status(200).json(addresses);
    } catch (error) {
        console.error("Error fetching addresses by user:", error);
        res.status(400).json({ message: 'Error fetching addresses' });
    }
}

exports.updateAddress = async (req, res) => {
    const { id } = req.body;
    console.log("Updating address with ID:", req.body);
    try {
        const updatedAddress = await Address.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedAddress);
    } catch (error) {
        console.error("Error updating address:", error);
        res.status(400).json({ message: 'Error updating address' });
    }
}

exports.deleteAddress = async (req, res) => {
    const { id } = req.params;
    try {
        await Address.findByIdAndDelete(id);
        res.status(200).json({ id });
    } catch (error) {
        console.error("Error deleting address:", error);
        res.status(400).json({ message: 'Error deleting address' });
    }
}