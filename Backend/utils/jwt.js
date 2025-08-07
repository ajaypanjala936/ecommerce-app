const jwt = require('jsonwebtoken');
const { logger } = require('./logger');

const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role || 'user'
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    logger.error('JWT verification failed:', error.message);
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken
};