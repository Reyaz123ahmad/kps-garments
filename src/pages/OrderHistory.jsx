import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CustomerDashboard from '../components/dashboard/CustomerDashboard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { ROUTES } from '../constants/routes';

const OrderHistory = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Order History
        </h1>
        <p className="text-xl text-gray-600">
          View and manage your orders
        </p>
      </div>

      <CustomerDashboard />
    </div>
  );
};

export default OrderHistory;
