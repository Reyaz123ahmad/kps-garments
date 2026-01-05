import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { ROUTES } from '../../constants/routes';

const CartSummary = ({ items, totalPrice }) => {
  const { isAuthenticated } = useAuth();

  const shippingCharge = totalPrice > 0 ? 50 : 0;
  const finalTotal = totalPrice + shippingCharge;

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 sticky top-4">
      <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{formatCurrency(totalPrice)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">
            {shippingCharge > 0 ? formatCurrency(shippingCharge) : 'Free'}
          </span>
        </div>
        
        <div className="border-t pt-3">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-blue-600">{formatCurrency(finalTotal)}</span>
          </div>
        </div>
      </div>

      {isAuthenticated ? (
        <Link to={ROUTES.CHECKOUT}>
          <Button className="w-full" disabled={items.length === 0}>
            Proceed to Checkout
          </Button>
        </Link>
      ) : (
        <Link to={ROUTES.LOGIN}>
          <Button className="w-full">
            Login to Checkout
          </Button>
        </Link>
      )}

      {items.length === 0 && (
        <p className="text-sm text-gray-500 text-center mt-3">
          Add items to your cart to checkout
        </p>
      )}
    </div>
  );
};

export default CartSummary;
