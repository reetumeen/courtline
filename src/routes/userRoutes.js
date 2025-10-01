
const express = require('express');
const { getUsers, createUser } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Get all users (protected)
router.get('/', auth, getUsers);

// Create new user
router.post('/', createUser);

module.exports = router;
