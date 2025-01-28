const express = require('express');
const { requestGas, approveRequest, markAsDelivered, getUserRequests } = require('../controllers/userRequestController');
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

module.exports = router;
