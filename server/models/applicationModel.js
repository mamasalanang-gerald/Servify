const pool = require('../config/DB');

/**
 * Create a new provider application
 * @param {string} userId - User ID submitting the application
 * @param {object} applicationData - Application data
 * @returns {Promise<object>} Created application
 */
const createApplication = async (userId, applicationData) => {
    const {
        businessName,
        bio,
        yearsOfExperience,
        serviceCategories,
        phoneNumber,
        serviceAddress
    } = applicationData;

    const query = `
        INSERT INTO provider_applications (
            user_id, business_name, bio, years_of_experience,
            service_categories, phone_number, service_address, status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
        RETURNING *
    `;
    
    const values = [
        userId,
        businessName,
        bio,
        yearsOfExperience,
        serviceCategories,
        phoneNumber,
        serviceAddress
    ];
    
    const { rows } = await pool.query(query, values);
    return rows[0];
};

/**
 * Get application by ID
 * @param {string} id - Application ID
 * @returns {Promise<object|null>} Application or null
 */
const getApplicationById = async (id) => {
    const query = 'SELECT * FROM provider_applications WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
};

/**
 * Get application by user ID
 * @param {string} userId - User ID
 * @returns {Promise<object|null>} Most recent application or null
 */
const getApplicationByUserId = async (userId) => {
    const query = `
        SELECT * FROM provider_applications 
        WHERE user_id = $1 
        ORDER BY submitted_at DESC 
        LIMIT 1
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows[0] || null;
};

/**
 * Get pending application by user ID
 * @param {string} userId - User ID
 * @returns {Promise<object|null>} Pending application or null
 */
const getPendingApplicationByUserId = async (userId) => {
    const query = `
        SELECT * FROM provider_applications 
        WHERE user_id = $1 AND status = 'pending'
        LIMIT 1
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows[0] || null;
};

/**
 * Update application status
 * @param {string} id - Application ID
 * @param {string} status - New status ('approved' or 'rejected')
 * @param {string} reviewerId - Admin user ID
 * @param {string|null} rejectionReason - Reason for rejection (required if status is 'rejected')
 * @returns {Promise<object>} Updated application
 */
const updateApplicationStatus = async (id, status, reviewerId, rejectionReason = null) => {
    const query = `
        UPDATE provider_applications 
        SET status = $1, reviewed_at = NOW(), reviewed_by = $2, rejection_reason = $3
        WHERE id = $4
        RETURNING *
    `;
    const values = [status, reviewerId, rejectionReason, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

/**
 * Get all applications with optional filtering
 * @param {object} filters - Filter options
 * @param {object} pagination - Pagination options
 * @returns {Promise<object>} Applications and metadata
 */
const getAllApplications = async (filters = {}, pagination = {}) => {
    const { status, search } = filters;
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    let query = `
        SELECT 
            pa.*,
            u.full_name as applicant_name,
            u.email as applicant_email,
            reviewer.full_name as reviewer_name
        FROM provider_applications pa
        JOIN users u ON pa.user_id = u.id
        LEFT JOIN users reviewer ON pa.reviewed_by = reviewer.id
        WHERE 1=1
    `;
    
    const values = [];
    let paramCount = 1;

    if (status && status !== 'all') {
        query += ` AND pa.status = $${paramCount}`;
        values.push(status);
        paramCount++;
    }

    if (search) {
        query += ` AND (u.full_name ILIKE $${paramCount} OR u.email ILIKE $${paramCount})`;
        values.push(`%${search}%`);
        paramCount++;
    }

    query += ` ORDER BY pa.submitted_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);

    const { rows } = await pool.query(query, values);

    // Get total count
    let countQuery = `
        SELECT COUNT(*) as total
        FROM provider_applications pa
        JOIN users u ON pa.user_id = u.id
        WHERE 1=1
    `;
    
    const countValues = [];
    let countParamCount = 1;

    if (status && status !== 'all') {
        countQuery += ` AND pa.status = $${countParamCount}`;
        countValues.push(status);
        countParamCount++;
    }

    if (search) {
        countQuery += ` AND (u.full_name ILIKE $${countParamCount} OR u.email ILIKE $${countParamCount})`;
        countValues.push(`%${search}%`);
    }

    const countResult = await pool.query(countQuery, countValues);
    const total = parseInt(countResult.rows[0].total);

    // Get status counts
    const countsQuery = `
        SELECT 
            COUNT(*) FILTER (WHERE status = 'pending') as pending,
            COUNT(*) FILTER (WHERE status = 'approved') as approved,
            COUNT(*) FILTER (WHERE status = 'rejected') as rejected
        FROM provider_applications
    `;
    const countsResult = await pool.query(countsQuery);
    const counts = countsResult.rows[0];

    return {
        applications: rows,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        },
        counts: {
            pending: parseInt(counts.pending),
            approved: parseInt(counts.approved),
            rejected: parseInt(counts.rejected)
        }
    };
};

module.exports = {
    createApplication,
    getApplicationById,
    getApplicationByUserId,
    getPendingApplicationByUserId,
    updateApplicationStatus,
    getAllApplications
};
