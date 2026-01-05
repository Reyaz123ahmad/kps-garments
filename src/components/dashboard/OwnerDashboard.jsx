import React, { useState, useEffect } from 'react';
import { Package, Users, ShoppingBag, Truck, Send } from 'lucide-react';
import { useAllOrders, useUpdateOrderStatus, useCancelOrder } from '../../hooks/useOrders';
import OrderDetailsModal from '../orders/OrderDetailsModal';
import LoadingSpinner from '../ui/LoadingSpinner';
import { ORDER_STATUS } from '../../constants/config';
import { orderAPI } from '../../services/api/orders';

const OwnerDashboard = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [agents, setAgents] = useState([]); 
  const [selectedAgents, setSelectedAgents] = useState({});
  const [isShipping, setIsShipping] = useState(false);

  const { data: ordersResponse, isLoading, error, refetch } = useAllOrders();
  const updateOrderStatusMutation = useUpdateOrderStatus();
  const cancelOrderMutation = useCancelOrder();

  //safe fallback
  const orders = Array.isArray(ordersResponse?.data?.orders) ? ordersResponse.data.orders : [];

  // Fetch agents
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        
        const response = await orderAPI.getAgents();
        setAgents(response.data?.agents || [])
        
        
      } catch (err) {
        console.error('Error fetching agents:', err);
        setAgents([]); // fallback
      }
    };
    fetchAgents();
  }, []);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === ORDER_STATUS.PENDING).length,
    confirmed: orders.filter(o => o.status === ORDER_STATUS.CONFIRMED).length,
    shipped: orders.filter(o => o.status === ORDER_STATUS.SHIPPED).length,
    delivered: orders.filter(o => o.status === ORDER_STATUS.DELIVERED).length,
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    await updateOrderStatusMutation.mutateAsync({ id: orderId, status: newStatus });
    setSelectedOrder(null);
  };

  const handleCancelOrder = async (orderId) => {
    await cancelOrderMutation.mutateAsync(orderId);
    setSelectedOrder(null);
  };

  const handleAssignToAgent = async (orderId) => {
    if (!selectedAgents[orderId]) {
      alert('Please select an agent');
      return;
    }

    setIsShipping(true);
    try {
      await orderAPI.assignAgent(orderId, selectedAgents[orderId]);
      alert('Order shipped successfully! OTP sent to customer via email.');
      refetch();
      setSelectedOrder(null);
      setSelectedAgents(prev => ({ ...prev, [orderId]: '' }));
      

      
    } catch (err) {
      alert(err.response?.data?.message || 'Error shipping order');
    } finally {
      setIsShipping(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading all orders..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Failed to load orders</h2>
        <p className="text-gray-600">Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">All Customer Orders</h2>
        <p className="text-gray-600">Manage and track all customer orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* stats cards */}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-600">Customer orders will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-lg shadow border p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold">Order #{order._id}</h4>
                  <p className="text-gray-600">
                    Customer: {order.user?.firstName ?? ''} {order.user?.lastName ?? ''}
                  </p>
                  <p className="text-gray-600">
                    Status:
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </p>
                  {order.assignedAgent && (
                    <p className="text-gray-600">
                      Agent: {order.assignedAgent?.firstName ?? ''} {order.assignedAgent?.lastName ?? ''}
                    </p>
                  )}
                </div>

                <div className="flex space-x-2">
                  {order.status === 'confirmed' && (
                    <div className="flex items-center space-x-2">
                      <select
                        value={selectedAgents[order._id] || ""}
                        onChange={(e) => setSelectedAgents(prev=>({...prev, [order._id]: e.target.value}))}
                        className="border rounded px-3 py-2 text-sm"
                      >
                        <option value="">Select Agent</option>
                        {Array.isArray(agents) && agents.map(agent => (
                          <option key={agent._id} value={agent._id}>
                            {agent.firstName} {agent.lastName} - {agent.phone}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleAssignToAgent(order._id)}
                        disabled={!selectedAgents[order._id] || isShipping}

                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300 flex items-center"
                      >
                        <Send size={16} className="mr-1" />
                        {isShipping ? 'Shipping...' : 'Ship Order'}
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={(newStatus) => handleStatusUpdate(selectedOrder._id, newStatus)}
          onCancel={() => handleCancelOrder(selectedOrder._id)}
          showCancelButton={true}
          showUpdateButton={true}
          cancelLoading={cancelOrderMutation.isLoading}
        />
      )}
    </div>
  );
};

export default OwnerDashboard;
