const express = require('express');
const {
    getUsersByRole,
    getAdminsAndStockManagers,
    getGasRequestCustomers,
} = require('../controllers/userController');
const verifyToken = require('../middlewares/authMiddleware')

const router = express.Router();

//get outlet manager list
router.get('/users/outlet-managers', verifyToken, getUsersByRole);

//get admins with pagination
router.get("/admins-stockmanagers", verifyToken, getAdminsAndStockManagers);

router.get("/gas-request-customers", verifyToken, getGasRequestCustomers);

module.exports = router;
