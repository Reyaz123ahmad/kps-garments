import React, { useState } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import Button from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';

const CartItem = ({ item }) => {
  const { updateCartItem, removeFromCart } = useCart();
  const [updating, setUpdating] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdating(true);
    await updateCartItem(item.product._id, newQuantity);
    setUpdating(false);
  };

  const handleRemove = async () => {
    setRemoving(true);
    await removeFromCart(item.product._id);
    setRemoving(false);
  };

  const incrementQuantity = () => {
    handleQuantityChange(item.quantity + 1);
  };

  const decrementQuantity = () => {
    if (item.quantity > 1) {
      handleQuantityChange(item.quantity - 1);
    }
  };

  return (
    <div className="flex items-center space-x-4 bg-white p-4 rounded-lg border border-gray-200">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <img
          src={item.product.image || '/api/placeholder/100/100'}
          alt={item.product.name}
          className="w-16 h-16 object-cover rounded-md"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
          }}
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {item.product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-1">Size: {item.product.size}</p>
        <p className="text-lg font-bold text-blue-600">
          {formatCurrency(item.product.price)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={decrementQuantity}
          disabled={updating || item.quantity <= 1}
          className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Minus className="h-4 w-4" />
        </button>
        
        <span className="w-8 text-center font-medium">
          {item.quantity}
        </span>
        
        <button
          onClick={incrementQuantity}
          disabled={updating}
          className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Total Price */}
      <div className="text-right">
        <p className="text-lg font-bold text-gray-900">
          {formatCurrency(item.product.price * item.quantity)}
        </p>
      </div>

      {/* Remove Button */}
      <Button
        onClick={handleRemove}
        loading={removing}
        variant="danger"
        size="sm"
        className="ml-4"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CartItem;
