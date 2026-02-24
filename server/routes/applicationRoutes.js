const express = require('express');
const router = express.Router();
const { submitApplication, getMyStatus } = require('../controllers/applicationController');
const { verifyToken } = require('../middlewares/authMiddleware');

// POST /api/applications - Submit provider application
router.post('/', verifyToken, submitApplication);

// GET /api/applications/my-status - Get current user's application status
router.get('/my-status', verifyToken, getMyStatus);

module.exports = router;
