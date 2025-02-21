const express = require('express');
const {
    addOutlet,
    updateOutlet,
    getOutletById,
    deleteOutlet,
    getAllOutlets,
    getAllOutletsWithManager,
    getOutletManagers,
} = require('../controllers/outletController');
const verifyToken = require('../middlewares/authMiddleware')

const router = express.Router();

// Get all outlets
router.get('/', verifyToken, getAllOutlets);

// Add a new outlet
router.post('/add', verifyToken, addOutlet);

// Update an existing outlet
router.put('/update/:id', verifyToken, updateOutlet);

// Get an outlet by ID
router.get('/:id', verifyToken, getOutletById);

// Delete an outlet by ID
router.delete('/delete/:id', verifyToken, deleteOutlet);

router.get('/outlets/with-managers', getAllOutletsWithManager);

// Get outlet managers
router.get("/outlets/managers", verifyToken, getOutletManagers);

module.exports = router;
