const pool = require("../config/DB");

const getReviewsByService = async (service_id) => {
  const result = await pool.query(
    `
        SELECT r.*, u.full_name AS reviewer_name
        FROM reviews r
        JOIN users u ON r.client_id = u.id
        JOIN bookings b ON r.booking_id = b.id
        WHERE b.service_id = $1
        ORDER BY r.review_date DESC
    `,
    [service_id],
  );
  return result.rows;
};

const getReviewsByProvider = async (provider_id) => {
  const result = await pool.query(
    `
        SELECT r.*, u.full_name AS reviewer_name, 
               b.service_id, s.title AS service_name
        FROM reviews r
        JOIN users u ON r.client_id = u.id
        JOIN bookings b ON r.booking_id = b.id
        JOIN services s ON b.service_id = s.id
        WHERE r.provider_id = $1
        ORDER BY r.review_date DESC
    `,
    [provider_id],
  );
  return result.rows;
};

const createReview = async ({
  booking_id,
  client_id,
  provider_id,
  rating,
  comment,
}) => {
  const result = await pool.query(
    `INSERT INTO reviews (booking_id, client_id, provider_id, rating, comment)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [booking_id, client_id, provider_id, rating, comment],
  );
  return result.rows[0];
};

module.exports = { 
    getReviewsByService, 
    getReviewsByProvider, 
    createReview 
};