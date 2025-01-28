const express = require('express');
const { 
    requestGasCylinder,
    filterGasRequest,
    approveGasRequest,
    updateGasRequestAndStock 
} = require('../controllers/stockController');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = express.Router();

// Routes
router.post('/request/gas', verifyToken, requestGasCylinder);
router.get('/request/filter-gas-requests', verifyToken, filterGasRequest);
router.patch('/request/status', verifyToken, approveGasRequest);
router.patch('/request/:requestId/status', verifyToken, updateGasRequestAndStock);

module.exports = router;