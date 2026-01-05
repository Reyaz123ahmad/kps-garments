import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import Button from '../ui/Button';
import { ROUTES } from '../../constants/routes';

const CartEmptyState = () => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <ShoppingBag className="h-12 w-12 text-gray-400" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Your cart is empty
      </h2>
      
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Looks like you haven't added any items to your cart yet. Start shopping to discover amazing products!
      </p>

      <Link to={ROUTES.PRODUCTS}>
        <Button>
          Start Shopping
        </Button>
      </Link>
    </div>
  );
};

export default CartEmptyState;
