const validateUUID = (id) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
};

const validatePagination = (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (isNaN(pageNum) || pageNum < 1) {
        return res.status(400).json({ success: false, message: 'Page must be a positive integer' });
    }

    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
        return res.status(400).json({ success: false, message: 'Limit must be between 1 and 100' });
    }

    next();
};

const validateUserIdParam = (req, res, next) => {
    const { id } = req.params;
    
    if (!validateUUID(id)) {
        return res.status(400).json({ success: false, message: 'Invalid user ID format' });
    }

    next();
};

const validateServiceIdParam = (req, res, next) => {
    const { id } = req.params;
    
    if (!validateUUID(id)) {
        return res.status(400).json({ success: false, message: 'Invalid service ID format' });
    }

    next();
};

const validateBookingIdParam = (req, res, next) => {
    const { id } = req.params;
    
    if (!validateUUID(id)) {
        return res.status(400).json({ success: false, message: 'Invalid booking ID format' });
    }

    next();
};

const validateReviewIdParam = (req, res, next) => {
    const { id } = req.params;
    
    if (!validateUUID(id)) {
        return res.status(400).json({ success: false, message: 'Invalid review ID format' });
    }

    next();
};

const validateCategoryIdParam = (req, res, next) => {
    const { id } = req.params;
    const categoryId = parseInt(id);

    if (isNaN(categoryId) || categoryId < 1) {
        return res.status(400).json({ success: false, message: 'Invalid category ID format' });
    }

    next();
};

const validateRoleFilter = (req, res, next) => {
    const { role } = req.query;
    
    if (role && !['client', 'provider', 'admin'].includes(role)) {
        return res.status(400).json({ success: false, message: 'Invalid role. Must be client, provider, or admin' });
    }

    next();
};

const validateStatusFilter = (req, res, next) => {
    const { status } = req.query;
    const validStatuses = ['pending', 'accepted', 'rejected', 'completed', 'cancelled'];
    
    if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    next();
};

const validateRatingFilter = (req, res, next) => {
    const { rating } = req.query;
    
    if (rating) {
        const ratingNum = parseInt(rating);
        if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
            return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
        }
    }

    next();
};

const validateCategoryBody = (req, res, next) => {
    const { name, description } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ success: false, message: 'Category name is required and must be a non-empty string' });
    }

    if (description && typeof description !== 'string') {
        return res.status(400).json({ success: false, message: 'Description must be a string' });
    }

    next();
};

const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
    }
    next();
};

module.exports = {
    validateUUID,
    validatePagination,
    validateUserIdParam,
    validateServiceIdParam,
    validateBookingIdParam,
    validateReviewIdParam,
    validateCategoryIdParam,
    validateRoleFilter,
    validateStatusFilter,
    validateRatingFilter,
    validateCategoryBody,
    isAdmin
};