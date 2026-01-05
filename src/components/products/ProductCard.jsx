import React, { useState } from 'react';
import { Edit2, Trash2, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import ProductForm from './ProductForm';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { useDeleteProduct } from '../../hooks/useProducts';
import Button from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';

const ProductCard = ({ product, onProductUpdated }) => {
  const { user, isOwner } = useAuth();
  const { addToCart } = useCart();
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addToCartLoading, setAddToCartLoading] = useState(false);

  const deleteProductMutation = useDeleteProduct();

  const handleAddToCart = async () => {
    setAddToCartLoading(true);
    await addToCart(product._id, 1);
    setAddToCartLoading(false);
  };

  const handleDelete = async () => {
    await deleteProductMutation.mutateAsync(product._id);
    setShowDeleteModal(false);
    onProductUpdated?.();
  };

  const handleProductUpdated = () => {
    setShowEditForm(false);
    onProductUpdated?.();
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200">
        {/* Product Image */}
        <div className="aspect-w-16 aspect-h-12 bg-gray-200">
          <img
            src={product.image || '/no-image.png'}
            alt={product.name}
            className="w-full h-48 object-cover"
            onError={(e) => {
              if (!e.target.src.includes('/no-image.png')) {
                e.target.src = '/no-image.png';
              }
            }}
          />
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
            {product.description}
          </p>

          <div className="flex justify-between items-center mb-3">
            <span className="text-2xl font-bold text-blue-600">
              {formatCurrency(product.price)}
            </span>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              Size: {product.size}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            {/* Add to Cart - Only for Customers */}
            {!isOwner && user && (
              <Button
                onClick={handleAddToCart}
                loading={addToCartLoading}
                className="flex-1 flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Add to Cart</span>
              </Button>
            )}

            {/* Edit & Delete - Only for Owner */}
            {isOwner && (
              <>
                <Button
                  onClick={() => setShowEditForm(true)}
                  variant="outline"
                  className="flex-1 flex items-center justify-center space-x-2"
                >
                  <Edit2 className="h-4 w-4" />
                  <span>Edit</span>
                </Button>
                <Button
                  onClick={() => setShowDeleteModal(true)}
                  variant="danger"
                  className="flex-1 flex items-center justify-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </Button>
              </>
            )}
          </div>

          {/* Login Prompt for Guests */}
          {!user && (
            <Button
              onClick={() => window.location.href = '/login'}
              className="w-full"
            >
              Login to Add to Cart
            </Button>
          )}
        </div>
      </div>

      {/* Edit Product Modal */}
      {showEditForm && (
        <ProductForm
          product={product}
          onClose={() => setShowEditForm(false)}
          onSuccess={handleProductUpdated}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          productName={product.name}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          loading={deleteProductMutation.isLoading}
        />
      )}
    </>
  );
};

export default ProductCard;

