import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { ROUTES } from '../../constants/routes';

const Header = () => {
  const { user, logout, isAuthenticated, isOwner, isAgent } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: ROUTES.HOME },
    { name: 'About', href: ROUTES.ABOUT },
    { name: 'Products', href: ROUTES.PRODUCTS },
  ];

  if (isAuthenticated) {
    if (!isOwner && !isAgent) {
      navigation.push({ name: 'Orders', href: ROUTES.ORDER_HISTORY });
    }
    if (isOwner || isAgent) {
      navigation.push({ name: 'Dashboard', href: ROUTES.DASHBOARD });
    }
  }

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg border-b border-blue-500 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center space-x-3">
            <Package className="h-10 w-10 text-white" />
            <span className="text-2xl font-bold text-white">KPS Garments</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-3 rounded-lg text-lg font-semibold transition-all duration-300 ${
                  location.pathname === item.href
                    ? 'text-white bg-blue-500 shadow-md'
                    : 'text-blue-100 hover:text-white hover:bg-blue-500/50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-3 text-white hover:bg-blue-500 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {/* Cart icon only for customers */}
                {!isOwner && !isAgent && (
                  <Link
                    to={ROUTES.CART}
                    className="relative p-3 text-white hover:bg-blue-500 rounded-lg transition-all duration-300 group"
                  >
                    <ShoppingCart className="h-7 w-7" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-sm font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                )}

                <div className="relative group">
                  <button className="flex items-center p-3 text-white hover:bg-blue-500 rounded-lg transition-all duration-300">
                    <User className="h-7 w-7" />
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-200">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm text-gray-500">Signed in as</p>
                      <p className="text-lg font-semibold text-gray-800">{user.firstName} {user.lastName}</p>
                    </div>
                    <Link
                      to={ROUTES.PROFILE}
                      className="flex items-center space-x-3 px-4 py-3 text-lg text-gray-800 hover:bg-blue-50 transition-colors"
                    >
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full text-left px-4 py-3 text-lg text-gray-800 hover:bg-blue-50 transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-6">
                <Link
                  to={ROUTES.LOGIN}
                  className="text-lg font-semibold text-white hover:text-blue-200 transition-colors px-4 py-2"
                >
                  Login
                </Link>
                <Link
                  to={ROUTES.SIGNUP}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold text-lg hover:bg-blue-50 hover:shadow-lg transition-all duration-300 shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-blue-500 py-4 bg-blue-600/95 backdrop-blur-sm">
            <nav className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-lg font-semibold transition-all ${
                    location.pathname === item.href
                      ? 'text-white bg-blue-500 shadow-md'
                      : 'text-blue-100 hover:text-white hover:bg-blue-500/50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {isAuthenticated && (
                <>
                  <div className="px-4 py-2 border-b border-blue-500/50">
                    <p className="text-sm text-blue-200">Signed in as</p>
                    <p className="text-lg font-semibold text-white">{user.firstName} {user.lastName}</p>
                  </div>

                  {/* Cart icon only for customers in mobile */}
                  {!isOwner && !isAgent && (
                    <Link
                      to={ROUTES.CART}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-lg font-semibold text-blue-100 hover:text-white hover:bg-blue-500/50 transition-all"
                    >
                      <ShoppingCart className="h-6 w-6" />
                      <span>Cart ({totalItems})</span>
                    </Link>
                  )}

                  <Link
                    to={ROUTES.PROFILE}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-lg text-lg font-semibold text-blue-100 hover:text-white hover:bg-blue-500/50 transition-all"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-lg font-semibold text-blue-100 hover:text-white hover:bg-blue-500/50 transition-all text-left"
                  >
                    <LogOut className="h-6 w-6" />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
