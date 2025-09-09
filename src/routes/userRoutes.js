const express = require('express');
const UserController = require('../controllers/userController');
const { basicAuth } = require('../middleware/auth');
const { validateUserRegistration } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/register', validateUserRegistration, UserController.register);
router.post('/login', UserController.login);

// Protected routes
router.get('/me', basicAuth, UserController.getCurrentUser);

module.exports = router;
