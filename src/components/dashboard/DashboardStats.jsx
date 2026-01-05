import React from 'react';
import { ShoppingBag, Users, Package, Truck, DollarSign } from 'lucide-react';

const DashboardStats = ({ stats }) => {
  const statCards = [
    {
      label: 'Total Orders',
      value: stats.total,
      icon: ShoppingBag,
      color: 'blue'
    },
    {
      label: 'Pending Orders',
      value: stats.pending,
      icon: Users,
      color: 'yellow'
    },
    {
      label: 'Confirmed Orders',
      value: stats.confirmed,
      icon: Package,
      color: 'purple'
    },
    {
      label: 'Delivered Orders',
      value: stats.delivered,
      icon: Truck,
      color: 'green'
    }
  ];

  const colorClasses = {
    blue: 'text-blue-500',
    yellow: 'text-yellow-500',
    purple: 'text-purple-500',
    green: 'text-green-500'
  };

  const valueColors = {
    blue: 'text-blue-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',
    green: 'text-green-600'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat) => (
        <div key={stat.label} className="bg-white p-6 rounded-lg shadow border hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <stat.icon className={`h-8 w-8 ${colorClasses[stat.color]}`} />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className={`text-2xl font-bold ${valueColors[stat.color]}`}>
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
