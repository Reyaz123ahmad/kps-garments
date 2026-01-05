import React from 'react';
import { Search, Filter } from 'lucide-react';
import Button from '../ui/Button';

const OrderManagement = ({ 
  orders, 
  onStatusFilter, 
  onSearch, 
  searchTerm,
  statusFilter 
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow border mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Order Management
          </h3>
          <p className="text-sm text-gray-600">
            Manage and track customer orders
          </p>
        </div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 pt-6 border-t">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
          <p className="text-sm text-gray-600">Total</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {orders.filter(o => o.status === 'pending').length}
          </p>
          <p className="text-sm text-gray-600">Pending</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">
            {orders.filter(o => o.status === 'confirmed').length}
          </p>
          <p className="text-sm text-gray-600">Confirmed</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">
            {orders.filter(o => o.status === 'shipped').length}
          </p>
          <p className="text-sm text-gray-600">Shipped</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">
            {orders.filter(o => o.status === 'delivered').length}
          </p>
          <p className="text-sm text-gray-600">Delivered</p>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
