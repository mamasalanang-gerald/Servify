const pool = require('../config/DB');


const createBooking = async ({
    service_id,
    client_id,
    provider_id,
    booking_date,
    booking_time,
    user_location,
    total_price,
    notes
}) => {
    try {
        const query = `
            INSERT INTO bookings (
                service_id, client_id, provider_id, booking_date, 
                booking_time, user_location, total_price, notes
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        const values = [
            service_id,
            client_id,
            provider_id,
            booking_date,
            booking_time,
            user_location,
            total_price,
            notes || null
        ];
        
        const { rows } = await pool.query(query, values);
        return rows[0];
    } catch (error) {
        console.error("Error creating booking:", error.message);
        throw error;
    }
};


const getAllBookings = async (status = null) => {
    try {
        let query = 'SELECT * FROM bookings';
        const values = [];

        if (status) {
            query += ' WHERE status = $1';
            values.push(status);
        }
        
        query += ' ORDER BY created_at DESC';

        const { rows } = await pool.query(query, values);
        return rows;
    } catch (error) {
        console.error("Error fetching bookings:", error.message);
        throw error;
    }
};


const getBookingById = async (id) => {
    try {
        const query = 'SELECT * FROM bookings WHERE id = $1';
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    } catch (error) {
        console.error("Error fetching booking:", error.message);
        throw error;
    }
};


const getBookingsByClientId = async (client_id) => {
    try {
        const query = `
            SELECT b.*, s.title as service_name, s.description as service_description
            FROM bookings b
            JOIN services s ON b.service_id = s.id
            WHERE b.client_id = $1
            ORDER BY b.booking_date DESC, b.booking_time DESC
        `;
        const { rows } = await pool.query(query, [client_id]);
        return rows;
    } catch (error) {
        console.error("Error fetching client bookings:", error.message);
        throw error;
    }
};


const getBookingsByProviderId = async (provider_id) => {
    try {
        const query = `
            SELECT b.*, s.title as service_name, u.full_name as client_name, u.phone_number as client_phone
            FROM bookings b
            JOIN services s ON b.service_id = s.id
            JOIN users u ON b.client_id = u.id
            WHERE b.provider_id = $1
            ORDER BY b.booking_date DESC, b.booking_time DESC
        `;
        const { rows } = await pool.query(query, [provider_id]);
        return rows;
    } catch (error) {
        console.error("Error fetching provider bookings:", error.message);
        throw error;
    }
};


const updateBookingStatus = async (id, status) => {
    try {
        const query = `
            UPDATE bookings 
            SET status = $2, updated_at = NOW()
            WHERE id = $1
            RETURNING *
        `;
        const { rows } = await pool.query(query, [id, status]);
        return rows[0];
    } catch (error) {
        console.error("Error updating booking status:", error.message);
        throw error;
    }
};


const updateBookingDetails = async (id, { booking_date, booking_time, user_location, notes }) => {
    try {
        const query = `
            UPDATE bookings 
            SET booking_date = COALESCE($2, booking_date),
                booking_time = COALESCE($3, booking_time),
                user_location = COALESCE($4, user_location),
                notes = COALESCE($5, notes),
                updated_at = NOW()
            WHERE id = $1
            RETURNING *
        `;
        const values = [id, booking_date, booking_time, user_location, notes];
        const { rows } = await pool.query(query, values);
        return rows[0];
    } catch (error) {
        console.error("Error updating booking details:", error.message);
        throw error;
    }
};


const deleteBooking = async (id) => {
    try {
        const query = 'DELETE FROM bookings WHERE id = $1 RETURNING *';
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    } catch (error) {
        console.error("Error deleting booking:", error.message);
        throw error;
    }
};

module.exports = {
    createBooking,
    getAllBookings,
    getBookingById,
    getBookingsByClientId,
    getBookingsByProviderId,
    updateBookingStatus,
    updateBookingDetails,
    deleteBooking
};