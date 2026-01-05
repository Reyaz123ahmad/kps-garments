import apiClient from '../apiClient';

export const authAPI = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  signup: (userData) => apiClient.post('/auth/signup', userData),
  sendOTP: (emailData) => apiClient.post('/auth/sendotp', emailData),
};