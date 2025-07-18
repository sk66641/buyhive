const { User } = require('../model/User')

exports.fetchUserById = async (req, res) => {
    const { id } = req.user;

    try {
        const user = await User.findById(id, 'name email role');
        console.log(user)
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(400).json({ message: 'Error fetching user' });
    }
}

exports.updateUser = async (req, res) => {
    const { id } = req.user;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            req.body,
            { new: true, select: 'name email role' }
        );
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(400).json({ message: 'Error updating user' });
    }
}