const RolesRepository = require("../repositories/rolesRepository");
const db = require("../config/db");

const rolesRepository = new RolesRepository(db);

exports.getAdminRoles = async (req, res) => {
    try {
        const roles = await rolesRepository.getRolesExcludingUser();

        if (roles.length === 0) {
            return res.status(404).json({ message: 'No roles found.' });
        }

        res.status(200).json(roles);
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ message: 'Failed to fetch roles.', error: error.message });
    }
};

exports.getUserRole = async (req, res) => {
    try {
        const userRole = await rolesRepository.getUserRoles();

        if (!userRole) {
            return res.status(404).json({ message: 'User role not found.' });
        }

        res.status(200).json(userRole);
    } catch (error) {
        console.error('Error fetching user role:', error);
        res.status(500).json({ message: 'Failed to fetch user role.', error: error.message });
    }
};
