const express = require('express');
const { getUsersByRole, getAdminsAndStockManagers } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = express.Router();
const UserAdminRepository = require('../repositories/userAdminRepository');
const db = require('../config/db');

// Get users by role (can be used for outlet managers or any role)
router.get('/users', verifyToken, getUsersByRole);

// Get outlet manager list (specific endpoint)
router.get('/users/outlet-managers', verifyToken, getUsersByRole);

// Get admins and stock managers with pagination
router.get("/admins-stockmanagers", verifyToken, getAdminsAndStockManagers);

router.get('/admin/users', verifyToken, async (req, res) => {
    try {
        console.log('1. Route accessed - fetching outlet managers');
        const userRepository = new UserAdminRepository(db);
        
        // Debug log
        console.log('2. Repository initialized');
        
        const users = await userRepository.getUsersByRole('user');
        console.log('3. Users fetched:', users);
        
        res.json({
            success: true,
            users: users
        });
    } catch (error) {
        console.error('Server Error Details:', {
            message: error.message,
            stack: error.stack,
            query: error.sql // If it's a database error
        });
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message
        });
    }
});

module.exports = router;