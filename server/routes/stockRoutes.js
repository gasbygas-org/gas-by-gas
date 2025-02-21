const express = require('express');
const { requestGasCylinder } = require('../controllers/stockController');
const { filterGasRequest } = require('../controllers/stockController');
const { approveGasRequest } = require('../controllers/stockController');
const {
    updateGasRequestAndStock,
    cancelGasRequest,
    getAllGasRequests,
    createStock,
    getAllStocks,
    updateStock,
    deleteStock,
} = require('../controllers/stockController');
const verifyToken = require('../middlewares/authMiddleware')
const { app } = require("firebase-admin");

const router = express.Router();

// Add gas request
router.post('/request/gas', verifyToken, requestGasCylinder);

//filter gas requests
router.get('/request/filter-gas-requests', verifyToken, filterGasRequest);

router.get('/request/all-gas-requests', verifyToken, getAllGasRequests);

// Updated route: No need to pass requestId in body, only in the URL
router.patch('/request/status', verifyToken, approveGasRequest);

// Update gas request status and stock
router.patch('/request/:requestId/status', verifyToken, updateGasRequestAndStock);

router.patch('/request/:requestId/cancel', verifyToken, cancelGasRequest);

// Admin
// Create a new stock entry
router.post("/stocks", verifyToken, createStock);

// Get all stocks with search and filter
router.get("/stocks", verifyToken, getAllStocks);

// Update stock quantity
router.put("/stocks", verifyToken, updateStock);

// Delete stock
router.delete("/stocks/:stockId", verifyToken, deleteStock);

module.exports = router;
