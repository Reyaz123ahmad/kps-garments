import apiClient from '../apiClient';

export const cartAPI = {
  get: () => apiClient.get('/cart/'),
  add: (itemData) => apiClient.post('/cart/add', itemData),
  update: (itemData) => apiClient.put('/cart/update', itemData),
  remove: (productId) => apiClient.delete(`/cart/remove/${productId}`),
  clear: () => apiClient.delete('/cart/clear'),
  getCount: () => apiClient.get('/cart/count'),
};