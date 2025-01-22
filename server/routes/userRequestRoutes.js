const express = require('express');
const { requestGas } = require('../controllers/userRequestController');
const verifyToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Route for requesting gas
router.post('/gas', verifyToken, requestGas);

module.exports = router;
