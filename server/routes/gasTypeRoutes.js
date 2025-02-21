const express = require('express');
const { getGasTypes, getAllGasTypes } = require('../controllers/gasTypeController');
const verifyToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', verifyToken, getGasTypes);
router.get('/all', verifyToken, getAllGasTypes);

module.exports = router;
