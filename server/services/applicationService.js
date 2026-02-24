const { 
    createApplication, 
    getApplicationByUserId,
    updateApplicationStatus,
    getAllApplications
} = require('../models/applicationModel');
const { getUserById, updateUserType, updateUserProfile } = require('../models/userModel');
const { validateApplicationData } = require('../utils/applicationValidation');
const pool = require('../config/DB');
const notificationService = require('./notificationService');

/**
 * Submit a provider application
 * @param {string} userId - User ID submitting the application
 * @param {object} applicationData - Application data
 * @returns {Promise<object>} Created application
 */
const submitApplication = async (userId, applicationData) => {
    // Validate application data
    const validation = validateApplicationData(applicationData);
    if (!validation.isValid) {
        throw new Error(JSON.stringify(validation.errors));
    }

    // Get user to check eligibility
    const user = await getUserById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    // Check if user is already a provider or admin
    if (user.user_type === 'provider' || user.user_type === 'admin') {
        throw new Error('Only clients can submit provider applications');
    }

    // Check for existing pending application
    const existingApplication = await getApplicationByUserId(userId);
    if (existingApplication && existingApplication.status === 'pending') {
        throw new Error('You already have a pending application');
    }

    // Check if user has a rejected application less than 30 days old
    if (existingApplication && existingApplication.status === 'rejected') {
        const rejectionDate = new Date(existingApplication.reviewed_at);
        const daysSinceRejection = (Date.now() - rejectionDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysSinceRejection < 30) {
            const reapplyDate = new Date(rejectionDate.getTime() + (30 * 24 * 60 * 60 * 1000));
            throw new Error(`You can reapply after ${reapplyDate.toLocaleDateString()}`);
        }
    }

    // Create application
    const application = await createApplication(userId, applicationData);
    
    // Send notification (non-blocking)
    notificationService.sendApplicationSubmittedNotification(userId).catch(err => {
        console.error('Failed to send notification:', err);
    });
    
    return application;
};

/**
 * Get application status for a user
 * @param {string} userId - User ID
 * @returns {Promise<object|null>} Application status or null
 */
const getMyApplicationStatus = async (userId) => {
    const application = await getApplicationByUserId(userId);
    
    if (!application) {
        return null;
    }

    const response = {
        id: application.id,
        status: application.status,
        submittedAt: application.submitted_at,
        reviewedAt: application.reviewed_at,
        rejectionReason: application.rejection_reason,
        canReapply: false,
        reapplyDate: null
    };

    // Calculate reapply eligibility for rejected applications
    if (application.status === 'rejected' && application.reviewed_at) {
        const rejectionDate = new Date(application.reviewed_at);
        const daysSinceRejection = (Date.now() - rejectionDate.getTime()) / (1000 * 60 * 60 * 24);
        
        response.canReapply = daysSinceRejection >= 30;
        if (!response.canReapply) {
            response.reapplyDate = new Date(rejectionDate.getTime() + (30 * 24 * 60 * 60 * 1000));
        }
    }

    return response;
};

/**
 * Approve a provider application
 * @param {string} applicationId - Application ID
 * @param {string} adminId - Admin ID approving the application
 * @returns {Promise<object>} Updated application
 */
const approveApplication = async (applicationId, adminId) => {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        // Get application
        const appResult = await client.query(
            'SELECT * FROM provider_applications WHERE id = $1',
            [applicationId]
        );
        
        if (appResult.rows.length === 0) {
            throw new Error('Application not found');
        }

        const application = appResult.rows[0];

        if (application.status !== 'pending') {
            throw new Error('Application has already been processed');
        }

        // Update application status
        await client.query(
            `UPDATE provider_applications 
             SET status = 'approved', reviewed_at = NOW(), reviewed_by = $1, updated_at = NOW()
             WHERE id = $2`,
            [adminId, applicationId]
        );

        // Update user type to provider and update profile with application data
        await client.query(
            `UPDATE users 
             SET user_type = 'provider', bio = $1, phone_number = $2, updated_at = NOW()
             WHERE id = $3`,
            [application.bio, application.phone_number, application.user_id]
        );

        await client.query('COMMIT');

        // Get updated application
        const updatedApp = await client.query(
            'SELECT * FROM provider_applications WHERE id = $1',
            [applicationId]
        );

        // Send notification (non-blocking)
        notificationService.sendApplicationApprovedNotification(application.user_id).catch(err => {
            console.error('Failed to send notification:', err);
        });

        return updatedApp.rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

/**
 * Reject a provider application
 * @param {string} applicationId - Application ID
 * @param {string} adminId - Admin ID rejecting the application
 * @param {string} rejectionReason - Reason for rejection
 * @returns {Promise<object>} Updated application
 */
const rejectApplication = async (applicationId, adminId, rejectionReason) => {
    if (!rejectionReason || rejectionReason.trim().length < 10) {
        throw new Error('Rejection reason must be at least 10 characters');
    }

    const application = await updateApplicationStatus(
        applicationId,
        'rejected',
        adminId,
        rejectionReason
    );

    if (!application) {
        throw new Error('Application not found');
    }

    // Send notification (non-blocking)
    notificationService.sendApplicationRejectedNotification(application.user_id, rejectionReason).catch(err => {
        console.error('Failed to send notification:', err);
    });

    return application;
};

/**
 * Get all applications with filtering
 * @param {object} filters - Filter options (status, search, page, limit)
 * @returns {Promise<object>} Applications with pagination and counts
 */
const getApplications = async (filters = {}) => {
    const { status = 'all', search = '', page = 1, limit = 10 } = filters;
    
    const result = await getAllApplications({
        status: status === 'all' ? null : status,
        search,
        page: parseInt(page),
        limit: parseInt(limit)
    });

    return result;
};

module.exports = {
    submitApplication,
    getMyApplicationStatus,
    approveApplication,
    rejectApplication,
    getApplications
};
