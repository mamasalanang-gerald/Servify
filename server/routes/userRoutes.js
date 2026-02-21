const express = require('express');
const router = express.Router();
const { getProfile, listUsers, promoteRole, changeUserRole } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

router.get('/profile', verifyToken, getProfile);
router.patch('/promote', verifyToken, authorizeRoles('client'), promoteRole);
router.patch('/:id/role', verifyToken, authorizeRoles('admin'), changeUserRole);
router.get('/', verifyToken, authorizeRoles('admin'), listUsers);

module.exports = router;