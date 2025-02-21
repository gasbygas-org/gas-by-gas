const UserAdminRepository = require("../repositories/userAdminRepository");
const AdminUserRepository = require("../repositories/userRepository"); // Import the AdminUserRepository
const db = require("../config/db");

const userAdminRepository = new UserAdminRepository(db);
const adminUserRepository = new AdminUserRepository(db); // Create a single instance of the AdminUserRepository

// Get users by role
exports.getUsersByRole = async (req, res) => {
    const { role } = req.query; // Get role from query parameter

    try {
        if (!role) {
            return res.status(400).json({ message: 'Role is required.' });
        }

        const users = await userAdminRepository.getUsersByRole(role);

        if (users.length === 0) {
            return res.status(404).json({ message: `No users found with the role '${role}'.` });
        }

        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users by role:', error);
        res.status(500).json({ message: 'Failed to fetch users.', error: error.message });
    }
};

exports.getAdminsAndStockManagers = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const offset = (page - 1) * limit;

        const { users, totalCount } = await adminUserRepository.getAdminsAndStockManagers(offset, parseInt(limit));

        const totalPages = Math.ceil(totalCount / limit);

        res.status(200).json({
            currentPage: parseInt(page),
            totalPages,
            totalUsers: totalCount,
            users,
        });
    } catch (error) {
        console.error("Error fetching admins and stock managers:", error);
        res.status(500).json({
            message: "Failed to fetch admins and stock managers.",
            error: error.message,
        });
    }
};

exports.getGasRequestCustomers = async (req, res) => {
    // const { page = 1, limit = 10 } = req.query;

    try {
        // const offset = (page - 1) * limit;

        const { users, totalCount } = await adminUserRepository.getGasRequestCustomers(/*offset, parseInt(limit)*/);

        // const totalPages = Math.ceil(totalCount / limit);
        const totalPages = 1;

        res.status(200).json({
            // currentPage: parseInt(page),
            currentPage: parseInt(1),
            totalPages,
            totalUsers: totalCount,
            users,
        });
    } catch (error) {
        console.error("Error fetching gas request customers:", error);
        res.status(500).json({
            message: "Failed to fetch gas request customers.",
            error: error.message,
        });
    }
};
exports.getUsersWithRoles = async (req, res) => {
    try {
            const usersWithRoles = await userAdminRepository.getUsersWithRoles();
            res.status(200).json(usersWithRoles);
        } catch (error) {
            console.error('Error fetching users with roles:', error);
            res.status(500).json({ message: 'Failed to fetch users with roles.', error: error.message });
        }
};
exports.deleteUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await userAdminRepository.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        await userAdminRepository.deleteUser(userId);
        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Failed to delete user.', error: error.message });
    }
};
exports.editUser = async (req, res) => {
    const { userId } = req.params;
    const { name, email, phone, nic, address, role } = req.body;

    try {
        const user = await userAdminRepository.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const updatedUser = {
            name,
            email,
            phone,
            nic,
            address,
            role
        };

        await userAdminRepository.updateUser(userId, updatedUser);
        res.status(200).json({ message: 'User updated successfully.' });
    } catch (error) {
        console.error('Error editing user:', error);
        res.status(500).json({ message: 'Failed to update user.', error: error.message });
    }
};


