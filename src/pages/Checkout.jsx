





import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
//import { useCreateOrder } from '../hooks/useOrders';
import { initiateRazorpayPayment } from '../services/paymentService';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatCurrency } from '../utils/formatters';
import { validatePhone, validatePincode } from '../utils/validators';
import { ROUTES } from '../constants/routes';

const Checkout = () => {
  const [formData, setFormData] = useState({
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      phone: ''
    }
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  //const createOrderMutation = useCreateOrder();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate(ROUTES.LOGIN);
    } else if (!Array.isArray(items) || items.length === 0) {
      navigate(ROUTES.CART);
    }
  }, [user, items, navigate]);

  if (!user || !Array.isArray(items) || items.length === 0) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [name]: value
      }
    }));

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

    if (!shippingAddress.street?.trim()) newErrors.street = 'Street address is required';
    if (!shippingAddress.city?.trim()) newErrors.city = 'City is required';
    if (!shippingAddress.state?.trim()) newErrors.state = 'State is required';
    if (!validatePincode(shippingAddress.pincode)) newErrors.pincode = 'Please enter a valid 6-digit pincode';
    if (!validatePhone(shippingAddress.phone)) newErrors.phone = 'Please enter a valid 10-digit phone number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentSuccess = async (orderId) => {
    try {
      await clearCart();
      navigate(ROUTES.ORDER_SUCCESS, { 
        state: { orderId }
      });
    } catch (error) {
      console.error('Cart clearance failed:', error);
    }
  };

  
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  setLoading(true);
  try {
    const payload = {
      products: items
        .filter((item) => item?.product?._id)
        .map((item) => ({
          productId: item.product._id,
          quantity: item.quantity
        })),
      totalAmount: totalPrice,
      shippingAddress: formData.shippingAddress
    };

    await initiateRazorpayPayment(payload);
  } catch (error) {
    console.error('Checkout failed:', error);
  } finally {
    setLoading(false);
  }
};


  const finalTotal = totalPrice;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p className="text-xl text-gray-600">Complete your order with secure payment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping Form */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-2xl font-semibold mb-6">Shipping Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Street */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
              <input
                type="text"
                name="street"
                value={formData.shippingAddress.street}
                onChange={handleChange}
                required
                placeholder="Enter complete street address"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.street ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
            </div>

            {/* City & State */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.shippingAddress.city}
                  onChange={handleChange}
                  required
                  placeholder="Enter city"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.shippingAddress.state}
                  onChange={handleChange}
                  required
                  placeholder="Enter state"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.state ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
              </div>
            </div>

            {/* Pincode & Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.shippingAddress.pincode}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{6}"
                  maxLength="6"
                  placeholder="6-digit pincode"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.pincode ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.shippingAddress.phone}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  maxLength="10"
                  placeholder="10-digit phone"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full mt-6">
              Proceed to Payment
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 h-fit sticky top-4">
          <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6">
            {items
              .filter((item) => item?.product?._id)
              .map((item) => (
                <div key={item.product._id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-600">
                      Size: {item.product.size} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {formatCurrency(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatCurrency(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">Free</span>
            </div>

            <div className="border-t pt-2">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-blue-600">{formatCurrency(finalTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;







