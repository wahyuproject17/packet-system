const { User } = require('../models');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json({ message: 'Users retrieved successfully',
            data: {
                users: users.map(user => ({
                    id: user.id,
                    full_name: user.full_name,
                    email: user.email,
                    createdAt: user.createdAt,
                }))
            }
         });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving users', error });
    }
};
const createUser = async (req, res) => {
    try {
        const { full_name, email, password } = req.body;
        const user = await User.create({ full_name, email, password });
        res.status(201).json({ 
            message: 'User created successfully',
            data: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
        } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user', error });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, email, password } = req.body;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.full_name = full_name || user.full_name;
        user.email = email || user.email;
        user.password = password || user.password;

        await user.save();
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating user', error });
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.destroy();
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting user', error });
    }
};

module.exports = { 
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
};