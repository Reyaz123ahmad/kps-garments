import React from 'react';
import { Package, Calendar, MapPin, IndianRupee } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { formatDate } from '../../utils/formatters';
import { getStatusColor } from '../../utils/helpers';

const OrderCard = ({ order, onViewDetails, showEditButton = false, onEdit, timeRemaining }) => {
  const statusColor = getStatusColor(order.status);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <Package className="h-8 w-8 text-blue-500" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Order #{order._id.slice(-8).toUpperCase()}
            </h3>
            <p className="text-sm text-gray-600">
              {order.products.length} item(s) • {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-xl font-bold text-gray-900 flex items-center justify-end">
            <IndianRupee className="h-5 w-5 mr-1" />
            {order.totalAmount}
          </p>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
            {order.status}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(order.createdAt)}
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {order.shippingAddress.city}
          </div>
        </div>

        <div className="flex space-x-2">
          {showEditButton && timeRemaining > 0 && (
            <button
              onClick={onEdit}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
            >
              Edit
            </button>
          )}
          <button
            onClick={onViewDetails}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
