export const CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1',
  RAZORPAY_KEY: import.meta.env.VITE_RAZORPAY_KEY,
  APP_NAME: import.meta.env.VITE_APP_NAME || 'KPS Garments',
  NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development',
};

export const PAGINATION = {
  PRODUCTS_PER_PAGE: 10,
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const USER_ROLES = {
  OWNER: 'Owner',
  CUSTOMER: 'Customer'
};

export const PRODUCT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
