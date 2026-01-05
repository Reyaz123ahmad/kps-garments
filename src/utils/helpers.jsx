/**
 * Debounce function for search inputs
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Check if order is editable (within 5 minutes)
 */
export const isOrderEditable = (order) => {
  if (!order || order.status !== 'confirmed') return false;
  
  const orderTime = new Date(order.createdAt).getTime();
  const currentTime = new Date().getTime();
  const timeDiff = currentTime - orderTime;
  const fiveMinutes = 5 * 60 * 1000;
  
  return timeDiff <= fiveMinutes;
};

/**
 * Calculate time remaining for order edit
 */
export const calculateTimeRemaining = (order) => {
  if (!isOrderEditable(order)) return 0;
  
  const orderTime = new Date(order.createdAt).getTime();
  const currentTime = new Date().getTime();
  const timeDiff = currentTime - orderTime;
  const fiveMinutes = 5 * 60 * 1000;
  
  return Math.max(0, fiveMinutes - timeDiff);
};

/**
 * Get status color class
 */
export const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export default {
  debounce,
  isOrderEditable,
  calculateTimeRemaining,
  getStatusColor,
};
