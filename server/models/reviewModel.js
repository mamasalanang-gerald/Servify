const pool = require('../config/DB');

const createReview = async (booking_id, client_id, provider_id, rating, comment) => {
    try {
        const query = `
            INSERT INTO reviews (booking_id, client_id, provider_id, rating, comment, review_date)
            VALUES ($1, $2, $3, $4, $5, NOW())
            RETURNING *;
        `;
        const values = [booking_id, client_id, provider_id, rating, comment];
        const result = await pool.query(query, values);
        
        console.log('Review created in DB:', result.rows[0]);
        return result.rows[0];
    } catch (error) {
        console.error('Error in createReview model:', error.message);
        throw error;
    }
};

const getReviewByBookingId = async (booking_id) => {
    try {
        const result = await pool.query(
            'SELECT * FROM reviews WHERE booking_id = $1',
            [booking_id]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error in getReviewByBookingId:', error.message);
        throw error;
    }
};

const getReviewsByService = async (service_id) => {
    try {
        const result = await pool.query(
            `SELECT r.id, r.booking_id, r.client_id, r.provider_id, r.rating, r.comment, r.review_date,
                    u.full_name AS reviewer_name
             FROM reviews r
             JOIN users u ON r.client_id = u.id
             JOIN bookings b ON r.booking_id = b.id
             WHERE b.service_id = $1
             ORDER BY r.review_date DESC`,
            [service_id]
        );
        return result.rows;
    } catch (error) {
        console.error('Error in getReviewsByService:', error.message);
        throw error;
    }
};

const getReviewsByProvider = async (provider_id) => {
    try {
        const result = await pool.query(
            `SELECT r.id, r.booking_id, r.client_id, r.provider_id, r.rating, r.comment, r.review_date,
                    u.full_name AS reviewer_name,
                    b.service_id,
                    s.title AS service_name
             FROM reviews r
             JOIN users u ON r.client_id = u.id
             JOIN bookings b ON r.booking_id = b.id
             JOIN services s ON b.service_id = s.id
             WHERE r.provider_id = $1
             ORDER BY r.review_date DESC`,
            [provider_id]
        );
        return result.rows;
    } catch (error) {
        console.error('Error in getReviewsByProvider:', error.message);
        throw error;
    }
};

const getAllReviews = async () => {
    try {
        const result = await pool.query(
            `SELECT r.*, 
                    cu.full_name AS client_name,
                    pu.full_name AS provider_name
             FROM reviews r
             JOIN users cu ON r.client_id = cu.id
             JOIN users pu ON r.provider_id = pu.id
             ORDER BY r.review_date DESC`
        );
        return result.rows;
    } catch (error) {
        console.error('Error in getAllReviews:', error.message);
        throw error;
    }
};

const deleteReview = async (id) => {
    try {
        const result = await pool.query(
            'DELETE FROM reviews WHERE id = $1 RETURNING *',
            [id]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error in deleteReview:', error.message);
        throw error;
    }
};

module.exports = {
    createReview,
    getReviewByBookingId,
    getReviewsByService,
    getReviewsByProvider,
    getAllReviews,
    deleteReview
};
