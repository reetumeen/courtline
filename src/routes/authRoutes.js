const express = require('express');
const { signup, login } = require('../controllers/authController');
const router = express.Router();

// User registration
router.post('/signup', signup);

// User login
router.post('/login', login);

module.exports = router;