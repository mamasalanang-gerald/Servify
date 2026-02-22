const bookingModel = require('../models/bookingModel');

const getAllBookings = async (req, res) => {
	try {
		const { status } = req.query;
		const bookings = await bookingModel.getAllBookings(status || null);
		res.status(200).json(bookings);
	} catch (err) {
		res.status(500).json({ message: 'Error fetching bookings', error: err.message });
	}
};

const createBooking = async (req, res) => {
	try {
		const bookingData = req.body;
		const booking = await bookingModel.createBooking(bookingData);
		res.status(201).json(booking);
	} catch (err) {
		res.status(500).json({ message: 'Error creating booking', error: err.message });
	}
};

const getClientBookings = async (req, res) => {
	try {
		const { clientId } = req.params;

		if (String(req.user.id) !== String(clientId) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden: You can only view your own bookings' });

		const bookings = await bookingModel.getBookingsByClientId(clientId);
		res.status(200).json(bookings);
	} catch (err) {
		res.status(500).json({ message: 'Error fetching client bookings', error: err.message });
	}
};

const getProviderBookings = async (req, res) => {
	try {
		const { providerId } = req.params;

		if (String(req.user.id) !== String(providerId) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden: You can only view your own bookings' });

		const bookings = await bookingModel.getBookingsByProviderId(providerId);
		res.status(200).json(bookings);
	} catch (err) {
		res.status(500).json({ message: 'Error fetching provider bookings', error: err.message });
	}
};

const updateBookingStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body;
		if (!status) return res.status(400).json({ message: 'Missing status in request body' });
		const updated = await bookingModel.updateBookingStatus(id, status);
		if (!updated) return res.status(404).json({ message: 'Booking not found' });
		res.status(200).json(updated);
	} catch (err) {
		res.status(500).json({ message: 'Error updating booking status', error: err.message });
	}
};

const deleteBooking = async (req, res) => {
	try {
		const { id } = req.params;
		const deleted = await bookingModel.deleteBooking(id);
		if (!deleted) return res.status(404).json({ message: 'Booking not found' });
		res.status(200).json({ message: 'Booking deleted', booking: deleted });
	} catch (err) {
		res.status(500).json({ message: 'Error deleting booking', error: err.message });
	}
};

module.exports = {
	getAllBookings,
	createBooking,
	getClientBookings,
	getProviderBookings,
	updateBookingStatus,
	deleteBooking,
};

