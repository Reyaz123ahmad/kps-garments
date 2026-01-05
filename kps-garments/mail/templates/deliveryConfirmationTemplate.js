const deliveryConfirmationTemplate = (orderId, customerName, agentName, deliveryTime) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: #28a745; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .success-box { background: white; padding: 20px; text-align: center; margin: 20px 0; border-radius: 10px; border: 2px solid #28a745; }
            .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✅ Order Delivered Successfully!</h1>
            </div>
            <div class="content">
                <p>Dear <strong>${customerName}</strong>,</p>
                
                <div class="success-box">
                    <h3>Your order has been delivered!</h3>
                    <p><strong>Order ID:</strong> #${orderId}</p>
                    <p><strong>Delivered by:</strong> ${agentName}</p>
                    <p><strong>Delivery Time:</strong> ${deliveryTime}</p>
                </div>

                <p>Thank you for shopping with <strong>KPS Garments</strong>!</p>
                <p>We hope to see you again soon.</p>
            </div>
            <div class="footer">
                <p>This is an automated email. Please do not reply.</p>
                <p>© 2024 KPS Garments. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

module.exports = deliveryConfirmationTemplate;
