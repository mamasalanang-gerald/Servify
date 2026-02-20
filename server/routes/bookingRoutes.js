const express = require('express');
const router = express.Router();
const {getAllBookings, createBooking, getClientBookings, getProviderBookings, updateBookingStatus, deleteBooking} = require('../controllers/bookingController');

console.log('routes loaded');

router.get('/', getAllBookings);

router.post('/',createBooking);

router.get('/client/:clientId', getClientBookings);


router.get('/provider/:providerId', getProviderBookings);

router.patch('/:id/status', updateBookingStatus);


router.delete('/:id', deleteBooking);

module.exports = router;