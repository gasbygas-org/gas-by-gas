const express = require('express');
const {
    requestGas,
    approveRequest,
    markAsDelivered,
    getUserRequests,
    cancelRequest,
    rejectRequest,
    reallocateRequest,
    getGasRequestCountByUserId,
} = require('../controllers/userRequestController');
const verifyToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Route for requesting gas
router.post('/gas', verifyToken, requestGas);

// Route for approving gas request
router.post('/gas/approve', verifyToken, approveRequest);

//route for is diliverd
router.post('/gas/delivered', verifyToken, markAsDelivered);

// Route for fetching user requests with pagination and filters
router.get('/gas/requests', verifyToken, getUserRequests);

router.post('/gas/cancel', verifyToken, cancelRequest);

router.post('/gas/reject', verifyToken, rejectRequest);

router.post('/gas/reallocate', verifyToken, reallocateRequest);

// Route to get gas request count by user ID
router.get('/gas-requests/count/:userId', getGasRequestCountByUserId);

module.exports = router;
