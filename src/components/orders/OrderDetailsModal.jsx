import React, { useState } from 'react';
import { X, User, Mail, Phone, MapPin, Package, IndianRupee, Calendar, Eye, EyeOff } from 'lucide-react';
import Button from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { formatDateTime } from '../../utils/formatters';
import { getStatusColor } from '../../utils/helpers';
import { maskEmail, maskPhone, maskName, maskAddress } from '../../utils/security';

const OrderDetailsModal = ({ 
  order, 
  onClose, 
  onCancel,
  onStatusUpdate,
  showCancelButton = false,
  showUpdateButton = false,
  cancelLoading = false
}) => {
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);

  const statusColor = getStatusColor(order.status);

  const handleStatusUpdate = (newStatus) => {
    onStatusUpdate?.(newStatus);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold">
            Order Details - #{order._id.slice(-8).toUpperCase()}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <User className="h-5 w-5 mr-2" />
                Customer Information
              </h3>
              <button
                onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                {showSensitiveInfo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span>{showSensitiveInfo ? 'Hide Details' : 'Show Details'}</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">
                    {showSensitiveInfo 
                      ? `${order.user?.firstName} ${order.user?.lastName}`
                      : `${maskName(order.user?.firstName)} ${maskName(order.user?.lastName)}`
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">
                    {showSensitiveInfo ? order.user?.email : maskEmail(order.user?.email)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">
                    {showSensitiveInfo ? order.user?.phone : maskPhone(order.user?.phone)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-medium">
                    {formatDateTime(order.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Shipping Address
            </h3>
            <div className="space-y-2">
              <p className="font-medium">
                {showSensitiveInfo 
                  ? order.shippingAddress.street
                  : maskAddress(order.shippingAddress.street)
                }
              </p>
              <p>
                {showSensitiveInfo 
                  ? `${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`
                  : `${maskAddress(order.shippingAddress.city)}, ${maskAddress(order.shippingAddress.state)} - ${order.shippingAddress.pincode?.slice(0,2)}***`
                }
              </p>
              <p className="text-gray-600">
                Phone: {showSensitiveInfo ? order.shippingAddress.phone : maskPhone(order.shippingAddress.phone)}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Order Items
            </h3>
            <div className="space-y-3">
              {order.products.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-white rounded border">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Size: {item.size} • Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold flex items-center">
                    <IndianRupee className="h-4 w-4 mr-1" />
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600">Status</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
                  {order.status}
                </span>
              </div>
              <div className="text-right">
                <p className="text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold flex items-center justify-end">
                  <IndianRupee className="h-5 w-5 mr-1" />
                  {formatCurrency(order.totalAmount)}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            {showCancelButton && order.status !== 'cancelled' && order.status !== 'delivered' && (
              <Button
                onClick={onCancel}
                loading={cancelLoading}
                variant="danger"
              >
                Cancel Order
              </Button>
            )}

            {showUpdateButton && order.status !== 'cancelled' && order.status !== 'delivered' && (
              <div className="flex space-x-2">
                {order.status === 'pending' && (
                  <Button
                    onClick={() => handleStatusUpdate('confirmed')}
                  >
                    Confirm Order
                  </Button>
                )}
                {order.status === 'confirmed' && (
                  <Button
                    onClick={() => handleStatusUpdate('shipped')}
                  >
                    Mark as Shipped
                  </Button>
                )}
                {order.status === 'shipped' && (
                  <Button
                    onClick={() => handleStatusUpdate('delivered')}
                  >
                    Mark as Delivered
                  </Button>
                )}
              </div>
            )}

            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
