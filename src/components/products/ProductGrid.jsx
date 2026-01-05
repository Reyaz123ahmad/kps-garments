import React from 'react';
import ProductCard from './ProductCard';
import LoadingSpinner from '../ui/LoadingSpinner';

const ProductGrid = ({ products, loading, onProductUpdated }) => {
  if (loading) {
    return <LoadingSpinner text="Loading products..." />;
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📦</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No products found
        </h3>
        <p className="text-gray-600">
          Check back later for new arrivals.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onProductUpdated={onProductUpdated}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
