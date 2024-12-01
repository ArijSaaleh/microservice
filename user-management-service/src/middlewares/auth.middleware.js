import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

// JWT authentication middleware
export const authMiddleware = (req, res, next) => {
  // Get the token from the Authorization header (Bearer <token>)
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Attach user information to the request object
    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    logger.error(`Unauthorized access attempt: ${error.message}`);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
