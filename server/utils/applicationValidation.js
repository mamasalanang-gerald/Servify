/**
 * Validate application data
 * @param {object} data - Application data to validate
 * @returns {object} { isValid: boolean, errors: object }
 */
const validateApplicationData = (data) => {
    const errors = {};

    // Validate required fields
    if (!data.businessName || typeof data.businessName !== 'string' || data.businessName.trim().length === 0) {
        errors.businessName = 'Business name is required';
    } else if (data.businessName.trim().length < 2 || data.businessName.trim().length > 100) {
        errors.businessName = 'Business name must be between 2 and 100 characters';
    }

    if (!data.bio || typeof data.bio !== 'string' || data.bio.trim().length === 0) {
        errors.bio = 'Bio is required';
    } else if (data.bio.trim().length < 50) {
        errors.bio = 'Bio must be at least 50 characters';
    }

    if (data.yearsOfExperience === undefined || data.yearsOfExperience === null) {
        errors.yearsOfExperience = 'Years of experience is required';
    } else if (typeof data.yearsOfExperience !== 'number' || isNaN(data.yearsOfExperience)) {
        errors.yearsOfExperience = 'Years of experience must be a valid number';
    } else if (data.yearsOfExperience < 0) {
        errors.yearsOfExperience = 'Years of experience cannot be negative';
    }

    if (!data.serviceCategories || !Array.isArray(data.serviceCategories) || data.serviceCategories.length === 0) {
        errors.serviceCategories = 'At least one service category is required';
    }

    if (!data.phoneNumber || typeof data.phoneNumber !== 'string' || data.phoneNumber.trim().length === 0) {
        errors.phoneNumber = 'Phone number is required';
    } else if (!validatePhoneNumber(data.phoneNumber)) {
        errors.phoneNumber = 'Phone number format is invalid';
    }

    if (!data.serviceAddress || typeof data.serviceAddress !== 'string' || data.serviceAddress.trim().length === 0) {
        errors.serviceAddress = 'Service address is required';
    } else if (data.serviceAddress.trim().length < 5 || data.serviceAddress.trim().length > 255) {
        errors.serviceAddress = 'Service address must be between 5 and 255 characters';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Validate phone number format
 * @param {string} phoneNumber - Phone number to validate
 * @returns {boolean} True if valid
 */
const validatePhoneNumber = (phoneNumber) => {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Check if it has at least 10 digits
    if (cleaned.length < 10) {
        return false;
    }
    
    // Basic phone number pattern (allows various formats)
    const phonePattern = /^[\d\s\-\+\(\)]+$/;
    return phonePattern.test(phoneNumber);
};

module.exports = {
    validateApplicationData,
    validatePhoneNumber
};
