

import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import CartEmptyState from '../components/cart/CartEmptyState';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { ROUTES } from '../constants/routes';

const Cart = () => {
  const { items, totalPrice, loading } = useCart();

  if (loading) {
    return <LoadingSpinner text="Loading cart..." />;
  }

  if (!Array.isArray(items) || items.length === 0) {
    return <CartEmptyState />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Shopping Cart
        </h1>
        <p className="text-xl text-gray-600">
          Review your items and proceed to checkout
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items
            .filter((item) => item?.product?._id && item.size)
            .map((item) => (
              <CartItem
                key={`${item.product._id}-${item.size}`}
                item={item}
              />
            ))}
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <CartSummary
            items={items}
            totalPrice={totalPrice}
          />
        </div>
      </div>

      {/* Continue Shopping */}
      <div className="mt-8 text-center">
        <Link
          to={ROUTES.PRODUCTS}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Cart;
