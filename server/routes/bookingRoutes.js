const express = require('express');
const router = express.Router();
const {getAllBookings, createBooking, getClientBookings, getProviderBookings, updateBookingStatus, deleteBooking} = require('../controllers/bookingController');
const { verifyToken } = require('../middlewares/authMiddleware');

console.log('routes loaded');

router.get('/', verifyToken, getAllBookings);

router.post('/createBooking',verifyToken, createBooking);

router.get('/client/:clientId',verifyToken, getClientBookings);


router.get('/provider/:providerId',verifyToken, getProviderBookings);

router.patch('/:id/status',verifyToken, updateBookingStatus);


router.delete('/:id',verifyToken, deleteBooking);

module.exports = router;