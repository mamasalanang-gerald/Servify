const express = require('express');
const router = express.Router();
const { getProfile, listUsers } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/profile', verifyToken, getProfile);
router.get('/', listUsers);

module.exports = router;