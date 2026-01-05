import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Mail, Phone, MapPin } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <Link to={ROUTES.HOME} className="flex items-center space-x-2 mb-4">
              <Package className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">KPS Garments</span>
            </Link>
            <p className="text-gray-300 mb-4 max-w-md">
              Premium quality garments and clothing store. We provide the best quality products with excellent customer service.
            </p>
            <div className="flex items-center space-x-4 text-gray-300">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>‪+91 9876543210‬</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>support@kpsgarments.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to={ROUTES.HOME} className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PRODUCTS} className="text-gray-300 hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to={ROUTES.ORDER_HISTORY} className="text-gray-300 hover:text-white transition-colors">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to={ROUTES.DASHBOARD} className="text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Visit Us</h3>
            <div className="flex items-start space-x-2 text-gray-300 mb-2">
              <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <span>
                123 Fashion Street<br />
                Mumbai, Maharashtra<br />
                400001, India
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} KPS Garments. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
