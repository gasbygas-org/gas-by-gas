// routes/gasTypeRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const db = require('../config/db');

router.get('/', verifyToken, async (req, res) => {
    try {
        const query = `
            SELECT 
                id,
                gas_type_name as name,
                description,
                created_at
            FROM gas_types
        `;
        
        const [gasTypes] = await db.query(query);
        
        res.json({
            success: true,
            gasTypes: gasTypes
        });
    } catch (error) {
        console.error('Error fetching gas types:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch gas types'
        });
    }
});

module.exports = router;
