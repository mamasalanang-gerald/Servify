const express = require('express');
const router = express.Router();

const {
    createReview,
    getReviewsByProvider,
    getAllReviews,
    deleteReview
} = require('../controllers/reviewController');

const { verifyToken } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminValidation');


router.post('/', verifyToken, createReview);


router.get('/provider/:providerId', verifyToken, getReviewsByProvider);


router.get('/', verifyToken, isAdmin, getAllReviews);


router.delete('/:id', verifyToken, isAdmin, deleteReview);

module.exports = router;