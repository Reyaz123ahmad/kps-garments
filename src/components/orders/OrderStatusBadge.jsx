import React from 'react';
import { getStatusColor } from '../../utils/helpers';

const OrderStatusBadge = ({ status }) => {
  const statusColor = getStatusColor(status);
  
  const statusLabels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
      {statusLabels[status] || status}
    </span>
  );
};

export default OrderStatusBadge;
