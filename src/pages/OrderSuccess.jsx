


import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Home, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import Button from '../components/ui/Button';
import { ROUTES } from '../constants/routes';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const { clearCart } = useCart();

  useEffect(() => {
    const runClearCart = async () => {
      await clearCart(); // ✅ async call wrapped properly
    };
    runClearCart();
  }, []); // ✅ empty dependency array to avoid re-render loop

  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
      
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Order Confirmed!
      </h1>
      
      <p className="text-lg text-gray-600 mb-6">
        Thank you for your purchase. Your order has been confirmed and will be processed shortly.
      </p>

      <div className="bg-white p-6 rounded-lg shadow-md border mb-8">
        <p className="text-sm text-gray-600 mb-2">Order ID</p>
        <p className="text-xl font-semibold text-blue-600 mb-4">
          #{orderId?.slice(-8).toUpperCase()}
        </p>
        
        <p className="text-sm text-gray-600 mb-2">What's Next?</p>
        <p className="text-gray-700 mb-4">
          You will receive a confirmation email with order details and tracking information.
          Our team will process your order and update you on the shipping status.
        </p>

        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Link to={ROUTES.ORDER_HISTORY}>
            <Button className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>View Orders</span>
            </Button>
          </Link>
          
          <Link to={ROUTES.PRODUCTS}>
            <Button variant="outline" className="flex items-center space-x-2">
              <ShoppingBag className="h-4 w-4" />
              <span>Continue Shopping</span>
            </Button>
          </Link>

          <Link to={ROUTES.HOME}>
            <Button variant="secondary" className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>Go Home</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
        <p className="text-blue-800 text-sm">
          If you have any questions about your order, please contact our customer support 
          at <strong>support@kpsgarments.com</strong> or call us at <strong>+91 9876543210</strong>.
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;
