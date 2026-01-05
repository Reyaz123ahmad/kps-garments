

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderAPI } from '../services/api/orders';
import toast from 'react-hot-toast';

export const useOrderHistory = () => {
  return useQuery({
    queryKey: ['order-history'],
    queryFn: () => orderAPI.getHistory(),
    staleTime: 2 * 60 * 1000,
  });
};

export const useAllOrders = () => {
  return useQuery({
    queryKey: ['all-orders'],
    queryFn: () => orderAPI.getAll(),
    staleTime: 2 * 60 * 1000,
  });
};

export const useOrder = (id) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => orderAPI.getById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: orderAPI.create,
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create order');
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderAPI.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-history'] });
      queryClient.invalidateQueries({ queryKey: ['all-orders'] });
      toast.success('Order cancelled successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => orderAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-history'] });
      toast.success('Order updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update order');
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => orderAPI.updateStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-history'] });
      toast.success('Order status updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    },
  });
};
