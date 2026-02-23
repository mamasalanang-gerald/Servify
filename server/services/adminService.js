const pool = require('../config/DB');

// ============ USER MANAGEMENT ============

const fetchUsers = async (page = 1, limit = 10, role = null) => {
    try {
        const offset = (page - 1) * limit;
        
        // Get total count
        let countQuery = 'SELECT COUNT(*) as total FROM users';
        const countValues = [];
        if (role) {
            countQuery += ' WHERE user_type = $1';
            countValues.push(role);
        }
        const { rows: countRows } = await pool.query(countQuery, countValues);
        const total = parseInt(countRows[0].total);
        
        // Get paginated data
        let query = 'SELECT id, full_name, email, user_type, is_verified, is_active, phone_number, created_at, updated_at FROM users';
        const values = [];

        if (role) {
            query += ' WHERE user_type = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3';
            values.push(role, limit, offset);
        } else {
            query += ' ORDER BY created_at DESC LIMIT $1 OFFSET $2';
            values.push(limit, offset);
        }

        const { rows } = await pool.query(query, values);
        return { data: rows, total };
    } catch (error) {
        console.error('Error fetching users:', error.message);
        throw error;
    }
};

const fetchUserById = async (id) => {
    try {
        const query = 'SELECT id, full_name, email, user_type, is_verified, is_active, phone_number, bio, profile_image, created_at, updated_at FROM users WHERE id = $1';
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    } catch (error) {
        console.error('Error fetching user:', error.message);
        throw error;
    }
};

const updateUserStatus = async (id, isActive) => {
    try {
        const query = 'UPDATE users SET is_active = $1, updated_at = NOW() WHERE id = $2 RETURNING id, full_name, email, user_type, is_verified, is_active, created_at, updated_at';
        const { rows } = await pool.query(query, [isActive, id]);
        return rows[0];
    } catch (error) {
        console.error('Error updating user status:', error.message);
        throw error;
    }
};

const verifyProviderAccount = async (id) => {
    try {
        const query = 'UPDATE users SET is_verified = TRUE, updated_at = NOW() WHERE id = $1 AND user_type = $2 RETURNING id, full_name, email, user_type, is_verified, is_active, created_at, updated_at';
        const { rows } = await pool.query(query, [id, 'provider']);
        return rows[0];
    } catch (error) {
        console.error('Error verifying provider:', error.message);
        throw error;
    }
};

// ============ CATEGORY MANAGEMENT ============

const fetchCategories = async () => {
    try {
        const query = 'SELECT id, name, description, created_at FROM categories ORDER BY created_at DESC';
        const { rows } = await pool.query(query);
        return rows;
    } catch (error) {
        console.error('Error fetching categories:', error.message);
        throw error;
    }
};

const createNewCategory = async (name, description) => {
    try {
        const query = 'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING id, name, description, created_at';
        const { rows } = await pool.query(query, [name, description || null]);
        return rows[0];
    } catch (error) {
        if (error.code === '23505') { // Unique constraint violation
            throw new Error('duplicate key value violates unique constraint');
        }
        console.error('Error creating category:', error.message);
        throw error;
    }
};

const updateCategoryData = async (id, name, description) => {
    try {
        const query = 'UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING id, name, description, created_at';
        const { rows } = await pool.query(query, [name, description || null, id]);
        return rows[0];
    } catch (error) {
        console.error('Error updating category:', error.message);
        throw error;
    }
};

const checkCategoryUsage = async (id) => {
    try {
        const query = 'SELECT COUNT(*) as count FROM services WHERE category_id = $1';
        const { rows } = await pool.query(query, [id]);
        return parseInt(rows[0].count);
    } catch (error) {
        console.error('Error checking category usage:', error.message);
        throw error;
    }
};

const deleteCategoryById = async (id) => {
    try {
        const query = 'DELETE FROM categories WHERE id = $1 RETURNING id, name, description';
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    } catch (error) {
        console.error('Error deleting category:', error.message);
        throw error;
    }
};

// ============ SERVICE MODERATION ============

