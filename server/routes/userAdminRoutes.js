const express = require('express');
const { getUsersByRole, getAdminsAndStockManagers } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = express.Router();

// Get outlet manager list
router.get('/users/outlet-managers', verifyToken, getUsersByRole);

// Get admins with pagination
router.get("/admins-stockmanagers", verifyToken, getAdminsAndStockManagers);

module.exports = router;