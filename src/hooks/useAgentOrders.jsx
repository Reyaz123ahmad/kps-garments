import { orderAPI } from '../services/api/orders';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
export const useAgentOrders = () => {
  return useQuery({
    queryKey: ['agent-orders'],
    queryFn: () => orderAPI.getAgentOrders(),
    staleTime: 2 * 60 * 1000,
  });
};

export const useVerifyDelivery = () => {
  return useMutation({
    mutationFn: ({ id, otp }) => orderAPI.verifyDelivery(id, { otp }),
    onSuccess: () => {
      toast.success('Delivery verified successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to verify delivery');
    },
  });
};
