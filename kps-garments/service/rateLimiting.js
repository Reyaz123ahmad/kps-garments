const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 2, 
    // 2 login attempts per hour
    message: {
        success: false,
        message: 'Too many login attempts, please try again after an hour'
    }
});
module.exports = { authLimiter };

