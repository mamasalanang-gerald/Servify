/**
 * Application Form Validation Utilities
 * Client-side validation for provider application forms
 */

/**
 * Validate bio length (minimum 50 characters)
 * @param {string} bio - Bio text
 * @returns {string|null} Error message or null if valid
 */
export const validateBio = (bio) => {
  if (!bio || !bio.trim()) {
    return 'Bio is required';
  }
  if (bio.trim().length < 50) {
    return 'Bio must be at least 50 characters';
  }
  return null;
};

/**
 * Validate phone number format
 * @param {string} phoneNumber - Phone number
 * @returns {string|null} Error message or null if valid
 */
export const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber || !phoneNumber.trim()) {
    return 'Phone number is required';
  }
  // Allow digits, spaces, dashes, plus signs, and parentheses
  if (!/^[\d\s\-+()]+$/.test(phoneNumber)) {
    return 'Please enter a valid phone number';
  }
  return null;
};

/**
 * Validate years of experience (non-negative number)
 * @param {string|number} yearsOfExperience - Years of experience
 * @returns {string|null} Error message or null if valid
 */
export const validateYearsOfExperience = (yearsOfExperience) => {
  if (yearsOfExperience === '' || yearsOfExperience === null || yearsOfExperience === undefined) {
    return 'Years of experience is required';
  }
  const years = Number(yearsOfExperience);
  if (isNaN(years) || years < 0) {
    return 'Years of experience must be a non-negative number';
  }
  return null;
};

/**
 * Validate required field
 * @param {string} value - Field value
 * @param {string} fieldName - Name of the field for error message
 * @returns {string|null} Error message or null if valid
 */
export const validateRequired = (value, fieldName) => {
  if (!value || !value.toString().trim()) {
    return `${fieldName} is required`;
  }
  return null;
};

/**
 * Validate service categories selection
 * @param {Array} categories - Selected category IDs
 * @returns {string|null} Error message or null if valid
 */
export const validateServiceCategories = (categories) => {
  if (!categories || categories.length === 0) {
    return 'Please select at least one service category';
  }
  return null;
};

/**
 * Validate entire application form
 * @param {Object} formData - Form data object
 * @returns {Object} Object with field names as keys and error messages as values
 */
export const validateApplicationForm = (formData) => {
  const errors = {};

  const businessNameError = validateRequired(formData.businessName, 'Business name');
  if (businessNameError) errors.businessName = businessNameError;

  const bioError = validateBio(formData.bio);
  if (bioError) errors.bio = bioError;

  const experienceError = validateYearsOfExperience(formData.yearsOfExperience);
  if (experienceError) errors.yearsOfExperience = experienceError;

  const categoriesError = validateServiceCategories(formData.serviceCategories);
  if (categoriesError) errors.serviceCategories = categoriesError;

  const phoneError = validatePhoneNumber(formData.phoneNumber);
  if (phoneError) errors.phoneNumber = phoneError;

  const addressError = validateRequired(formData.serviceAddress, 'Service address');
  if (addressError) errors.serviceAddress = addressError;

  return errors;
};
