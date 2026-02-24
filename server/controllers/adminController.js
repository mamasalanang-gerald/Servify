const adminService = require('../services/adminService');

// ============ USER MANAGEMENT ============

const getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, role } = req.query;
        
        // Convert 'null' string or empty string to actual null
        const roleFilter = (role && role !== 'null' && role !== '') ? role : null;
        
        const result = await adminService.fetchUsers(page, limit, roleFilter);
        
        // Transform data to match frontend expectations
        const transformedUsers = result.data.map(user => ({
            id: user.id,
            name: user.full_name,
            email: user.email,
            role: user.user_type,
            status: user.is_active ? 'active' : 'inactive',
            verificationStatus: user.is_verified ? 'verified' : 'pending',
            joinedDate: user.created_at || null,
            servicesCount: user.services_count || 0,
            rating: user.avg_rating || null
        }));
        
        res.status(200).json({
            success: true,
            data: transformedUsers,
            page: parseInt(page),
            limit: parseInt(limit),
            total: result.total,
            totalPages: Math.ceil(result.total / limit)
        });
    } catch (err) {
        console.error('Admin getUsers error:', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await adminService.fetchUserById(id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

const activateUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Prevent self-deactivation
        if (req.user.id === id) {
            return res.status(400).json({ success: false, message: 'Cannot deactivate your own account' });
        }

        const user = await adminService.updateUserStatus(id, true);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        
        res.status(200).json({ success: true, message: 'User activated', data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

const deactivateUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Prevent self-deactivation
        if (req.user.id === id) {
            return res.status(400).json({ success: false, message: 'Cannot deactivate your own account' });
        }

        const user = await adminService.updateUserStatus(id, false);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        
        res.status(200).json({ success: true, message: 'User deactivated', data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

const verifyProvider = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await adminService.fetchUserById(id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        
        if (user.user_type !== 'provider') {
            return res.status(400).json({ success: false, message: 'User is not a provider' });
        }

        const updatedUser = await adminService.verifyProviderAccount(id);
        res.status(200).json({ success: true, message: 'Provider verified', data: updatedUser });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

// ============ CATEGORY MANAGEMENT ============

const getCategories = async (req, res) => {
    try {
        const categories = await adminService.fetchCategories();
        res.status(200).json({ success: true, data: categories });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        
        if (!name || name.trim() === '') {
            return res.status(400).json({ success: false, message: 'Category name is required' });
        }

        const category = await adminService.createNewCategory(name, description);
        res.status(201).json({ success: true, message: 'Category created', data: category });
    } catch (err) {
        if (err.message.includes('duplicate')) {
            return res.status(409).json({ success: false, message: 'Category name already exists' });
        }
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        
        if (!name || name.trim() === '') {
            return res.status(400).json({ success: false, message: 'Category name is required' });
        }

        const category = await adminService.updateCategoryData(id, name, description);
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
        
        res.status(200).json({ success: true, message: 'Category updated', data: category });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        
        const usage = await adminService.checkCategoryUsage(id);
        if (usage > 0) {
            return res.status(400).json({ 
                success: false, 
                message: `Cannot delete category. It is used by ${usage} service(s)` 
            });
        }

        const category = await adminService.deleteCategoryById(id);
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
        
        res.status(200).json({ success: true, message: 'Category deleted', data: category });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

// ============ SERVICE MODERATION ============

const getServices = async (req, res) => {
    try {
        const { page = 1, limit = 10, provider_id, category_id, search } = req.query;
        const result = await adminService.fetchServices(page, limit, { provider_id, category_id, search });
        
        // Transform data to match frontend expectations
        const transformedServices = result.data.map(service => ({
            id: service.id,
            name: service.title,
            provider: service.provider_name,
            category: service.category_name || 'Uncategorized',
            price: service.price,
            status: service.is_active ? 'active' : 'inactive'
        }));
        
        res.status(200).json({
            success: true,
            data: transformedServices,
            page: parseInt(page),
            limit: parseInt(limit),
            total: result.total,
            totalPages: Math.ceil(result.total / limit)
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

const getServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await adminService.fetchServiceById(id);
        if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
        res.status(200).json({ success: true, data: service });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

const toggleServiceStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await adminService.toggleServiceActive(id);
        if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
        res.status(200).json({ success: true, message: 'Service status toggled', data: service });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

// ============ BOOKING MONITORING ============

const getBookings = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, startDate, endDate } = req.query;
        
        // Filter out null/undefined values
        const filters = {};
        if (status && status !== 'null') filters.status = status;
        if (startDate && startDate !== 'null') filters.startDate = startDate;
        if (endDate && endDate !== 'null') filters.endDate = endDate;
        
        const result = await adminService.fetchBookings(page, limit, filters);
        
        // Transform data to match frontend expectations
        const transformedBookings = result.data.map(booking => ({
            id: booking.id,
            clientName: booking.client_name,
            providerName: booking.provider_name,
            service: booking.service_title,
            date: new Date(booking.booking_date).toLocaleDateString(),
            status: booking.status,
            amount: booking.total_price
        }));
        
        res.status(200).json({
            success: true,
            data: transformedBookings,
            page: parseInt(page),
            limit: parseInt(limit),
            total: result.total,
            totalPages: Math.ceil(result.total / limit)
        });
    } catch (err) {
        console.error('Admin getBookings error:', err);
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await adminService.fetchBookingById(id);
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
        res.status(200).json({ success: true, data: booking });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

// ============ REVIEW MODERATION ============

const getReviews = async (req, res) => {
    try {
        const { page = 1, limit = 10, rating, provider_id } = req.query;
        const result = await adminService.fetchReviews(page, limit, { rating, provider_id });
        res.status(200).json({
            success: true,
            data: result.data,
            page: parseInt(page),
            limit: parseInt(limit),
            total: result.total,
            totalPages: Math.ceil(result.total / limit)
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

const getReviewById = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await adminService.fetchReviewById(id);
        if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
        res.status(200).json({ success: true, data: review });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await adminService.deleteReviewById(id);
        if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
        res.status(200).json({ success: true, message: 'Review deleted', data: review });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

// ============ DASHBOARD METRICS ============

const getDashboardMetrics = async (req, res) => {
    try {
        const metrics = await adminService.getDashboardMetrics();
        res.status(200).json({ success: true, data: metrics });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

// ============ APPLICATION MANAGEMENT ============

const getApplications = async (req, res) => {
    try {
        const { status = 'all', search = '', page = 1, limit = 10 } = req.query;
        
        const { getApplications: getApps } = require('../services/applicationService');
        const result = await getApps({ status, search, page, limit });
        
        res.status(200).json({
            success: true,
            applications: result.applications,
            pagination: result.pagination,
            counts: result.counts
        });
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve applications',
            error: error.message
        });
    }
};

const approveApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user.id;
        
        const { approveApplication: approveApp } = require('../services/applicationService');
        const application = await approveApp(id, adminId);
        
        res.status(200).json({
            success: true,
            message: 'Application approved successfully',
            application: {
                id: application.id,
                status: application.status,
                reviewedAt: application.reviewed_at,
                reviewedBy: application.reviewed_by
            }
        });
    } catch (error) {
        console.error('Approve application error:', error);
        
        if (error.message.includes('not found')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        
        if (error.message.includes('already been processed')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to approve application',
            error: error.message
        });
    }
};

const rejectApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const { rejectionReason } = req.body;
        const adminId = req.user.id;
        
        if (!rejectionReason || rejectionReason.trim().length < 10) {
            return res.status(400).json({
                success: false,
                message: 'Rejection reason must be at least 10 characters'
            });
        }
        
        const { rejectApplication: rejectApp } = require('../services/applicationService');
        const application = await rejectApp(id, adminId, rejectionReason);
        
        res.status(200).json({
            success: true,
            message: 'Application rejected',
            application: {
                id: application.id,
                status: application.status,
                reviewedAt: application.reviewed_at,
                reviewedBy: application.reviewed_by,
                rejectionReason: application.rejection_reason
            }
        });
    } catch (error) {
        console.error('Reject application error:', error);
        
        if (error.message.includes('not found')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        
        if (error.message.includes('already been processed')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to reject application',
            error: error.message
        });
    }
};

module.exports = {
    // User Management
    getUsers,
    getUserById,
    activateUser,
    deactivateUser,
    verifyProvider,
    // Category Management
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    // Service Moderation
    getServices,
    getServiceById,
    toggleServiceStatus,
    // Booking Monitoring
    getBookings,
    getBookingById,
    // Review Moderation
    getReviews,
    getReviewById,
    deleteReview,
    // Dashboard
    getDashboardMetrics,
    // Application Management
    getApplications,
    approveApplication,
    rejectApplication
};
