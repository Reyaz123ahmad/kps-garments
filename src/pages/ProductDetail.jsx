import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { ShoppingCart, Package, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatCurrency } from '../utils/formatters';
import { ROUTES } from '../constants/routes';

const ProductDetail = () => {
  const { id } = useParams();
  const [addToCartLoading, setAddToCartLoading] = useState(false);
  
  const { data: productResponse, isLoading, error } = useProduct(id);
  const { user, isOwner } = useAuth();
  const { addToCart } = useCart();

  const product = productResponse?.data?.data;

  const handleAddToCart = async () => {
    setAddToCartLoading(true);
    await addToCart(product._id, 1);
    setAddToCartLoading(false);
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading product..." />;
  }

  if (error || !product) {
    return <Navigate to={ROUTES.PRODUCTS} replace />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <Link
        to={ROUTES.PRODUCTS}
        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Products
      </Link>

      <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* Product Image */}
          <div className="flex justify-center">
            <img
              src={product.image || '/api/placeholder/500/500'}
              alt={product.name}
              className="w-full max-w-md h-96 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/500x500?text=No+Image';
              }}
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-2xl font-bold text-blue-600 mb-4">
                {formatCurrency(product.price)}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Package className="h-4 w-4 mr-1" />
                  <span>Size: {product.size}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-6">
              {!isOwner && user ? (
                <Button
                  onClick={handleAddToCart}
                  loading={addToCartLoading}
                  className="w-full flex items-center justify-center space-x-2"
                  size="lg"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Add to Cart</span>
                </Button>
              ) : !user ? (
                <Link to={ROUTES.LOGIN} className="block">
                  <Button className="w-full" size="lg">
                    Login to Add to Cart
                  </Button>
                </Link>
              ) : null}
            </div>

            {/* Owner Message */}
            {isOwner && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>Owner View:</strong> This product is visible to customers. 
                  You can edit or delete it from the products page.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
