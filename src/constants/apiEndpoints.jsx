export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  SEND_OTP: '/auth/sendotp',
  
  // Products
  GET_ALL_PRODUCTS: '/product/getAllProducts',
  GET_PRODUCT_BY_ID: '/product/getProductById',
  CREATE_PRODUCT: '/product/createProducts',
  UPDATE_PRODUCT: '/product/updateProduct',
  DELETE_PRODUCT: '/product/deleteProduct',
  
  // Cart
  GET_CART: '/cart',
  ADD_TO_CART: '/cart/add',
  UPDATE_CART: '/cart/update',
  REMOVE_FROM_CART: '/cart/remove',
  CLEAR_CART: '/cart/clear',
  CART_COUNT: '/cart/count',
  
  // Orders
  CREATE_ORDER: '/orders/create',
  CREATE_DIRECT_ORDER: '/orders/create-direct',
  ORDER_HISTORY: '/orders/history',
  ALL_ORDERS: '/orders/admin/all',
  GET_ORDER: '/orders',
  CANCEL_ORDER: '/orders/cancel',
  UPDATE_ORDER: '/orders/update',
  UPDATE_ORDER_STATUS: '/orders/admin/update-status',

  // Agent
  GET_ALL_AGENTS: '/orders/admin/agents',          // Owner/Admin can fetch agents list
  GET_AGENT_ORDERS: '/orders/agent/my-orders',     // Agent can see his own orders
  VERIFY_DELIVERY: '/orders/agent/delivery',
  ASSIGN_AGENT: '/orders/admin/assign-agent',       // use with /:orderId


  // Payment
  CAPTURE_PAYMENT: '/payment/capture',
  VERIFY_PAYMENT: '/payment/verify',
};

