const express = require('express');
const {
    getUsersByRole,
    getAdminsAndStockManagers,
    getGasRequestCustomers,
    getUsersWithRoles,
    deleteUser,editUser
} = require('../controllers/userController');
const verifyToken = require('../middlewares/authMiddleware')

const router = express.Router();

//get outlet manager list
router.get('/users/outlet-managers', verifyToken, getUsersByRole);

//get admins with pagination
router.get("/admins-stockmanagers", verifyToken, getAdminsAndStockManagers);

router.get("/gas-request-customers", verifyToken, getGasRequestCustomers);

router.get("/users/all", getUsersWithRoles);

// Delete user by ID
router.delete('/users/delete/:userId', deleteUser);

// Edit user details
router.put('/users/edit/:userId', editUser);

module.exports = router;
