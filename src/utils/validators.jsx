/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (10 digits)
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

/**
 * Validate pincode (6 digits)
 */
export const validatePincode = (pincode) => {
  const pincodeRegex = /^\d{6}$/;
  return pincodeRegex.test(pincode);
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  return password.length >= 6;
};

/**
 * Validate product data
 */
export const validateProduct = (product) => {
  const errors = {};
  
  if (!product.name || product.name.trim().length < 2) {
    errors.name = 'Product name must be at least 2 characters';
  }
  
  if (!product.description || product.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }
  
  if (!product.price || product.price <= 0) {
    errors.price = 'Price must be greater than 0';
  }
  
  if (!product.size) {
    errors.size = 'Size is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export default {
  validateEmail,
  validatePhone,
  validatePincode,
  validatePassword,
  validateProduct,
};
