// import apiClient from '../apiClient';

// export const productAPI = {
//   getAll: () => apiClient.get('/product/getAllProducts'),
//   getById: (id) => apiClient.get(`/product/getProductById/${id}`),
//   create: (productData) => apiClient.post('/product/createProducts', productData),
//   update: (id, productData) => apiClient.put(`/product/updateProduct/${id}`, productData),
//   delete: (id) => apiClient.delete(`/product/deleteProduct/${id}`),
// };






import apiClient from '../apiClient';

export const productAPI = {
  getAll: () => apiClient.get('/product/getAllProducts'),
  getById: (id) => apiClient.get(`/product/getProductById/${id}`),
  create: (productData) =>
    apiClient.post('/product/createProducts', productData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    }),
  update: (id, productData) =>
    apiClient.put(`/product/updateProduct/${id}`, productData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    }),
  delete: (id) => apiClient.delete(`/product/deleteProduct/${id}`),
};