const fetchServices = async (page = 1, limit = 10, filters = {}) => {
    try {
        const offset = (page - 1) * limit;
        
        // Build count query
        let countQuery = `
            SELECT COUNT(*) as total
            FROM services s
            WHERE 1=1
        `;
        const countValues = [];
        let countParamCount = 0;

        if (filters.provider_id) {
            countParamCount++;
            countQuery += ` AND s.provider_id = $${countParamCount}`;
            countValues.push(filters.provider_id);
        }

        if (filters.category_id) {
            countParamCount++;
            countQuery += ` AND s.category_id = $${countParamCount}`;
            countValues.push(filters.category_id);
        }

        if (filters.search) {
            countParamCount++;
            countQuery += ` AND LOWER(s.title) LIKE LOWER($${countParamCount})`;
            countValues.push(`%${filters.search}%`);
        }

        const { rows: countRows } = await pool.query(countQuery, countValues);
        const total = parseInt(countRows[0].total);
        
        // Build data query
        let query = `
            SELECT s.id, s.provider_id, u.full_name as provider_name, s.category_id, c.name as category_name, s.title, s.description, 
                   s.price, s.service_type, s.location, s.is_active, s.created_at, s.updated_at
            FROM services s
            JOIN users u ON s.provider_id = u.id
            LEFT JOIN categories c ON s.category_id = c.id
            WHERE 1=1
        `;
        const values = [];
        let paramCount = 0;

        if (filters.provider_id) {
            paramCount++;
            query += ` AND s.provider_id = $${paramCount}`;
            values.push(filters.provider_id);
        }

        if (filters.category_id) {
            paramCount++;
            query += ` AND s.category_id = $${paramCount}`;
            values.push(filters.category_id);
        }

        if (filters.search) {
            paramCount++;
            query += ` AND LOWER(s.title) LIKE LOWER($${paramCount})`;
            values.push(`%${filters.search}%`);
        }

        paramCount++;
        query += ` ORDER BY s.created_at DESC LIMIT $${paramCount}`;
        values.push(limit);
        
        paramCount++;
        query += ` OFFSET $${paramCount}`;
        values.push(offset);

        const { rows } = await pool.query(query, values);
        return { data: rows, total };
    } catch (error) {
        console.error('Error fetching services:', error.message);
        throw error;
    }
};

const fetchServiceById = async (id) => {
    try {
        const query = `
            SELECT s.id, s.provider_id, u.full_name as provider_name, s.category_id, s.title, s.description, 
                   s.price, s.service_type, s.location, s.is_active, s.created_at, s.updated_at
            FROM services s
            JOIN users u ON s.provider_id = u.id
            WHERE s.id = $1
        `;
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    } catch (error) {
        console.error('Error fetching service:', error.message);
        throw error;
    }
};

const toggleServiceActive = async (id) => {
    try {
        const query = `
            UPDATE services 
            SET is_active = NOT is_active, updated_at = NOW() 
            WHERE id = $1 
            RETURNING id, provider_id, category_id, title, description, price, service_type, location, is_active, created_at, updated_at
        `;
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    } catch (error) {
        console.error('Error toggling service status:', error.message);
        throw error;
    }
};

// ============ BOOKING MONITORING ============

const fetchBookings = async (page = 1, limit = 10, filters = {}) => {
    try {
        const offset = (page - 1) * limit;
        
        // Build count query
        let countQuery = `
            SELECT COUNT(*) as total
            FROM bookings b
            WHERE 1=1
        `;
        const countValues = [];
        let countParamCount = 0;

        if (filters.status) {
            countParamCount++;
            countQuery += ` AND b.status = $${countParamCount}`;
            countValues.push(filters.status);
        }

        if (filters.startDate) {
            countParamCount++;
            countQuery += ` AND b.booking_date >= $${countParamCount}`;
            countValues.push(filters.startDate);
        }

        if (filters.endDate) {
            countParamCount++;
            countQuery += ` AND b.booking_date <= $${countParamCount}`;
            countValues.push(filters.endDate);
        }

        const { rows: countRows } = await pool.query(countQuery, countValues);
        const total = parseInt(countRows[0].total);
        
        // Build data query
        let query = `
            SELECT b.id, b.service_id, s.title as service_title, b.client_id, c.full_name as client_name, 
                   b.provider_id, p.full_name as provider_name, b.booking_date, b.booking_time, 
                   b.user_location, b.status, b.total_price, b.notes, b.created_at, b.updated_at
            FROM bookings b
            JOIN services s ON b.service_id = s.id
            JOIN users c ON b.client_id = c.id
            JOIN users p ON b.provider_id = p.id
            WHERE 1=1
        `;
        const values = [];
        let paramCount = 0;

        if (filters.status) {
            paramCount++;
            query += ` AND b.status = $${paramCount}`;
            values.push(filters.status);
        }

        if (filters.startDate) {
            paramCount++;
            query += ` AND b.booking_date >= $${paramCount}`;
            values.push(filters.startDate);
        }

        if (filters.endDate) {
            paramCount++;
            query += ` AND b.booking_date <= $${paramCount}`;
            values.push(filters.endDate);
        }

        paramCount++;
        query += ` ORDER BY b.created_at DESC LIMIT $${paramCount}`;
        values.push(limit);
        
        paramCount++;
        query += ` OFFSET $${paramCount}`;
        values.push(offset);

        const { rows } = await pool.query(query, values);
        return { data: rows, total };
    } catch (error) {
        console.error('Error fetching bookings:', error.message);
        throw error;
    }
};

const fetchBookingById = async (id) => {
    try {
        const query = `
            SELECT b.id, b.service_id, s.title as service_title, b.client_id, c.full_name as client_name, 
                   b.provider_id, p.full_name as provider_name, b.booking_date, b.booking_time, 
                   b.user_location, b.status, b.total_price, b.notes, b.created_at, b.updated_at
            FROM bookings b
            JOIN services s ON b.service_id = s.id
            JOIN users c ON b.client_id = c.id
            JOIN users p ON b.provider_id = p.id
            WHERE b.id = $1
        `;
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    } catch (error) {
        console.error('Error fetching booking:', error.message);
        throw error;
    }
};

