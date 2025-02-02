const express = require('express');
const { getAdminRoles, getUserRole} = require('../controllers/rolesController');

const router = express.Router();

// Get an outlet by ID
router.get('/admin-roles', getAdminRoles);

//get user roles
router.get('/user-roles', getUserRole);

module.exports = router;
