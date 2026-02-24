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
		const {
			service_id,
			provider_id,
			booking_date,
			booking_time,
			user_location,
			total_price,
			notes,
		} = req.body;

		if (!service_id || !provider_id || !booking_date || !booking_time || !user_location || total_price === undefined || total_price === null) {
			return res.status(400).json({ message: 'Missing required booking fields' });
		}

		const normalizedPrice = Number(total_price);
		if (!Number.isFinite(normalizedPrice) || normalizedPrice < 0) {
			return res.status(400).json({ message: 'Invalid total_price value' });
		}

		const booking = await bookingModel.createBooking({
			service_id,
			client_id: req.user.id,
			provider_id,
			booking_date,
			booking_time,
			user_location,
			total_price: normalizedPrice,
			notes,
		});
		res.status(201).json(booking);
	} catch (err) {
		res.status(500).json({ message: 'Error creating booking', error: err.message });
	}
};

const getClientBookings = async (req, res) => {
	try {
		const { clientId } = req.params;
		
		// Validate clientId exists
		if (!clientId) {
			return res.status(400).json({ message: 'Client ID is required' });
		}
		
		const bookings = await bookingModel.getBookingsByClientId(clientId);
		res.status(200).json(bookings || []);
	} catch (err) {
		console.error('Error fetching client bookings:', err);
		res.status(500).json({ message: 'Error fetching client bookings', error: err.message });
	}
};

const getProviderBookings = async (req, res) => {
	try {
		const { providerId } = req.params;
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
