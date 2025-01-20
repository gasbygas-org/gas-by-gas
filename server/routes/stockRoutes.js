const express = require('express');
const { requestGasCylinder} = require('../controllers/stockController');
const {filterGasRequest} = require('../controllers/stockController');
const verifyToken = require('../middlewares/authMiddleware')

const router = express.Router();

// Add gas request
router.post('/request/gas', verifyToken,requestGasCylinder);

//filter gas requests
router.get('/request/filter-gas-requests', verifyToken, filterGasRequest);

module.exports = router;