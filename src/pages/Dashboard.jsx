import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CustomerDashboard from '../components/dashboard/CustomerDashboard';
import OwnerDashboard from '../components/dashboard/OwnerDashboard';
import AgentDashboard from '../components/dashboard/AgentDashboard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { ROUTES } from '../constants/routes';

const Dashboard = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  console.log("User role:", user?.role);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Dashboard
        </h1>
        <p className="text-xl text-gray-600">
          Welcome back, {user?.firstName}!
        </p>
        {/* Role badge add karein */}
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
          user?.role === 'Owner' ? 'bg-purple-100 text-purple-800' :
          user?.role === 'Agent' ? 'bg-blue-100 text-blue-800' :
          'bg-green-100 text-green-800'
        }`}>
          {user?.role}
        </span>
      </div>

      {/*Role-based dashboard rendering */}
      {user?.role?.toLowerCase() === 'owner' ? (
        <OwnerDashboard />
      ) : user?.role?.toLowerCase() === 'agent' ? (
        <AgentDashboard />
      ) : (
        <CustomerDashboard />
      )}
    </div>
  );
};

export default Dashboard;
