const reviewModel = require('../models/reviewModel');
const bookingModel = require('../models/bookingModel');

const createReview = async (req, res) => {
    try {
        const { booking_id, rating, comment } = req.body;
        const client_id = req.user.id; 

        console.log('=== CREATE REVIEW DEBUG ===');
        console.log('Request body:', req.body);
        console.log('Client ID from token:', client_id);

        // 1. Validate required fields
        if (!booking_id || !rating) {
            return res.status(400).json({ message: "Missing required fields: booking_id and rating" });
        }

        // 2. Validate booking_id is a valid UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(booking_id)) {
            return res.status(400).json({ 
                message: "Invalid booking_id format. Must be a valid UUID",
                example: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
                received_booking_id: booking_id
            });
        }

        // 3. Validate rating range
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        // 4. Check if booking exists
        console.log('Fetching booking with ID:', booking_id);
        const booking = await bookingModel.getBookingById(booking_id);
        
        if (!booking) {
            return res.status(404).json({ 
                message: "Booking not found. Check if the booking_id is correct.",
                provided_id: booking_id
            });
        }

        console.log('Booking found:', booking);
        console.log('Booking status:', booking.status);

        // 5. Check if booking is completed
        if (booking.status !== 'completed') {
            return res.status(400).json({ 
                message: "Booking not completed yet",
                current_status: booking.status,
                required_status: 'completed'
            });
        }

        // 6. Check if user owns this booking
        if (booking.client_id !== client_id) {
            return res.status(403).json({ 
                message: "You can only review your own bookings",
                your_id: client_id,
                booking_owner: booking.client_id
            });
        }

        // 7. Check if review already exists
        console.log('Checking for existing review...');
        const existingReview = await reviewModel.getReviewByBookingId(booking_id);
        if (existingReview) {
            return res.status(400).json({ message: "Review already exists for this booking" });
        }

        console.log('Creating review with params:', {
            booking_id,
            client_id,
            provider_id: booking.provider_id,
            rating,
            comment
        });

        // 8. Create the review
        const review = await reviewModel.createReview(
            booking_id,
            client_id,
            booking.provider_id,
            rating,
            comment
        );

        console.log('Review created successfully:', review);
        res.status(201).json({
            message: "Review created successfully",
            review: review
        });

    } catch (error) {
        console.error('=== CRITICAL ERROR ===');
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        
        res.status(500).json({ 
            message: "Error creating review",
            error: error.message
        });
    }
};

const getReviewsByProvider = async (req, res) => {
    try {
        const { providerId } = req.params;

        const reviews = await reviewModel.getReviewsByProvider(providerId);
        res.json(reviews);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching reviews" });
    }
};

const getAllReviews = async (req, res) => {
    try {
        const reviews = await reviewModel.getAllReviews();
        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching reviews" });
    }
};

const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await reviewModel.deleteReview(id);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.json({ message: "Review deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting review" });
    }
};

module.exports = {
    createReview,
    getReviewsByProvider,
    getAllReviews,
    deleteReview
};