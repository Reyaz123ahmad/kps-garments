const deliveryOTPTemplate = (otp, orderId, customerName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
            .header { background: #007bff; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .otp-box { background: white; padding: 20px; text-align: center; margin: 20px 0; border-radius: 10px; border: 2px dashed #007bff; }
            .otp-code { font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 8px; }
            .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚚 Order Out for Delivery</h1>
            </div>
            <div class="content">
                <p>Dear <strong>${customerName}</strong>,</p>
                <p>Your order <strong>#${orderId}</strong> has been shipped and is out for delivery.</p>
                
                <div class="otp-box">
                    <h3>Delivery OTP</h3>
                    <div class="otp-code">${otp}</div>
                    <p><small>Valid for 24 hours</small></p>
                </div>

                <p><strong>Important:</strong> Please provide this OTP to the delivery agent to receive your order.</p>
                <p>Do not share this OTP with anyone else.</p>
                
                <p>Thank you for shopping with <strong>KPS Garments</strong>!</p>
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

module.exports = deliveryOTPTemplate;
