import jwt from 'jsonwebtoken';
import { verifyToken } from '../utils/jwt.util.js';
import logger from '../utils/logger.js';

// Middleware for validating JWT token
export const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // Expecting "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Verify token and decode user data
    const decoded = verifyToken(token);
    req.user = decoded;  // Add user data to the request
    next();  // Proceed to the next middleware or route
  } catch (error) {
    logger.error(`Unauthorized access attempt: ${error.message}`);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
