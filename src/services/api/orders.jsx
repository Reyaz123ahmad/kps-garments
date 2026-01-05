// import apiClient from '../apiClient';

// export const orderAPI = {
//   create: (orderData) => apiClient.post('/orders/create', orderData),
//   createDirect: (orderData) => apiClient.post('/orders/create-direct', orderData),
//   getHistory: () => apiClient.get('/orders/history'),
//   getAll: () => apiClient.get('/orders/admin/all'),
//   getById: (id) => apiClient.get(`/orders/${id}`),
//   cancel: (id) => apiClient.put(`/orders/cancel/${id}`),
//   update: (id, orderData) => apiClient.put(`/orders/update/${id}`, orderData),
//   updateStatus: (id, statusData) => apiClient.put(`/orders/admin/update-status/${id}`, statusData),
// }

import apiClient from '../apiClient';

export const orderAPI = {
  // Customer
  create: (orderData) => apiClient.post('/orders/create', orderData),
  createDirect: (orderData) => apiClient.post('/orders/create-direct', orderData),
  getHistory: () => apiClient.get('/orders/history'),
  getById: (id) => apiClient.get(`/orders/${id}`),
  cancel: (id) => apiClient.put(`/orders/cancel/${id}`),
  update: (id, orderData) => apiClient.put(`/orders/update/${id}`, orderData),

  // Owner
  getAll: () => apiClient.get('/orders/admin/all'),
  updateStatus: (id, statusData) => apiClient.put(`/orders/admin/update-status/${id}`, statusData),
  getAgents: () => apiClient.get('/orders/admin/agents'),
  assignAgent: (orderId, agentId) =>
  apiClient.put(`/orders/admin/assign-agent/${orderId}`, { agentId }),

  // Agent
  getAgentOrders: () => apiClient.get('/orders/agent/my-orders'),
  verifyDelivery: (orderId, data) =>
  apiClient.put(`/orders/agent/delivery/${orderId}`, data),
};
