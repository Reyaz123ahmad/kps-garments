import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../hooks/useProducts';
import { usePagination } from '../hooks/usePagination';
import ProductGrid from '../components/products/ProductGrid';
import ProductForm from '../components/products/ProductForm';
import Pagination from '../components/ui/Pagination';
import Button from '../components/ui/Button';
import { PAGINATION } from '../constants/config';

const Products = () => {
  const [showProductForm, setShowProductForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const { user, isOwner } = useAuth();
  const { data: productsResponse, isLoading, refetch } = useProducts();

  const products = productsResponse?.data?.data || [];
  
  const {
    currentPage: paginatedPage,
    totalPages,
    currentItems,
    goToPage
  } = usePagination(products, PAGINATION.PRODUCTS_PER_PAGE);

  const handleProductCreated = () => {
    setShowProductForm(false);
    refetch();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    goToPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div className="mb-4 lg:mb-0">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Our Products
          </h1>
          <p className="text-xl text-gray-600">
            Discover our premium collection of garments
          </p>
        </div>
        
        {isOwner && (
          <Button
            onClick={() => setShowProductForm(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Product</span>
          </Button>
        )}
      </div>

      {/* Products Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {currentItems.length} of {products.length} products
          {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
        </p>
      </div>

      {/* Products Grid */}
      <ProductGrid
        products={currentItems}
        loading={isLoading}
        onProductUpdated={refetch}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm
          onClose={() => setShowProductForm(false)}
          onSuccess={handleProductCreated}
        />
      )}
    </div>
  );
};

export default Products;
