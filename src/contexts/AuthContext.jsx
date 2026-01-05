import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api/auth';
import toast from 'react-hot-toast';
import { useMemo } from 'react';
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  if (token && userData) {
    const parsed = JSON.parse(userData);
    console.log("Loaded user from localStorage:", parsed);
    setUser(parsed);
  }
  setLoading(false);
}, []);


  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, error: message };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authAPI.signup(userData);
      toast.success('Registration successful! Please login.');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const sendOTP = async (emailData) => {
    try {
      await authAPI.sendOTP(emailData);
      toast.success('OTP sent to your email');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send OTP';
      return { success: false, error: message };
    }
  };

  
  

const value = useMemo(() => ({
  user,
  login,
  signup,
  logout,
  sendOTP,
  isAuthenticated: !!user,
  isOwner: user?.role?.toLowerCase() === 'owner',
  isCustomer: user?.role?.toLowerCase() === 'customer',
  isAgent: user?.role?.toLowerCase() === "agent",
  loading
}), [user, loading]);


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
