const express = require('express');
const { getGasTypes } = require('../controllers/gasTypeController');
const verifyToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', verifyToken, getGasTypes);

module.exports = router;
