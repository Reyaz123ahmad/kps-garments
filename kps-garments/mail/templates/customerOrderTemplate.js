
module.exports = ({ user, order, shippingAddress, paymentId, type }) => {
  const isCancelled = type === "cancelled";

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: ${isCancelled ? "#f44336" : "#4CAF50"}; color: white; padding: 20px; text-align: center;">
        <h2>${isCancelled ? "❌ Order Cancelled" : "🎉 Order Confirmed!"}</h2>
      </div>
      <div style="padding: 20px; background: #f9f9f9;">
        <p>Dear <strong>${user.firstName} ${user.lastName}</strong>,</p>
        <p>
          ${isCancelled
            ? "Your order has been cancelled and refund has been initiated."
            : "Your payment has been successfully processed and your order is confirmed!"}
        </p>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
        ${paymentId ? `<p><strong>Payment ID:</strong> ${paymentId}</p>` : ""}
        <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p>Shipping Address: ${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}</p>
        <p>Phone: ${shippingAddress.phone}</p>
        ${
          isCancelled
            ? "<p>Refund will be processed within 5–7 business days.</p>"
            : "<p>Thank you for shopping with KPS Garments! 🛍</p>"
        }
      </div>
    </div>
  `;
};
