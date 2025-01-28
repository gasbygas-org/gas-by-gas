const express = require('express');
const { requestGas, approveRequest, markAsDelivered } = require('../controllers/userRequestController');
const verifyToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Route for requesting gas
router.post('/gas', verifyToken, requestGas);

// Route for approving gas request
router.post('/gas/approve', verifyToken, approveRequest);

//route for is diliverd
router.post('/gas/delivered', verifyToken, markAsDelivered);

module.exports = router;