// ============ REVIEW MODERATION ============

const fetchReviews = async (page = 1, limit = 10, filters = {}) => {
    try {
        const offset = (page - 1) * limit;
        
        // Build count query
        let countQuery = `
            SELECT COUNT(*) as total
            FROM reviews r
            WHERE 1=1
        `;
        const countValues = [];
        let countParamCount = 0;

        if (filters.rating) {
            countParamCount++;
            countQuery += ` AND r.rating = $${countParamCount}`;
            countValues.push(filters.rating);
        }

        if (filters.provider_id) {
            countParamCount++;
            countQuery += ` AND r.provider_id = $${countParamCount}`;
            countValues.push(filters.provider_id);
        }

        const { rows: countRows } = await pool.query(countQuery, countValues);
        const total = parseInt(countRows[0].total);
        
        // Build data query
        let query = `
            SELECT r.id, r.booking_id, r.client_id, c.full_name as "reviewerName", 
                   r.provider_id, p.full_name as "providerName", r.rating, r.comment, r.review_date as date
            FROM reviews r
            JOIN users c ON r.client_id = c.id
            JOIN users p ON r.provider_id = p.id
            WHERE 1=1
        `;
        const values = [];
        let paramCount = 0;

        if (filters.rating) {
            paramCount++;
            query += ` AND r.rating = $${paramCount}`;
            values.push(filters.rating);
        }

        if (filters.provider_id) {
            paramCount++;
            query += ` AND r.provider_id = $${paramCount}`;
            values.push(filters.provider_id);
        }

        paramCount++;
        query += ` ORDER BY r.review_date DESC LIMIT $${paramCount}`;
        values.push(limit);
        
        paramCount++;
        query += ` OFFSET $${paramCount}`;
        values.push(offset);

        const { rows } = await pool.query(query, values);
        return { data: rows, total };
    } catch (error) {
        console.error('Error fetching reviews:', error.message);
        throw error;
    }
};

const fetchReviewById = async (id) => {
    try {
        const query = `
            SELECT r.id, r.booking_id, r.client_id, c.full_name as "clientName", 
                   r.provider_id, p.full_name as "providerName", r.rating, r.comment, r.review_date
            FROM reviews r
            JOIN users c ON r.client_id = c.id
            JOIN users p ON r.provider_id = p.id
            WHERE r.id = $1
        `;
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    } catch (error) {
        console.error('Error fetching review:', error.message);
        throw error;
    }
};

const deleteReviewById = async (id) => {
    try {
        const query = 'DELETE FROM reviews WHERE id = $1 RETURNING id, booking_id, rating, comment';
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    } catch (error) {
        console.error('Error deleting review:', error.message);
        throw error;
    }
};

// ============ DASHBOARD METRICS ============

const getDashboardMetrics = async () => {
    try {
        const queries = [
            { name: 'totalUsers', query: 'SELECT COUNT(*) as count FROM users' },
            { name: 'totalProviders', query: 'SELECT COUNT(*) as count FROM users WHERE user_type = $1', params: ['provider'] },
            { name: 'activeServices', query: 'SELECT COUNT(*) as count FROM services WHERE is_active = TRUE' },
            { name: 'bookingsToday', query: 'SELECT COUNT(*) as count FROM bookings WHERE DATE(created_at) = CURRENT_DATE' },
            { name: 'pendingBookings', query: 'SELECT COUNT(*) as count FROM bookings WHERE status = $1', params: ['pending'] },
            { name: 'completedBookings', query: 'SELECT COUNT(*) as count FROM bookings WHERE status = $1', params: ['completed'] },
            { name: 'openReports', query: 'SELECT 0 as count' }, // Placeholder - implement when reports table exists
            { name: 'totalTransactions', query: 'SELECT COALESCE(SUM(total_price), 0) as total FROM bookings WHERE status = $1', params: ['completed'] }
        ];

        const metrics = {};

        for (const q of queries) {
            const { rows } = await pool.query(q.query, q.params || []);
            if (q.name === 'totalTransactions') {
                metrics[q.name] = parseFloat(rows[0].total);
            } else {
                metrics[q.name] = parseInt(rows[0].count);
            }
        }

        metrics.timestamp = new Date().toISOString();
        return metrics;
    } catch (error) {
        console.error('Error fetching dashboard metrics:', error.message);
        throw error;
    }
};

module.exports = {
    // User Management
    fetchUsers,
    fetchUserById,
    updateUserStatus,
    verifyProviderAccount,
    // Category Management
    fetchCategories,
    createNewCategory,
    updateCategoryData,
    checkCategoryUsage,
    deleteCategoryById,
    // Service Moderation
    fetchServices,
    fetchServiceById,
    toggleServiceActive,
    // Booking Monitoring
    fetchBookings,
    fetchBookingById,
    // Review Moderation
    fetchReviews,
    fetchReviewById,
    deleteReviewById,
    // Dashboard
    getDashboardMetrics
};
