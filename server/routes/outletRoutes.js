const express = require('express');
const { addOutlet, updateOutlet, getOutletById, deleteOutlet } = require('../controllers/outletController');
const { verifyToken } = require('../middlewares/authMiddleware');
const OutletRepository = require('../repositories/outletRepository');
const db = require('../config/db');
const router = express.Router();

const outletRepository = new OutletRepository(db);

// Add a new outlet
router.post('/add', verifyToken, addOutlet);

// Update an existing outlet
router.put('/update/:id', verifyToken, updateOutlet);

// Get an outlet by ID
router.get('/:id', verifyToken, getOutletById);

// Delete an outlet by ID
router.delete('/delete/:id', verifyToken, deleteOutlet);

// Get all outlets
router.get('/', verifyToken, async (req, res) => {
    try {
        const query = `
            SELECT 
                o.id,
                o.outlet_name as name,
                o.address,
                o.district,
                o.phone,
                o.manager_id
            FROM outlets o
        `;

        const [outlets] = await db.query(query);
        
        res.json({
            success: true,
            outlets: outlets
        });
    } catch (error) {
        console.error('Error fetching outlets:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch outlets'
        });
    }
});

// Check stock availability
router.get('/:id/stock', verifyToken, async (req, res) => {
    const { id: outletId } = req.params;
    const { gasTypeId, quantity } = req.query;

    try {
        if (!outletId || !gasTypeId || !quantity) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameters'
            });
        }

        const stock = await outletRepository.getStockLevel(outletId, gasTypeId);
        console.log('Stock found:', stock); // Debug log
        
        const availableQuantity = stock?.availableQuantity || 0;
        const isAvailable = availableQuantity >= parseInt(quantity);

        console.log('Stock check result:', {
            availableQuantity,
            requestedQuantity: parseInt(quantity),
            isAvailable
        });

        res.json({
            success: true,
            checked: true,
            isAvailable,
            availableQuantity,
            requestedQuantity: parseInt(quantity)
        });
    } catch (error) {
        console.error('Stock check error details:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check stock availability'
        });
    }
});

module.exports = router;
