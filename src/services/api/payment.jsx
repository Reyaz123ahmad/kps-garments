import apiClient from '../apiClient';

export const paymentAPI = {
  capture: (paymentData) => apiClient.post('/payment/capture', paymentData),
  verify: (verificationData) => apiClient.post('/payment/verify', verificationData),
};