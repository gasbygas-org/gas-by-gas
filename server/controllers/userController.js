const UserAdminRepository = require("../repositories/userAdminRepository");
const db = require("../config/db");

const userAdminRepository = new UserAdminRepository(db);

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
