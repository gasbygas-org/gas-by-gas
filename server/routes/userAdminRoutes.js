const express = require('express');
const { getUsersByRole } = require('../controllers/userController');
const verifyToken = require('../middlewares/authMiddleware')

const router = express.Router();

//get outlet manager list
router.get('/users/outlet-managers',verifyToken,getUsersByRole);

module.exports = router;
