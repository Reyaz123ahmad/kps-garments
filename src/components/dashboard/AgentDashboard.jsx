import React, { useState, useEffect } from 'react';
import { Package, CheckCircle, Clock, Truck } from 'lucide-react';
import { orderAPI } from '../../services/api/orders';
import LoadingSpinner from '../ui/LoadingSpinner';

const AgentDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [delivering, setDelivering] = useState(false);
  const [otpMap, setOtpMap] = useState({});

  useEffect(() => {
    fetchAgentOrders();
  }, []);

  const fetchAgentOrders = async () => {
    try {
      const response = await orderAPI.getAgentOrders();
      setOrders(response.data.orders || []);
    } catch (err) {
      console.error('Error fetching agent orders:', err);
      alert('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleDelivery = async (orderId) => {
    const otp = otpMap[orderId];
    if (!otp || otp.length !== 4) {
      alert('Please enter a valid 4-digit OTP');
      return;
    }

    setDelivering(true);
    try {
      await orderAPI.verifyDelivery(orderId, { otp }); // ✅ OTP object bhejna
      alert('Order delivered successfully!');
      setOtpMap(prev => ({ ...prev, [orderId]: '' })); // ✅ sirf us order ka OTP clear
      fetchAgentOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Error delivering order');
    } finally {
      setDelivering(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your orders..." />;
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Delivery Agent Dashboard
        </h2>
        <p className="text-gray-600">
          Manage your assigned orders and deliveries
        </p>
      </div>

      {orders && orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Truck className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No orders assigned
          </h3>
          <p className="text-gray-600">
            You don't have any orders to deliver at the moment.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow border p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <Package className="h-5 w-5 text-blue-500 mr-2" />
                    <h4 className="text-lg font-semibold">Order #{order._id}</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Customer</p>
                      <p className="font-medium">
                        {order.user?.firstName} {order.user?.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{order.user?.phone}</p>
                      <p className="text-sm text-gray-600">{order.user?.email}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Shipping Address</p>
                      <p className="font-medium">
                        {order.shippingAddress?.street}, {order.shippingAddress?.city}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'shipped' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {order.status === 'shipped' ? (
                        <>
                          <Clock size={14} className="mr-1" />
                          Out for Delivery
                        </>
                      ) : (
                        <>
                          <CheckCircle size={14} className="mr-1" />
                          Delivered
                        </>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      Total: ₹{order.totalAmount}
                    </p>
                  </div>
                </div>
                
                {/* OTP INPUT - Only for shipped orders */}
                {order.status === 'shipped' && (
                  <div className="ml-4 flex flex-col space-y-2">
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otpMap[order._id] || ''}
                      onChange={(e) =>
                        setOtpMap(prev => ({
                          ...prev,
                          [order._id]: e.target.value.replace(/\D/g, '').slice(0, 4)
                        }))
                      }
                      className="border rounded px-3 py-2 text-center text-lg font-mono tracking-widest"
                      maxLength={4}
                    />
                    <button
                      onClick={() => handleDelivery(order._id)}
                      disabled={!otpMap[order._id] || otpMap[order._id].length !== 4 || delivering}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-green-300 flex items-center justify-center"
                    >
                      <CheckCircle size={16} className="mr-1" />
                      {delivering ? 'Delivering...' : 'Mark Delivered'}
                    </button>
                  </div>
                )}
              </div>
              
              {/* Delivery confirmation */}
              {order.status === 'delivered' && order.trackingInfo?.deliveredAt && (
                <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
                  <p className="text-sm text-green-800 flex items-center">
                    <CheckCircle size={16} className="mr-1" />
                    Delivered on {new Date(order.trackingInfo.deliveredAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;
