const express = require('express');
const userRequestController = require('../controllers/userRequestController');
const { verifyToken, requireProfileComplete } = require('../middlewares/authMiddleware');
const UserRequestRepository = require('../repositories/userRequestRepository');
const UserRepository = require('../repositories/userRepository');
const db = require('../config/db');

const router = express.Router();
const userRequestRepository = new UserRequestRepository(db);
const userRepository = new UserRepository(db);

// Gas Request Routes
router.post('/gas', verifyToken, requireProfileComplete, userRequestController.requestGas);

// Admin Routes for Request Management
router.get('/gas/all-requests', verifyToken, requireProfileComplete, async (req, res) => {
    try {
        // Check if user is admin
        if (req.mysqlUser.role_name !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access'
            });
        }

        const requests = await userRequestRepository.getAllRequests();
        res.json({
            success: true,
            requests: requests
        });
    } catch (error) {
        console.error('Error fetching all requests:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch requests'
        });
    }
});

router.post('/gas/approve', verifyToken, requireProfileComplete, async (req, res) => {
    try {
        // Check if user is admin
        if (req.mysqlUser.role_name !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access'
            });
        }

        const { requestId, status } = req.body;

        if (!requestId || !['Approved', 'Declined'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid request parameters'
            });
        }

        await userRequestRepository.updateRequestStatus(requestId, status);
        const updatedRequest = await userRequestRepository.getUserRequestById(requestId);

        res.json({
            success: true,
            message: `Request ${status.toLowerCase()} successfully`,
            request: updatedRequest
        });
    } catch (error) {
        console.error('Error updating request:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update request'
        });
    }
});

// User Request Routes
router.get('/gas/requests', verifyToken, async (req, res) => {
    try {
        const requests = await userRequestRepository.getUserRequests(req.mysqlUser.id);
        res.json({
            success: true,
            requests: requests
        });
    } catch (error) {
        console.error('Error fetching user requests:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch requests'
        });
    }
});

router.get('/gas/requests/:id', verifyToken, async (req, res) => {
    try {
        const request = await userRequestRepository.getUserRequestById(req.params.id);
        
        if (!request || request.user_id !== req.mysqlUser.id) {
            return res.status(404).json({
                success: false,
                message: 'Request not found or unauthorized'
            });
        }

        res.json({
            success: true,
            request: request
        });
    } catch (error) {
        console.error('Error fetching request details:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch request details'
        });
    }
});

// Notification Routes
router.get('/notifications', verifyToken, requireProfileComplete, async (req, res) => {
    try {
        // Get user ID from Firebase auth
        const userId = req.user.uid;
        
        // Get MySQL user
        const user = await userRepository.getUserByUid(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const notifications = await userRequestRepository.getUserNotifications(user.id);
        res.json({
            success: true,
            notifications: notifications
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch notifications'
        });
    }
});

// Mark notification as read
router.patch('/notifications/:id/read', verifyToken, requireProfileComplete, async (req, res) => {
    try {
        const userId = req.user.uid;
        const user = await userRepository.getUserByUid(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const updated = await userRequestRepository.markNotificationRead(
            req.params.id, 
            user.id
        );
        
        res.json({
            success: true,
            notification: updated
        });
    } catch (error) {
        console.error('Error updating notification:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update notification'
        });
    }
});

module.exports = router;
