import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();

// Define log levels (customizing if necessary)
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

// Define a custom format for log messages
const logFormat = winston.format.combine(
  winston.format.colorize(),                         // Colorize logs in console
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),  // Add timestamp
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`) // Log format
);

// Create the logger instance
const logger = winston.createLogger({
  levels: logLevels,
  level: process.env.LOG_LEVEL || 'info',            // Default log level is 'info', can be set via env
  format: logFormat,
  transports: [
    // Console transport for development
    new winston.transports.Console({
      level: 'debug',                                // Show debug logs in the console
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),

    // File transport for production
    new winston.transports.File({
      filename: 'logs/error.log',                    // Error log file
      level: 'error',                                // Only log errors to the file
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',                 // Combined log file for all logs
      level: 'info',                                 // Log info and above
    }),
  ],
});

// In production, log only errors and higher (no debug info)
if (process.env.NODE_ENV === 'production') {
  logger.transports.forEach((t) => {
    if (t instanceof winston.transports.Console) {
      t.silent = true;  // Disable console logs in production
    }
  });
}

export default logger;
