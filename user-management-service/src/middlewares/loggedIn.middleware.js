import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';  // Import the logger

export const checkLoggedIn = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // Extract the token from the Authorization header

  if (token) {
    try {
      // Verify the JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // If the token is valid, log the already logged-in message and return the response
      logger.info(`User already logged in with id : ${decoded.userId}`);
      return res.status(400).json({ message: 'You are already logged in.' });
    } catch (error) {
      // If token is invalid or expired, proceed to login
      next();
    }
  } else {
    // No token found, allow the login to continue
    next();
  }
};
