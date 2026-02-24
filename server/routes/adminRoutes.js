const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken } = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const {
    validatePagination,
    validateUserIdParam,
    validateServiceIdParam,
    validateBookingIdParam,
    validateReviewIdParam,
    validateCategoryIdParam,
    validateRoleFilter,
    validateStatusFilter,
    validateRatingFilter,
    validateCategoryBody
} = require('../middlewares/adminValidation');

// Apply admin authorization to all routes
router.use(verifyToken, authorizeRoles('admin'));

// ============ USER MANAGEMENT ============
router.get('/users', validatePagination, validateRoleFilter, adminController.getUsers);
router.get('/users/:id', validateUserIdParam, adminController.getUserById);
router.patch('/users/:id/activate', validateUserIdParam, adminController.activateUser);
router.patch('/users/:id/deactivate', validateUserIdParam, adminController.deactivateUser);
router.patch('/users/:id/verify', validateUserIdParam, adminController.verifyProvider);

// ============ CATEGORY MANAGEMENT ============
router.get('/categories', adminController.getCategories);
router.post('/categories', validateCategoryBody, adminController.createCategory);
router.put('/categories/:id', validateCategoryIdParam, validateCategoryBody, adminController.updateCategory);
router.delete('/categories/:id', validateCategoryIdParam, adminController.deleteCategory);

// ============ SERVICE MODERATION ============
router.get('/services', validatePagination, adminController.getServices);
router.get('/services/:id', validateServiceIdParam, adminController.getServiceById);
router.patch('/services/:id/toggle', validateServiceIdParam, adminController.toggleServiceStatus);

// ============ BOOKING MONITORING ============
router.get('/bookings', validatePagination, validateStatusFilter, adminController.getBookings);
router.get('/bookings/:id', validateBookingIdParam, adminController.getBookingById);

// ============ REVIEW MODERATION ============
router.get('/reviews', validatePagination, validateRatingFilter, adminController.getReviews);
router.get('/reviews/:id', validateReviewIdParam, adminController.getReviewById);
router.delete('/reviews/:id', validateReviewIdParam, adminController.deleteReview);

// ============ DASHBOARD ============
router.get('/dashboard', adminController.getDashboardMetrics);

// ============ APPLICATION MANAGEMENT ============
router.get('/applications', adminController.getApplications);
router.patch('/applications/:id/approve', adminController.approveApplication);
router.patch('/applications/:id/reject', adminController.rejectApplication);

module.exports = router;
