import React, { useState, useEffect } from 'react';
import { X, Clock, AlertCircle, MapPin, Phone } from 'lucide-react';
import Button from '../ui/Button';
import { formatTimeRemaining } from '../../utils/formatters';

const OrderEditModal = ({ order, onClose, onSave, timeRemaining, saving = false }) => {
  const [formData, setFormData] = useState({
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      phone: ''
    }
  });
  const [timeLeft, setTimeLeft] = useState(timeRemaining);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (order) {
      setFormData({
        shippingAddress: {
          street: order.shippingAddress.street || '',
          city: order.shippingAddress.city || '',
          state: order.shippingAddress.state || '',
          pincode: order.shippingAddress.pincode || '',
          phone: order.shippingAddress.phone || ''
        }
      });
    }
  }, [order]);

  // Update timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [name]: value
      }
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const { shippingAddress } = formData;

    if (!shippingAddress.street?.trim()) {
      newErrors.street = 'Street address is required';
    }
    if (!shippingAddress.city?.trim()) {
      newErrors.city = 'City is required';
    }
    if (!shippingAddress.state?.trim()) {
      newErrors.state = 'State is required';
    }
    if (!/^\d{6}$/.test(shippingAddress.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }
    if (!/^\d{10}$/.test(shippingAddress.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (timeLeft <= 0) {
      alert('Edit time has expired!');
      return;
    }

    if (!validateForm()) {
      return;
    }

    await onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header with Timer */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <div>
            <h2 className="text-xl font-semibold">
              Edit Shipping Details
            </h2>
            <p className="text-sm text-gray-600">
              You can update address and phone number within 5 minutes of order confirmation
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Timer Warning */}
        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mx-6 mt-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-orange-400 mr-2" />
            <div className="flex-1">
              <p className="text-sm text-orange-700">
                <strong>Time remaining: </strong>
                <span className={`font-mono ${timeLeft < 60000 ? 'text-red-600' : 'text-orange-600'}`}>
                  {formatTimeRemaining(timeLeft)}
                </span>
              </p>
              <p className="text-xs text-orange-600 mt-1">
                After this time, you won't be able to edit shipping details.
              </p>
            </div>
            <Clock className="h-5 w-5 text-orange-400" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Current Address Display */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Current Shipping Address
            </h3>
            <p className="text-sm text-blue-800">
              {order.shippingAddress.street}, {order.shippingAddress.city}<br />
              {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
              Phone: {order.shippingAddress.phone}
            </p>
          </div>

          {/* Editable Address Fields */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center text-green-700">
              <MapPin className="h-5 w-5 mr-2" />
              Update Shipping Address
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.shippingAddress.street}
                  onChange={handleChange}
                  required
                  placeholder="Enter complete street address"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.street ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.shippingAddress.city}
                  onChange={handleChange}
                  required
                  placeholder="Enter city name"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.shippingAddress.state}
                  onChange={handleChange}
                  required
                  placeholder="Enter state name"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.state ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.shippingAddress.pincode}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{6}"
                  maxLength="6"
                  placeholder="6-digit pincode"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.pincode ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.shippingAddress.phone}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  maxLength="10"
                  placeholder="10-digit phone number"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  Enter 10-digit phone number for delivery updates
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-6 border-t">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={saving}
              disabled={timeLeft <= 0}
              className="flex-1"
            >
              Update Shipping Details
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderEditModal;
