const express = require('express');
const router = express.Router();
const { getProfile } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/profile', verifyToken, getProfile);

module.exports = router;