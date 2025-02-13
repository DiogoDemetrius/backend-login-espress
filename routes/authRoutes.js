const express = require('express');
const { register, login, forgotPassword, resetPassword, deleteUser } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.delete('/delete-user/:userId', deleteUser);

module.exports = router;
