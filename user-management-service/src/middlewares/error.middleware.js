import logger from '../utils/logger.js';

/**
 * Error handling middleware for catching and responding to errors in the app.
 * @param {Error} err - The error object
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {Function} next - The next middleware function
 */
export const errorHandler = (err, req, res, next) => {
  // Set default values for the error response
  const statusCode = err.statusCode || 500;
  const environment = process.env.NODE_ENV || 'development';

  // Error message to be sent in the response
  const errorResponse = {
    success: false,
    message: err.message || 'Internal Server Error',
  };

  // Detailed stack trace only in development mode
  if (environment === 'development') {
    errorResponse.stack = err.stack;
  }

  // Log the error with the appropriate level
  if (statusCode >= 500) {
    logger.error(`Server Error: ${err.message}`, { stack: err.stack });
  } else {
    logger.warn(`Client Error: ${err.message}`);
  }

  // Send the error response
  res.status(statusCode).json(errorResponse);
};
