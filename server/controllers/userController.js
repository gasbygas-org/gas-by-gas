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
