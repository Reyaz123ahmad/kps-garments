import React, { useState, useEffect } from 'react';
import { useOrderHistory, useCancelOrder, useUpdateOrder } from '../../hooks/useOrders';
import OrderCard from '../orders/OrderCard';
import OrderDetailsModal from '../orders/OrderDetailsModal';
import OrderEditModal from '../orders/OrderEditModal';
import LoadingSpinner from '../ui/LoadingSpinner';
import { isOrderEditable, calculateTimeRemaining } from '../../utils/helpers';
import { formatTimeRemaining } from '../../utils/formatters';

const CustomerDashboard = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState({});
  
  const { data: ordersResponse, isLoading, error, refetch } = useOrderHistory();
  const cancelOrderMutation = useCancelOrder();
  const updateOrderMutation = useUpdateOrder();

  const orders = ordersResponse?.data?.orders || [];

  // Calculate time remaining for each order
  useEffect(() => {
    if (orders.length>0) {
      const remainingTimes = {};
      orders.forEach(order => {
        if (isOrderEditable(order)) {
          remainingTimes[order._id] = calculateTimeRemaining(order);
        }
      });
      setTimeRemaining(prev=>{
        const same = Object.keys(remainingTimes).every(
        key => remainingTimes[key] === prev[key]
      );
      return same ? prev : remainingTimes;
      });
    }
  }, [orders]);

  // Auto-update timer every second
  useEffect(() => {
    console.log("CustomerDashboard mounted");
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(orderId => {
          if (updated[orderId] > 0) {
            updated[orderId] -= 1000;
          } else {
            delete updated[orderId];
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
    
  }, []);
  
  

  const handleCancelOrder = async (orderId) => {
    await cancelOrderMutation.mutateAsync(orderId);
    setSelectedOrder(null);
  };

  const handleUpdateOrder = async (orderData) => {
    await updateOrderMutation.mutateAsync({
      id: editingOrder._id,
      data: orderData
    });
    setEditingOrder(null);
    refetch();
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading your orders..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Failed to load orders
        </h2>
        <p className="text-gray-600">
          Please try refreshing the page.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          My Orders
        </h2>
        <p className="text-gray-600">
          Track and manage your orders. You can edit orders within 5 minutes of confirmation.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No orders yet
          </h3>
          <p className="text-gray-600">
            Start shopping to see your orders here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const editable = isOrderEditable(order);
            const timeLeft = timeRemaining[order._id];
            
            return (
              <OrderCard
                key={order._id}
                order={order}
                onViewDetails={() => setSelectedOrder(order)}
                onEdit={() => setEditingOrder(order)}
                showEditButton={editable && timeLeft > 0}
                timeRemaining={timeLeft}
              />
            );
          })}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onCancel={() => handleCancelOrder(selectedOrder._id)}
          showCancelButton={true}
          showUpdateButton={false}
          cancelLoading={cancelOrderMutation.isLoading}
        />
      )}

      {/* Order Edit Modal */}
      {editingOrder && (
        <OrderEditModal
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onSave={handleUpdateOrder}
          timeRemaining={timeRemaining[editingOrder._id]}
          saving={updateOrderMutation.isLoading}
        />
      )}
    </div>
  );
};

export default CustomerDashboard;
