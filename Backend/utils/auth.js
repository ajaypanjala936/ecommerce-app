const crypto = require('crypto');

const verifyUnsubscribeToken = (token, userId) => {
  const secret = process.env.UNSUBSCRIBE_SECRET || 'your-secret-key';
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(userId.toString());
  
  // Tokens are valid for 7 days
  const timestamp = Math.floor(Date.now() / (24 * 60 * 60 * 1000)); // Days since epoch
  hmac.update(timestamp.toString());
  
  const expectedToken = hmac.digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(token), 
    Buffer.from(expectedToken)
  );
};

module.exports = { verifyUnsubscribeToken };