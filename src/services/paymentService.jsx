import { paymentAPI } from './api/payment';
import { CONFIG } from '../constants/config';
import toast from 'react-hot-toast';

// ✅ Custom script loader
const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};


export const initiateRazorpayPayment = async (orderData) => {
  try {
    const isScriptLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!isScriptLoaded) {
      toast.error('Failed to load Razorpay SDK. Please check your internet connection.');
      return;
    }

    // ✅ Call backend to create Razorpay order
    const response = await paymentAPI.capture({
      products: orderData.products,
      totalAmount: orderData.totalAmount,
      shippingAddress: orderData.shippingAddress
    });

    const { orderId, amount, currency } = response.data;

    const options = {
      key: CONFIG.RAZORPAY_KEY,
      amount,
      currency,
      name: CONFIG.APP_NAME,
      description: 'Order Payment',
      order_id: orderId,
      handler: async (paymentResponse) => {
        await handlePaymentSuccess(paymentResponse, {
          products: orderData.products,
          totalAmount: orderData.totalAmount,
          shippingAddress: orderData.shippingAddress
        });
      },
      prefill: {
        contact: orderData.shippingAddress?.phone
      },
      theme: { color: '#2563eb' },
      modal: {
        ondismiss: () => toast.error('Payment cancelled')
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (error) {
    console.error('Payment initiation failed:', error);
    toast.error('Failed to initiate payment');
    throw error;
  }
};


const handlePaymentSuccess = async (paymentResponse, orderData) => {
  try {
    const verificationData = {
      razorpay_order_id: paymentResponse.razorpay_order_id,
      razorpay_payment_id: paymentResponse.razorpay_payment_id,
      razorpay_signature: paymentResponse.razorpay_signature,
      products: orderData.products,
      totalAmount: orderData.totalAmount,
      shippingAddress: orderData.shippingAddress
    };

    const result = await paymentAPI.verify(verificationData);

    if (result.data.success) {
      toast.success('Payment successful!');
      window.location.href = `/order-success/${result.data.order._id}`;
    } else {
      toast.error('Payment verification failed. Please contact support.');
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    toast.error('Payment processing failed. Please try again.');
  }
};
