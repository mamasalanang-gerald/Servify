const express = require('express');
const router = express.Router();
const providerController = require('../controllers/providerController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Provider earnings routes
router.get('/:providerId/earnings/summary', verifyToken, providerController.getEarningsSummary);
router.get('/:providerId/earnings/transactions', verifyToken, providerController.getTransactions);
router.get('/:providerId/earnings/payouts', verifyToken, providerController.getPayouts);
router.get('/:providerId/earnings/monthly', verifyToken, providerController.getMonthlyEarnings);

module.exports = router;
