// module.exports = ({ user, order, shippingAddress, paymentId, enrichedProducts }) => `
//   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//     <div style="background: #FF9800; color: white; padding: 20px; text-align: center;">
//       <h2>📦 New Order Received!</h2>
//     </div>
//     <div style="padding: 20px; background: #f9f9f9;">
//       <p><strong>Customer:</strong> ${user.firstName} ${user.lastName}</p>
//       <p><strong>Email:</strong> ${user.email}</p>
//       <p><strong>Phone:</strong> ${user.phone}</p>
//       <p><strong>Order ID:</strong> ${order._id}</p>
//       <p><strong>Amount:</strong> ₹${order.totalAmount}</p>
//       <p><strong>Payment ID:</strong> ${paymentId}</p>
//       <p><strong>Shipping:</strong> ${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}</p>
//       <p><strong>Products:</strong></p>
//       ${enrichedProducts.map(item => `
//         <p>• ${item.name} (Size: ${item.size}) - Qty: ${item.quantity} - ₹${item.price * item.quantity}</p>
//       `).join('')}
//     </div>
//   </div>
// `;


module.exports = ({ user, order, shippingAddress, paymentId, enrichedProducts = [], type }) => {
  const isCancelled = type === "cancelled";

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: ${isCancelled ? "#f44336" : "#FF9800"}; color: white; padding: 20px; text-align: center;">
        <h2>${isCancelled ? "❌ Order Cancelled by Customer" : "📦 New Order Received!"}</h2>
      </div>
      <div style="padding: 20px; background: #f9f9f9;">
        <p><strong>Customer:</strong> ${user.firstName} ${user.lastName}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Phone:</strong> ${user.phone}</p>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Amount:</strong> ₹${order.totalAmount}</p>
        ${paymentId ? `<p><strong>Payment ID:</strong> ${paymentId}</p>` : ""}
        <p><strong>Shipping:</strong> ${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}</p>
        <p><strong>Products:</strong></p>
        ${enrichedProducts.map(item => `
          <p>• ${item.name} (Size: ${item.size}) - Qty: ${item.quantity} - ₹${item.price * item.quantity}</p>
        `).join('')}
        ${isCancelled ? `<p><strong>Refund Status:</strong> ${order.refundStatus || "initiated"}</p>` : ""}
      </div>
    </div>
  `;
};
