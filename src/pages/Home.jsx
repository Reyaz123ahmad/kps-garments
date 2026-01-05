


import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, Shield, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import { ROUTES } from '../constants/routes';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: ShoppingBag,
      title: 'Wide Selection',
      description: 'Discover our extensive collection of premium garments for every occasion.'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Quick and reliable shipping to get your orders delivered promptly.'
    },
    {
      icon: Shield,
      title: 'Secure Shopping',
      description: 'Your data and payments are protected with enterprise-grade security.'
    },
    {
      icon: Star,
      title: 'Quality Guarantee',
      description: 'We stand behind the quality of every product in our collection.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Premium Garments
            <span className="block text-blue-200">For Every Style</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Discover the perfect blend of quality, comfort, and style with KPS Garments. 
            Your one-stop destination for premium clothing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={ROUTES.PRODUCTS}>
              <Button size="lg" variant="secondary">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Shop Now
              </Button>
            </Link>
            {!isAuthenticated && (
              <Link to={ROUTES.SIGNUP}>
                <Button size="lg" variant="outline">
                  Create Account
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose KPS Garments?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to providing you with the best shopping experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust KPS Garments for their fashion needs.
          </p>
          <Link to={ROUTES.PRODUCTS}>
            <Button size="lg">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Explore Products
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
