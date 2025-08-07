require('dotenv').config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET || 9652145485,
  mongoURI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/carrental',
  port: process.env.PORT || 5000,
  clientURL: process.env.CLIENT_URL || 'http://localhost:3000',
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS
};